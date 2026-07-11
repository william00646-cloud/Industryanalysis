#!/usr/bin/env python3
"""Pre-warm the on-disk price/FX/benchmark cache under data/cache/.

Run by the GitHub Actions workflow after each Taiwan trading day close so
`data/cache/history/*.csv` (committed to the repo) gives a same-day
fallback when a live Yahoo Finance / TWSE fetch fails at Streamlit Cloud
cold start. Safe to run manually: `python scripts/refresh_cache.py`.
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.settings import USDTWD_TICKER  # noqa: E402
from src.benchmark import get_taiex_history  # noqa: E402
from src.data_loader import fetch_price_history  # noqa: E402
from src.fx import get_usdtwd_history  # noqa: E402
from src.portfolio_engine import load_portfolio  # noqa: E402


def main() -> int:
    """Fetch every ticker/FX/benchmark series once so the disk cache is fresh."""
    load_result = load_portfolio()
    if not load_result.validation.ok:
        print("portfolio.csv 驗證失敗，中止更新：")
        for err in load_result.validation.errors:
            print(f"  - {err}")
        return 1

    today = date.today()
    failures: list[str] = []

    for _, row in load_result.df.iterrows():
        ticker = row["ticker"]
        result = fetch_price_history(ticker, row["purchase_date"], today)
        status = "OK" if result.success else "FAIL"
        print(f"[{status}] {ticker}: source={result.source} used_fallback={result.used_fallback} warning={result.warning}")
        if not result.success:
            failures.append(ticker)

    earliest_purchase = min(load_result.df["purchase_date"])

    fx_result = get_usdtwd_history(earliest_purchase, today)
    print(f"[{'OK' if fx_result.success else 'FAIL'}] {USDTWD_TICKER}: source={fx_result.source} warning={fx_result.warning}")
    if not fx_result.success:
        failures.append(USDTWD_TICKER)

    bench_result = get_taiex_history(earliest_purchase, today)
    print(
        f"[{'OK' if bench_result.fetch.success else 'FAIL'}] {bench_result.ticker}: "
        f"source={bench_result.fetch.source} warning={bench_result.fetch.warning}"
    )
    if not bench_result.fetch.success:
        failures.append(bench_result.ticker)

    if failures:
        print(f"\n{len(failures)} 項資料來源全部失敗（含備援）: {', '.join(failures)}")
    else:
        print("\n全部資料來源更新成功。")

    return 0  # non-fatal: partial failures still leave the rest of the cache fresh


if __name__ == "__main__":
    raise SystemExit(main())
