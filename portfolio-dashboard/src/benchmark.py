"""TAIEX benchmark fetching.

Yahoo Finance does not expose a stable public ticker for the TAIEX total
*return* index (含息報酬指數). `config.settings.TAIEX_RETURN_INDEX_TICKER`
is the single switch to flip if/when a reliable source is confirmed; until
then this module serves the plain price index and every result carries
`is_return_index=False` plus a human-readable label so the UI never
implies it is showing total-return performance.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from config.settings import TAIEX_LABEL, TAIEX_PRICE_INDEX_TICKER, TAIEX_RETURN_INDEX_TICKER
from src.data_loader import fetch_price_history
from src.models import FetchResult


@dataclass
class BenchmarkResult:
    fetch: FetchResult
    label: str
    is_return_index: bool
    ticker: str


def get_taiex_history(start: date, end: date) -> BenchmarkResult:
    """Fetch TAIEX history, preferring the return index if configured."""
    ticker = TAIEX_RETURN_INDEX_TICKER or TAIEX_PRICE_INDEX_TICKER
    fetch = fetch_price_history(ticker, start, end)
    return BenchmarkResult(
        fetch=fetch,
        label=TAIEX_LABEL,
        is_return_index=TAIEX_RETURN_INDEX_TICKER is not None,
        ticker=ticker,
    )
