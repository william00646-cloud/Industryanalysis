"""Composes the full dashboard state for one Streamlit render pass.

Every page imports `load_dashboard_state()` so they all see the same
numbers computed the same way. The heavy lifting (network fetches) is
delegated to `cache_layer`, so repeated Streamlit re-runs within the TTL
window are cheap.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime

import pandas as pd
import streamlit as st

from config.settings import HISTORY_TTL_SECONDS, MAX_STALE_DAYS_FOR_LATEST_PRICE, USDTWD_TICKER
from src import cache_layer
from src.analytics import PerformanceSeries, build_portfolio_value_series, compute_contribution, compute_drawdown, rebase_to_100
from src.benchmark import BenchmarkResult
from src.portfolio_engine import (
    PortfolioSummary,
    RiskAlert,
    build_holdings_snapshot,
    compute_summary,
    evaluate_risk_alerts,
    load_portfolio,
)
from src.validators import ValidationResult, check_price_freshness


@dataclass
class DataStatusRecord:
    key: str
    source: str
    success: bool
    used_fallback: bool
    warning: str | None
    as_of: str | None


@dataclass
class DashboardState:
    generated_at: datetime
    portfolio_df: pd.DataFrame
    validation: ValidationResult
    holdings: pd.DataFrame
    summary: PortfolioSummary | None
    performance: PerformanceSeries | None
    comparison_df: pd.DataFrame
    drawdown: pd.Series
    max_drawdown: float
    max_drawdown_date: pd.Timestamp | None
    contribution: pd.DataFrame
    risk_alerts: list[RiskAlert]
    benchmark: BenchmarkResult | None
    data_status: list[DataStatusRecord] = field(default_factory=list)


@st.cache_data(ttl=HISTORY_TTL_SECONDS, show_spinner="更新市場資料中...")
def load_dashboard_state() -> DashboardState:
    """Fetch and compute everything the dashboard pages need, once per TTL."""
    now = datetime.now()
    load_result = load_portfolio()
    status: list[DataStatusRecord] = []

    if not load_result.validation.ok:
        return DashboardState(
            now, load_result.df, load_result.validation, pd.DataFrame(), None, None,
            pd.DataFrame(), pd.Series(dtype=float), float("nan"), None, pd.DataFrame(), [], None, status,
        )

    portfolio_df = load_result.df
    tickers = portfolio_df["ticker"].tolist()
    today = date.today()
    earliest_purchase = min(portfolio_df["purchase_date"])

    latest_prices = {t: cache_layer.get_latest_price_cached(t) for t in tickers}
    for t, lp in latest_prices.items():
        status.append(
            DataStatusRecord(t, lp.source, lp.success, lp.used_fallback, lp.warning, str(lp.as_of) if lp.as_of is not None else None)
        )

    fx_latest = cache_layer.get_latest_price_cached(USDTWD_TICKER)
    status.append(
        DataStatusRecord("USD/TWD", fx_latest.source, fx_latest.success, fx_latest.used_fallback, fx_latest.warning,
                          str(fx_latest.as_of) if fx_latest.as_of is not None else None)
    )
    freshness_warning = check_price_freshness(fx_latest.as_of, MAX_STALE_DAYS_FOR_LATEST_PRICE)

    holdings = build_holdings_snapshot(
        portfolio_df, latest_prices, fx_latest.price, fx_latest.warning or freshness_warning
    )
    summary = compute_summary(holdings)

    price_histories: dict[str, pd.DataFrame | None] = {}
    for _, row in portfolio_df.iterrows():
        hist_result = cache_layer.get_price_history_cached(row["ticker"], row["purchase_date"], today)
        price_histories[row["ticker"]] = hist_result.data
        status.append(
            DataStatusRecord(
                f"{row['ticker']} (歷史價格)", hist_result.source, hist_result.success,
                hist_result.used_fallback, hist_result.warning,
                str(hist_result.data.index[-1]) if hist_result.data is not None and not hist_result.data.empty else None,
            )
        )

    fx_hist_result = cache_layer.get_usdtwd_history_cached(earliest_purchase, today)
    status.append(
        DataStatusRecord(
            "USD/TWD (歷史)", fx_hist_result.source, fx_hist_result.success, fx_hist_result.used_fallback,
            fx_hist_result.warning,
            str(fx_hist_result.data.index[-1]) if fx_hist_result.data is not None and not fx_hist_result.data.empty else None,
        )
    )

    performance = build_portfolio_value_series(portfolio_df, price_histories, fx_hist_result.data)

    benchmark = cache_layer.get_taiex_history_cached(earliest_purchase, today)
    status.append(
        DataStatusRecord(
            f"TAIEX ({benchmark.ticker})", benchmark.fetch.source, benchmark.fetch.success,
            benchmark.fetch.used_fallback, benchmark.fetch.warning,
            str(benchmark.fetch.data.index[-1]) if benchmark.fetch.data is not None and not benchmark.fetch.data.empty else None,
        )
    )

    if not performance.daily.empty:
        portfolio_index = rebase_to_100(performance.daily["total_value_twd"])
        drawdown, max_dd, max_dd_date = compute_drawdown(performance.daily["total_value_twd"])
    else:
        portfolio_index = pd.Series(dtype=float)
        drawdown, max_dd, max_dd_date = pd.Series(dtype=float), float("nan"), None

    if benchmark.fetch.data is not None and not benchmark.fetch.data.empty and not portfolio_index.empty:
        benchmark_close = benchmark.fetch.data["Close"].reindex(portfolio_index.index).ffill()
        benchmark_index = rebase_to_100(benchmark_close)
    else:
        benchmark_index = pd.Series(dtype=float)

    comparison_df = pd.DataFrame({"portfolio_index": portfolio_index}).join(
        pd.DataFrame({"benchmark_index": benchmark_index}), how="left"
    )

    contribution = compute_contribution(holdings, performance.total_cost_twd)
    risk_alerts = evaluate_risk_alerts(holdings, summary, max_dd)

    return DashboardState(
        generated_at=now,
        portfolio_df=portfolio_df,
        validation=load_result.validation,
        holdings=holdings,
        summary=summary,
        performance=performance,
        comparison_df=comparison_df,
        drawdown=drawdown,
        max_drawdown=max_dd,
        max_drawdown_date=max_dd_date,
        contribution=contribution,
        risk_alerts=risk_alerts,
        benchmark=benchmark,
        data_status=status,
    )
