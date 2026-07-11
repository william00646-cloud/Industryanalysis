"""Central, non-hardcoded configuration for the portfolio dashboard.

All thresholds and lookups that would otherwise be scattered as magic
numbers/strings across the codebase live here so the rest of the app stays
maintainable without code changes.
"""
from __future__ import annotations

from pathlib import Path

# --- Paths -----------------------------------------------------------------
BASE_DIR: Path = Path(__file__).resolve().parent.parent
PORTFOLIO_CSV: Path = BASE_DIR / "portfolio.csv"
CACHE_DIR: Path = BASE_DIR / "data" / "cache"
STATUS_FILE: Path = CACHE_DIR / "status.json"

# --- Benchmark ---------------------------------------------------------------
# Yahoo Finance does not publish a stable public ticker for the TAIEX total
# *return* index (含息報酬指數). Until a reliable free source is confirmed,
# the dashboard uses the plain price index and labels it clearly everywhere
# it is shown. Flip this only after verifying a return-index source works.
TAIEX_RETURN_INDEX_TICKER: str | None = None
TAIEX_PRICE_INDEX_TICKER: str = "^TWII"
TAIEX_LABEL = (
    "台灣加權報酬指數（含息）" if TAIEX_RETURN_INDEX_TICKER else "台灣加權股價指數（未含息，價格指數）"
)

# --- FX ----------------------------------------------------------------------
USDTWD_TICKER: str = "TWD=X"

# --- Caching -------------------------------------------------------------
LATEST_PRICE_TTL_SECONDS: int = 15 * 60  # 15 minutes
HISTORY_TTL_SECONDS: int = 6 * 60 * 60  # 6 hours
FX_TTL_SECONDS: int = 60 * 60  # 1 hour

# --- Data source fallback -------------------------------------------------
TWSE_HISTORY_URL = "https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY"
TWSE_REQUEST_TIMEOUT_SECONDS: int = 10
MAX_STALE_DAYS_FOR_LATEST_PRICE: int = 7  # warn if the newest cached price is older than this

# --- Risk thresholds (simple, transparent, first-version rules) ------------
MAX_SINGLE_HOLDING_WEIGHT: float = 0.35
MAX_SECTOR_WEIGHT: dict[str, float] = {"Technology": 0.60}
MAX_TW_MARKET_WEIGHT: float = 0.80
SINGLE_HOLDING_DROP_ALERT: float = -0.10  # unrealized return trigger
MAX_DRAWDOWN_ALERT: float = -0.15
USD_EXPOSURE_WARN_THRESHOLD: float = 0.30

# --- Sector classification ---------------------------------------------------
# Static, manually-curated classification used only for the risk-warning
# panel (e.g. "tech concentration too high"). This is NOT market data and is
# not fetched from any provider; it is a transparent, editable lookup that
# is overridden by a "sector" column in portfolio.csv when present.
DEFAULT_SECTOR_MAP: dict[str, str] = {
    "2395.TW": "Technology",
    "2454.TW": "Technology",
    "2327.TW": "Technology",
    "3008.TW": "Technology",
    "NFLX": "Communication Services",
}

REQUIRED_PORTFOLIO_COLUMNS: list[str] = [
    "ticker",
    "name",
    "shares",
    "average_cost",
    "currency",
    "purchase_date",
    "asset_class",
]

TAIWAN_TIMEZONE = "Asia/Taipei"
