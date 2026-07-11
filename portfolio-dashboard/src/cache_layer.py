"""Streamlit-cache wrappers around the pure data-fetching functions.

Kept separate from data_loader/fx/benchmark so those modules stay
importable and unit-testable without a Streamlit runtime. `clear_all()`
backs the "立即重新整理" button.
"""
from __future__ import annotations

from datetime import date

import streamlit as st

from config.settings import FX_TTL_SECONDS, HISTORY_TTL_SECONDS, LATEST_PRICE_TTL_SECONDS
from src import benchmark as _benchmark
from src import data_loader as _data_loader
from src import fx as _fx
from src.benchmark import BenchmarkResult
from src.models import FetchResult, LatestPriceResult


@st.cache_data(ttl=HISTORY_TTL_SECONDS, show_spinner=False)
def get_price_history_cached(ticker: str, start: date, end: date) -> FetchResult:
    """Cached wrapper around `data_loader.fetch_price_history`."""
    return _data_loader.fetch_price_history(ticker, start, end)


@st.cache_data(ttl=LATEST_PRICE_TTL_SECONDS, show_spinner=False)
def get_latest_price_cached(ticker: str) -> LatestPriceResult:
    """Cached wrapper around `data_loader.fetch_latest_price`."""
    return _data_loader.fetch_latest_price(ticker)


@st.cache_data(ttl=FX_TTL_SECONDS, show_spinner=False)
def get_usdtwd_history_cached(start: date, end: date) -> FetchResult:
    """Cached wrapper around `fx.get_usdtwd_history`."""
    return _fx.get_usdtwd_history(start, end)


@st.cache_data(ttl=HISTORY_TTL_SECONDS, show_spinner=False)
def get_taiex_history_cached(start: date, end: date) -> BenchmarkResult:
    """Cached wrapper around `benchmark.get_taiex_history`."""
    return _benchmark.get_taiex_history(start, end)


def clear_all() -> None:
    """Clear every cached fetch. Wired to the sidebar refresh button."""
    get_price_history_cached.clear()
    get_latest_price_cached.clear()
    get_usdtwd_history_cached.clear()
    get_taiex_history_cached.clear()
