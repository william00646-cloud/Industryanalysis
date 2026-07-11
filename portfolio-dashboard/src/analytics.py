"""Time-series performance analytics: cash-weighted portfolio curve,
drawdown, per-holding contribution, and benchmark comparison.

Core rule for the performance curve: capital allocated to a holding that
hasn't been purchased yet is treated as idle TWD cash (0% return), never
as if it had been invested since the earliest purchase date. This keeps
the "since inception" curve honest about what was actually at risk.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from src.fx import usdtwd_rate_on


@dataclass
class PerformanceSeries:
    daily: pd.DataFrame  # columns: invested_value_twd, cash_twd, total_value_twd, cumulative_return
    total_cost_twd: float
    warnings: list[str]


def _holding_twd_cost_basis(shares: float, average_cost: float, currency: str, fx_history: pd.DataFrame | None, purchase_date: pd.Timestamp) -> tuple[float, str | None]:
    """TWD value reserved for a holding before it is purchased.

    Uses the USD/TWD rate on the purchase date (or nearest prior quote) so
    the pre-purchase "cash" figure matches the amount actually deployed.
    """
    if currency == "TWD":
        return shares * average_cost, None
    if fx_history is None or fx_history.empty:
        return float("nan"), "缺少購買日附近的匯率資料，無法換算現金基準"
    rate, used_fallback = usdtwd_rate_on(pd.Timestamp(purchase_date), fx_history)
    if rate is None:
        return float("nan"), "缺少購買日附近的匯率資料，無法換算現金基準"
    warning = "購買日無精確匯率報價，使用最近一個有效交易日匯率" if used_fallback else None
    return shares * average_cost * rate, warning


def _longest_forward_filled_gap(raw_close: pd.Series) -> int:
    """Longest run of missing quotes (in calendar days) after the first valid one."""
    first_valid = raw_close.first_valid_index()
    if first_valid is None:
        return 0
    after_listing = raw_close.loc[first_valid:]
    is_missing = after_listing.isna()
    if not is_missing.any():
        return 0
    group_id = (~is_missing).cumsum()
    run_lengths = is_missing.groupby(group_id).sum()
    return int(run_lengths.max())


def build_portfolio_value_series(
    portfolio_df: pd.DataFrame,
    price_histories: dict[str, pd.DataFrame],
    fx_history: pd.DataFrame | None,
) -> PerformanceSeries:
    """Build the daily cash-weighted total portfolio value series (TWD).

    `price_histories` maps ticker -> OHLCV DataFrame (must contain 'Close').
    Days are the union of all available trading days across holdings,
    restricted to [earliest purchase date, latest available price date].
    Each holding's price is forward-filled onto that master calendar (to
    bridge TW/US calendar mismatches) but never before its own first
    available price, and never beyond a 5-day gap without a warning.
    """
    warnings: list[str] = []
    if portfolio_df.empty:
        return PerformanceSeries(pd.DataFrame(), 0.0, ["持股清單為空"])

    all_dates: list[pd.Timestamp] = []
    for ticker, hist in price_histories.items():
        if hist is not None and not hist.empty:
            all_dates.extend(hist.index.tolist())
    if not all_dates:
        return PerformanceSeries(pd.DataFrame(), 0.0, ["沒有任何標的的歷史價格可用，無法建立績效曲線"])

    earliest_purchase = pd.Timestamp(min(portfolio_df["purchase_date"]))
    master_calendar = pd.DatetimeIndex(sorted(set(all_dates)))
    master_calendar = master_calendar[master_calendar >= earliest_purchase]
    if master_calendar.empty:
        return PerformanceSeries(pd.DataFrame(), 0.0, ["沒有購買日之後的價格資料"])

    invested_value = pd.Series(0.0, index=master_calendar)
    cash_value = pd.Series(0.0, index=master_calendar)
    total_cost_twd = 0.0

    for _, holding in portfolio_df.iterrows():
        ticker = holding["ticker"]
        currency = holding["currency"]
        purchase_ts = pd.Timestamp(holding["purchase_date"])
        shares = float(holding["shares"])

        cost_twd, cost_warning = _holding_twd_cost_basis(
            shares, float(holding["average_cost"]), currency, fx_history, purchase_ts
        )
        if cost_warning:
            warnings.append(f"{ticker}: {cost_warning}")
        if np.isnan(cost_twd):
            continue
        total_cost_twd += cost_twd

        hist = price_histories.get(ticker)
        if hist is None or hist.empty or "Close" not in hist.columns:
            warnings.append(f"{ticker}: 缺少歷史價格，績效曲線中此標的以現金處理")
            cash_value += np.where(master_calendar >= purchase_ts, 0.0, cost_twd)
            continue

        raw_close = hist["Close"].reindex(master_calendar)
        filled_close = raw_close.ffill()

        max_gap_days = _longest_forward_filled_gap(raw_close)
        if max_gap_days > 5:
            warnings.append(
                f"{ticker}: 有 {max_gap_days} 天沒有新報價，期間以最後已知價格延續（可能是交易日曆差異或資料來源中斷）"
            )

        owned_mask = master_calendar >= purchase_ts
        priced_mask = owned_mask & filled_close.notna()
        if currency == "TWD":
            invested_value.loc[priced_mask] += shares * filled_close.loc[priced_mask]
        else:
            fx_on_dates = pd.Series(
                [usdtwd_rate_on(ts, fx_history)[0] if fx_history is not None else None for ts in master_calendar],
                index=master_calendar,
            )
            fx_priced_mask = priced_mask & fx_on_dates.notna()
            invested_value.loc[fx_priced_mask] += (
                shares * filled_close.loc[fx_priced_mask] * fx_on_dates.loc[fx_priced_mask]
            )
        cash_value.loc[~owned_mask] += cost_twd

    total_value = invested_value + cash_value
    cumulative_return = np.where(total_cost_twd > 0, total_value / total_cost_twd - 1.0, np.nan)

    daily = pd.DataFrame(
        {
            "invested_value_twd": invested_value,
            "cash_twd": cash_value,
            "total_value_twd": total_value,
            "cumulative_return": cumulative_return,
        }
    )
    return PerformanceSeries(daily, total_cost_twd, warnings)


def compute_drawdown(value_series: pd.Series) -> tuple[pd.Series, float, pd.Timestamp | None]:
    """Compute the running drawdown series and its worst point.

    Drawdown at t = value(t) / running_max(value up to t) - 1. Returns
    (drawdown_series, max_drawdown, date_of_max_drawdown).
    """
    if value_series.empty:
        return pd.Series(dtype=float), float("nan"), None
    running_max = value_series.cummax()
    drawdown = value_series / running_max - 1.0
    max_dd = float(drawdown.min())
    max_dd_date = drawdown.idxmin() if not drawdown.empty else None
    return drawdown, max_dd, max_dd_date


def compute_contribution(holdings: pd.DataFrame, total_cost_twd: float) -> pd.DataFrame:
    """Per-holding contribution to total portfolio return (sums to total return)."""
    if total_cost_twd <= 0:
        return holdings[["ticker", "name"]].assign(contribution_pct=np.nan)
    out = holdings[["ticker", "name", "unrealized_pnl_twd", "data_ok"]].copy()
    out["contribution_pct"] = np.where(
        out["data_ok"], out["unrealized_pnl_twd"] / total_cost_twd, np.nan
    )
    return out.sort_values("contribution_pct", ascending=False, na_position="last")


def rebase_to_100(series: pd.Series) -> pd.Series:
    """Rebase a positive-valued series to start at 100 for benchmark comparison."""
    series = series.dropna()
    if series.empty or series.iloc[0] == 0:
        return series
    return series / series.iloc[0] * 100.0
