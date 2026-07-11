"""Shared result types for the data-fetching layer.

Every fetch function in data_loader/fx/benchmark returns one of these so
callers (and the Data Status page) can always tell what happened: which
source served the data, whether it's a stale fallback, and why.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

import pandas as pd

SOURCE_YFINANCE = "yfinance"
SOURCE_TWSE = "twse"
SOURCE_CACHE_FALLBACK = "disk_cache_fallback"
SOURCE_NONE = "none"


@dataclass
class FetchResult:
    """Outcome of fetching a price/fx/index history series.

    `data` is None when every source failed. `success` is True only when
    `data` holds at least one row that was not itself a stale fallback
    used silently -- fallback usage is still `success=True` but flagged via
    `used_fallback` so the UI can show a clear badge.
    """

    key: str
    data: pd.DataFrame | None
    source: str
    success: bool
    used_fallback: bool
    warning: str | None
    fetched_at: datetime


@dataclass
class LatestPriceResult:
    """Outcome of fetching the latest price for a single ticker."""

    ticker: str
    price: float | None
    previous_close: float | None
    as_of: pd.Timestamp | None
    source: str
    success: bool
    used_fallback: bool
    warning: str | None
