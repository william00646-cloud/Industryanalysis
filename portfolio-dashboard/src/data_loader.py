"""Market data fetching with disk-cache fallback and TWSE backup source.

Design goals: never raise on network/data problems, never fabricate a
price, and always report which source actually served the data so the UI
can be transparent about it. Functions here are plain (no Streamlit
caching) so they stay unit-testable; `src/cache_layer.py` wraps them with
`st.cache_data` for the app.
"""
from __future__ import annotations

import re
from datetime import date, datetime, timedelta
from pathlib import Path

import pandas as pd
import requests
import yfinance as yf

from config.settings import CACHE_DIR, TWSE_HISTORY_URL, TWSE_REQUEST_TIMEOUT_SECONDS
from src.models import (
    SOURCE_CACHE_FALLBACK,
    SOURCE_NONE,
    SOURCE_TWSE,
    SOURCE_YFINANCE,
    FetchResult,
    LatestPriceResult,
)

HISTORY_CACHE_DIR = CACHE_DIR / "history"
REQUIRED_OHLC_COLUMNS = ["Open", "High", "Low", "Close", "Volume"]


def _safe_filename(ticker: str) -> str:
    """Turn a ticker like '^TWII' or 'TWD=X' into a filesystem-safe name."""
    return re.sub(r"[^A-Za-z0-9._-]", "_", ticker)


def _history_cache_path(ticker: str) -> Path:
    return HISTORY_CACHE_DIR / f"{_safe_filename(ticker)}.csv"


def read_history_cache(ticker: str) -> pd.DataFrame | None:
    """Load the last known-good history for `ticker` from disk, if any."""
    path = _history_cache_path(ticker)
    if not path.exists():
        return None
    try:
        df = pd.read_csv(path, index_col=0, parse_dates=True)
        return df if not df.empty else None
    except (OSError, ValueError, pd.errors.ParserError):
        return None


def write_history_cache(ticker: str, df: pd.DataFrame) -> None:
    """Persist `df` as the latest known-good snapshot for `ticker`."""
    HISTORY_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = _history_cache_path(ticker)
    try:
        df.to_csv(path)
    except OSError:
        pass  # cache is a best-effort convenience, never fatal


def _fetch_yfinance_history(ticker: str, start: date, end: date) -> pd.DataFrame | None:
    """Download daily OHLCV from Yahoo Finance, adjusted for splits/dividends."""
    try:
        raw = yf.download(
            ticker,
            start=start,
            end=end + timedelta(days=1),
            auto_adjust=True,
            progress=False,
            multi_level_index=False,
        )
    except Exception:
        return None
    if raw is None or raw.empty:
        return None
    raw.index = pd.to_datetime(raw.index).tz_localize(None)
    cols = [c for c in REQUIRED_OHLC_COLUMNS if c in raw.columns]
    return raw[cols].dropna(how="all")


def _roc_date_to_iso(roc_date: str) -> str | None:
    """Convert a TWSE ROC-calendar date string ('115/05/25') to ISO format."""
    parts = roc_date.strip().split("/")
    if len(parts) != 3:
        return None
    try:
        year = int(parts[0]) + 1911
        return f"{year:04d}-{int(parts[1]):02d}-{int(parts[2]):02d}"
    except ValueError:
        return None


def _fetch_twse_month(stock_no: str, year: int, month: int) -> pd.DataFrame | None:
    """Fetch one calendar month of daily bars from the TWSE STOCK_DAY endpoint."""
    try:
        resp = requests.get(
            TWSE_HISTORY_URL,
            params={"response": "json", "date": f"{year:04d}{month:02d}01", "stockNo": stock_no},
            timeout=TWSE_REQUEST_TIMEOUT_SECONDS,
        )
        resp.raise_for_status()
        payload = resp.json()
    except (requests.RequestException, ValueError):
        return None

    if payload.get("stat") != "OK" or not payload.get("data"):
        return None

    rows = []
    for record in payload["data"]:
        iso_date = _roc_date_to_iso(record[0])
        if iso_date is None:
            continue
        try:
            close = float(record[6].replace(",", ""))
            open_ = float(record[3].replace(",", ""))
            high = float(record[4].replace(",", ""))
            low = float(record[5].replace(",", ""))
            volume = float(record[1].replace(",", ""))
        except (ValueError, IndexError):
            continue  # holiday / non-numeric row; skip rather than fabricate
        rows.append(
            {"Date": iso_date, "Open": open_, "High": high, "Low": low, "Close": close, "Volume": volume}
        )
    if not rows:
        return None
    df = pd.DataFrame(rows).set_index("Date")
    df.index = pd.to_datetime(df.index)
    return df


def _fetch_twse_history(ticker: str, start: date, end: date) -> pd.DataFrame | None:
    """TWSE fallback for a '.TW' ticker, spanning every month in [start, end]."""
    if not ticker.endswith(".TW"):
        return None
    stock_no = ticker.removesuffix(".TW")

    months: list[tuple[int, int]] = []
    cursor = date(start.year, start.month, 1)
    while cursor <= end:
        months.append((cursor.year, cursor.month))
        cursor = date(cursor.year + (cursor.month == 12), cursor.month % 12 + 1, 1)

    frames = [m for m in (_fetch_twse_month(stock_no, y, mo) for y, mo in months) if m is not None]
    if not frames:
        return None
    combined = pd.concat(frames).sort_index()
    combined = combined[(combined.index >= pd.Timestamp(start)) & (combined.index <= pd.Timestamp(end))]
    return combined if not combined.empty else None


def fetch_price_history(ticker: str, start: date, end: date) -> FetchResult:
    """Fetch daily OHLCV for `ticker` between `start` and `end` (inclusive).

    Tries Yahoo Finance first, falls back to TWSE for '.TW' tickers, and
    finally to the last successful disk-cache snapshot. Never raises.
    """
    now = datetime.now()

    df = _fetch_yfinance_history(ticker, start, end)
    if df is not None:
        write_history_cache(ticker, df)
        return FetchResult(ticker, df, SOURCE_YFINANCE, True, False, None, now)

    df = _fetch_twse_history(ticker, start, end)
    if df is not None:
        write_history_cache(ticker, df)
        return FetchResult(
            ticker, df, SOURCE_TWSE, True, False,
            "Yahoo Finance 無法取得資料，已改用 TWSE 備援來源", now,
        )

    cached = read_history_cache(ticker)
    if cached is not None:
        return FetchResult(
            ticker, cached, SOURCE_CACHE_FALLBACK, True, True,
            "即時來源皆失敗，顯示最後一次成功抓取的快取資料（可能已過期）", now,
        )

    return FetchResult(ticker, None, SOURCE_NONE, False, False, "所有資料來源皆失敗，且無可用快取", now)


def fetch_latest_price(ticker: str) -> LatestPriceResult:
    """Fetch the most recent close and previous close for `ticker`.

    Uses a short recent-history window rather than `fast_info` so the
    result is derived from the same OHLC series shown elsewhere, and falls
    back the same way as `fetch_price_history`.
    """
    today = date.today()
    result = fetch_price_history(ticker, today - timedelta(days=10), today)
    if result.data is None or result.data.empty:
        return LatestPriceResult(ticker, None, None, None, result.source, False, result.used_fallback, result.warning)

    closes = result.data["Close"].dropna()
    if closes.empty:
        return LatestPriceResult(
            ticker, None, None, None, result.source, False, result.used_fallback,
            "近期資料存在但收盤價缺漏",
        )

    latest_price = float(closes.iloc[-1])
    prev_close = float(closes.iloc[-2]) if len(closes) >= 2 else None
    as_of = closes.index[-1]
    return LatestPriceResult(
        ticker, latest_price, prev_close, as_of, result.source, True, result.used_fallback, result.warning
    )
