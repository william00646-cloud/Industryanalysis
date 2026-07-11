"""Validation helpers for portfolio.csv and market data quality checks.

Nothing here fabricates or estimates missing data -- every function either
returns clean data or surfaces a human-readable warning so the UI can show
it explicitly instead of silently filling gaps.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime

import pandas as pd

from config.settings import REQUIRED_PORTFOLIO_COLUMNS

VALID_ASSET_CLASSES = {"TW_EQUITY", "US_EQUITY"}
VALID_CURRENCIES = {"TWD", "USD"}


@dataclass
class ValidationResult:
    """Outcome of validating a data source; `ok` is False if unusable."""

    ok: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def validate_portfolio_df(df: pd.DataFrame) -> ValidationResult:
    """Validate the schema and values of a loaded portfolio.csv DataFrame.

    Checks required columns, duplicate tickers, non-positive shares/cost,
    invalid currency/asset_class values, and unparseable purchase dates.
    Does not mutate `df`.
    """
    result = ValidationResult(ok=True)

    missing_cols = [c for c in REQUIRED_PORTFOLIO_COLUMNS if c not in df.columns]
    if missing_cols:
        result.ok = False
        result.errors.append(f"portfolio.csv 缺少必要欄位: {', '.join(missing_cols)}")
        return result

    if df.empty:
        result.ok = False
        result.errors.append("portfolio.csv 沒有任何持股資料")
        return result

    dup_tickers = df["ticker"][df["ticker"].duplicated()].unique().tolist()
    if dup_tickers:
        result.errors.append(f"重複的 ticker: {', '.join(dup_tickers)}")
        result.ok = False

    for idx, row in df.iterrows():
        label = f"第 {idx + 2} 列 ({row.get('ticker', '?')})"

        shares = row.get("shares")
        if pd.isna(shares) or float(shares) <= 0:
            result.errors.append(f"{label}: shares 必須為正數")
            result.ok = False

        cost = row.get("average_cost")
        if pd.isna(cost) or float(cost) <= 0:
            result.errors.append(f"{label}: average_cost 必須為正數")
            result.ok = False

        currency = row.get("currency")
        if currency not in VALID_CURRENCIES:
            result.errors.append(f"{label}: currency 必須是 {VALID_CURRENCIES} 之一，收到 '{currency}'")
            result.ok = False

        asset_class = row.get("asset_class")
        if asset_class not in VALID_ASSET_CLASSES:
            result.errors.append(
                f"{label}: asset_class 必須是 {VALID_ASSET_CLASSES} 之一，收到 '{asset_class}'"
            )
            result.ok = False

        purchase_date = row.get("purchase_date")
        parsed = _try_parse_date(purchase_date)
        if parsed is None:
            result.errors.append(f"{label}: purchase_date 無法解析 ('{purchase_date}')")
            result.ok = False
        elif parsed > date.today():
            result.warnings.append(f"{label}: purchase_date 是未來日期 ({parsed})")

    return result


def _try_parse_date(value: object) -> date | None:
    """Parse a date-like value, returning None instead of raising."""
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    try:
        return pd.to_datetime(str(value)).date()
    except (ValueError, TypeError):
        return None


def check_price_freshness(as_of: pd.Timestamp | None, max_stale_days: int) -> str | None:
    """Return a warning string if `as_of` is missing or older than allowed, else None."""
    if as_of is None or pd.isna(as_of):
        return "沒有可用的最新價格時間戳"
    as_of_ts = pd.Timestamp(as_of)
    if as_of_ts.tzinfo is not None:
        as_of_ts = as_of_ts.tz_localize(None)
    age_days = (pd.Timestamp.now().normalize() - as_of_ts.normalize()).days
    if age_days > max_stale_days:
        return f"最新價格已 {age_days} 天未更新（超過 {max_stale_days} 天門檻）"
    return None


def missing_tickers(expected: list[str], available: list[str]) -> list[str]:
    """Return tickers present in `expected` but absent from `available`."""
    available_set = set(available)
    return [t for t in expected if t not in available_set]
