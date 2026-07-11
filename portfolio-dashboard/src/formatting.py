"""Small display-formatting helpers shared by every page."""
from __future__ import annotations

import math


def format_currency(value: float | None, currency: str = "TWD") -> str:
    """Format a number as a currency string, or a placeholder if missing."""
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return "N/A"
    symbol = {"TWD": "NT$", "USD": "US$"}.get(currency, currency + " ")
    return f"{symbol}{value:,.0f}"


def format_pct(value: float | None, signed: bool = False) -> str:
    """Format a fraction (0.05 -> '5.00%') or a placeholder if missing."""
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return "N/A"
    sign = "+" if signed and value > 0 else ""
    return f"{sign}{value * 100:.2f}%"
