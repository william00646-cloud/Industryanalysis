"""Portfolio loading and point-in-time (snapshot) calculations.

Everything here is arithmetic over already-fetched prices; it never
fetches data itself, which keeps it easy to unit test with synthetic
inputs. All TWD conversions are explicit so every number is traceable
back to a shares/price/fx triple.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from config.settings import (
    DEFAULT_SECTOR_MAP,
    MAX_DRAWDOWN_ALERT,
    MAX_SECTOR_WEIGHT,
    MAX_SINGLE_HOLDING_WEIGHT,
    MAX_TW_MARKET_WEIGHT,
    PORTFOLIO_CSV,
    SINGLE_HOLDING_DROP_ALERT,
    USD_EXPOSURE_WARN_THRESHOLD,
)
from src.models import LatestPriceResult
from src.validators import ValidationResult, validate_portfolio_df


@dataclass
class PortfolioLoadResult:
    df: pd.DataFrame
    validation: ValidationResult


def load_portfolio(csv_path: str | None = None) -> PortfolioLoadResult:
    """Read and validate portfolio.csv, filling in the sector lookup if absent.

    Returns the parsed DataFrame regardless of validation outcome so the
    caller can decide whether to proceed; `validation.ok` signals whether
    the data is safe to compute with.
    """
    path = csv_path or PORTFOLIO_CSV
    df = pd.read_csv(path)
    validation = validate_portfolio_df(df)
    if not validation.ok:
        return PortfolioLoadResult(df, validation)

    df = df.copy()
    df["purchase_date"] = pd.to_datetime(df["purchase_date"]).dt.date
    if "sector" not in df.columns:
        df["sector"] = df["ticker"].map(DEFAULT_SECTOR_MAP).fillna("Unclassified")
    else:
        df["sector"] = df["sector"].fillna(df["ticker"].map(DEFAULT_SECTOR_MAP)).fillna("Unclassified")
    df["shares"] = df["shares"].astype(float)
    df["average_cost"] = df["average_cost"].astype(float)
    return PortfolioLoadResult(df, validation)


def build_holdings_snapshot(
    portfolio_df: pd.DataFrame,
    latest_prices: dict[str, LatestPriceResult],
    usdtwd_rate: float | None,
    usdtwd_warning: str | None,
) -> pd.DataFrame:
    """Build the per-holding snapshot table (market value, PnL, weight, ...).

    Rows whose latest price is unavailable keep NaN for price-derived
    columns and set `data_ok=False` -- they are never silently dropped or
    estimated, only excluded from weight/aggregate math where noted.
    """
    rows = []
    for _, holding in portfolio_df.iterrows():
        ticker = holding["ticker"]
        currency = holding["currency"]
        price_result = latest_prices.get(ticker)

        fx_rate = 1.0 if currency == "TWD" else usdtwd_rate
        fx_ok = fx_rate is not None
        data_ok = bool(price_result and price_result.success and fx_ok)

        latest_price = price_result.price if price_result else None
        prev_close = price_result.previous_close if price_result else None

        cost_value_twd = holding["shares"] * holding["average_cost"] * (
            fx_rate if currency != "TWD" and fx_rate is not None else (1.0 if currency == "TWD" else np.nan)
        )

        if data_ok:
            market_value_local = holding["shares"] * latest_price
            market_value_twd = market_value_local * fx_rate
            unrealized_pnl_twd = market_value_twd - cost_value_twd
            return_pct = unrealized_pnl_twd / cost_value_twd if cost_value_twd else np.nan
            today_change_pct = (
                (latest_price - prev_close) / prev_close if prev_close else np.nan
            )
            today_pnl_twd = (
                holding["shares"] * (latest_price - prev_close) * fx_rate if prev_close else np.nan
            )
        else:
            market_value_local = market_value_twd = unrealized_pnl_twd = np.nan
            return_pct = today_change_pct = today_pnl_twd = np.nan

        warning_parts = []
        if price_result and price_result.warning:
            warning_parts.append(price_result.warning)
        if currency != "TWD" and usdtwd_warning:
            warning_parts.append(usdtwd_warning)
        if not price_result or not price_result.success:
            warning_parts.append("最新價格取得失敗")

        rows.append(
            {
                "ticker": ticker,
                "name": holding["name"],
                "shares": holding["shares"],
                "average_cost": holding["average_cost"],
                "currency": currency,
                "asset_class": holding["asset_class"],
                "sector": holding["sector"],
                "purchase_date": holding["purchase_date"],
                "latest_price": latest_price,
                "market_value_local": market_value_local,
                "market_value_twd": market_value_twd,
                "cost_value_twd": cost_value_twd,
                "unrealized_pnl_twd": unrealized_pnl_twd,
                "return_pct": return_pct,
                "today_change_pct": today_change_pct,
                "today_pnl_twd": today_pnl_twd,
                "data_ok": data_ok,
                "used_fallback": bool(price_result and price_result.used_fallback),
                "warning": "; ".join(warning_parts) if warning_parts else None,
            }
        )

    holdings = pd.DataFrame(rows)
    total_market_value = holdings.loc[holdings["data_ok"], "market_value_twd"].sum()
    holdings["weight"] = np.where(
        holdings["data_ok"] & (total_market_value > 0),
        holdings["market_value_twd"] / total_market_value,
        np.nan,
    )
    return holdings


@dataclass
class PortfolioSummary:
    total_market_value_twd: float
    total_cost_twd: float
    unrealized_pnl_twd: float
    unrealized_return_pct: float
    today_pnl_twd: float
    num_holdings: int
    max_weight_ticker: str | None
    max_weight_pct: float | None
    tw_weight_pct: float
    us_weight_pct: float
    holdings_with_data: int
    holdings_missing_data: list[str]


def compute_summary(holdings: pd.DataFrame) -> PortfolioSummary:
    """Aggregate the holdings snapshot into the headline Overview metrics."""
    valid = holdings[holdings["data_ok"]]
    total_market_value = float(valid["market_value_twd"].sum())
    total_cost = float(holdings["cost_value_twd"].sum(skipna=True))
    unrealized_pnl = total_market_value - float(valid["cost_value_twd"].sum())
    unrealized_return = unrealized_pnl / valid["cost_value_twd"].sum() if valid["cost_value_twd"].sum() else float("nan")
    today_pnl = float(valid["today_pnl_twd"].sum(skipna=True))

    if not valid.empty and total_market_value > 0:
        top = valid.loc[valid["weight"].idxmax()]
        max_weight_ticker, max_weight_pct = top["ticker"], float(top["weight"])
    else:
        max_weight_ticker, max_weight_pct = None, None

    tw_value = float(valid.loc[valid["asset_class"] == "TW_EQUITY", "market_value_twd"].sum())
    us_value = float(valid.loc[valid["asset_class"] == "US_EQUITY", "market_value_twd"].sum())
    denom = tw_value + us_value
    tw_weight = tw_value / denom if denom else float("nan")
    us_weight = us_value / denom if denom else float("nan")

    return PortfolioSummary(
        total_market_value_twd=total_market_value,
        total_cost_twd=total_cost,
        unrealized_pnl_twd=unrealized_pnl,
        unrealized_return_pct=unrealized_return,
        today_pnl_twd=today_pnl,
        num_holdings=len(holdings),
        max_weight_ticker=max_weight_ticker,
        max_weight_pct=max_weight_pct,
        tw_weight_pct=tw_weight,
        us_weight_pct=us_weight,
        holdings_with_data=int(valid.shape[0]),
        holdings_missing_data=holdings.loc[~holdings["data_ok"], "ticker"].tolist(),
    )


@dataclass
class RiskAlert:
    level: str  # "warning" | "critical" | "info"
    title: str
    detail: str


def evaluate_risk_alerts(
    holdings: pd.DataFrame,
    summary: PortfolioSummary,
    max_drawdown: float,
) -> list[RiskAlert]:
    """Evaluate the fixed set of first-version risk rules against current data.

    Each rule is a simple, explainable threshold from `config.settings` --
    no factor models, no Monte Carlo. Returns an empty list when nothing
    is triggered.
    """
    alerts: list[RiskAlert] = []
    valid = holdings[holdings["data_ok"]]

    if summary.max_weight_pct is not None and summary.max_weight_pct > MAX_SINGLE_HOLDING_WEIGHT:
        alerts.append(
            RiskAlert(
                "warning",
                "單一持股集中度過高",
                f"{summary.max_weight_ticker} 權重 {summary.max_weight_pct:.1%}，超過門檻 {MAX_SINGLE_HOLDING_WEIGHT:.0%}",
            )
        )

    if not valid.empty:
        sector_weights = valid.groupby("sector")["weight"].sum()
        for sector, limit in MAX_SECTOR_WEIGHT.items():
            weight = float(sector_weights.get(sector, 0.0))
            if weight > limit:
                alerts.append(
                    RiskAlert(
                        "warning",
                        f"{sector} 類股比重過高",
                        f"{sector} 合計權重 {weight:.1%}，超過門檻 {limit:.0%}",
                    )
                )

    if not pd.isna(summary.tw_weight_pct) and summary.tw_weight_pct > MAX_TW_MARKET_WEIGHT:
        alerts.append(
            RiskAlert(
                "warning",
                "台灣市場比重過高",
                f"台股權重 {summary.tw_weight_pct:.1%}，超過門檻 {MAX_TW_MARKET_WEIGHT:.0%}",
            )
        )

    if not valid.empty:
        usd_weight = float(valid.loc[valid["currency"] == "USD", "weight"].sum())
        if usd_weight > USD_EXPOSURE_WARN_THRESHOLD:
            alerts.append(
                RiskAlert(
                    "info",
                    "美元曝險",
                    f"美元計價持股占投組 {usd_weight:.1%}，匯率波動會直接影響台幣報酬",
                )
            )

    for _, row in valid.iterrows():
        if not pd.isna(row["return_pct"]) and row["return_pct"] < SINGLE_HOLDING_DROP_ALERT:
            alerts.append(
                RiskAlert(
                    "critical",
                    f"{row['name']} 未實現虧損超過門檻",
                    f"{row['ticker']} 未實現報酬率 {row['return_pct']:.1%}，低於門檻 {SINGLE_HOLDING_DROP_ALERT:.0%}",
                )
            )

    if not pd.isna(max_drawdown) and max_drawdown < MAX_DRAWDOWN_ALERT:
        alerts.append(
            RiskAlert(
                "critical",
                "投資組合最大回撤過大",
                f"最大回撤 {max_drawdown:.1%}，超過門檻 {MAX_DRAWDOWN_ALERT:.0%}",
            )
        )

    return alerts
