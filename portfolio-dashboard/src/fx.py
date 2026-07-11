"""USD/TWD exchange rate fetching and date alignment helpers.

US-dollar holdings (e.g. NFLX) must be converted to TWD using the FX rate
that actually applied on each pricing date. Since FX and equity markets
don't share a trading calendar, `usdtwd_rate_on` looks back to the most
recent available FX quote instead of guessing or interpolating.
"""
from __future__ import annotations

from datetime import date

import pandas as pd

from config.settings import USDTWD_TICKER
from src.data_loader import fetch_price_history
from src.models import FetchResult


def get_usdtwd_history(start: date, end: date) -> FetchResult:
    """Fetch daily USD/TWD close rates for [start, end]."""
    return fetch_price_history(USDTWD_TICKER, start, end)


def usdtwd_rate_on(target_date: pd.Timestamp, fx_history: pd.DataFrame) -> tuple[float | None, bool]:
    """Return the USD/TWD rate applicable on `target_date`.

    If no quote exists for that exact date (FX and equities don't always
    trade on the same calendar), falls back to the most recent prior
    quote and reports `used_fallback_date=True` so callers can disclose it.
    Returns (None, False) if there is no quote on or before `target_date`.
    """
    if fx_history is None or fx_history.empty or "Close" not in fx_history.columns:
        return None, False

    target_ts = pd.Timestamp(target_date).tz_localize(None) if pd.Timestamp(target_date).tzinfo else pd.Timestamp(target_date)
    available = fx_history["Close"].dropna()
    available = available[available.index <= target_ts]
    if available.empty:
        return None, False

    exact_match = target_ts in available.index
    return float(available.iloc[-1]), not exact_match
