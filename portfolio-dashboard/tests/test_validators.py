from datetime import date, timedelta

import pandas as pd

from src.validators import check_price_freshness, missing_tickers, validate_portfolio_df

VALID_ROW = {
    "ticker": "2395.TW",
    "name": "研華",
    "shares": 1000,
    "average_cost": 510.73,
    "currency": "TWD",
    "purchase_date": "2026-05-25",
    "asset_class": "TW_EQUITY",
}


def _df(rows):
    return pd.DataFrame(rows)


def test_valid_portfolio_passes():
    result = validate_portfolio_df(_df([VALID_ROW]))
    assert result.ok
    assert result.errors == []


def test_missing_required_column_fails():
    row = dict(VALID_ROW)
    del row["currency"]
    result = validate_portfolio_df(_df([row]))
    assert not result.ok
    assert any("currency" in e for e in result.errors)


def test_duplicate_ticker_fails():
    result = validate_portfolio_df(_df([VALID_ROW, VALID_ROW]))
    assert not result.ok
    assert any("重複" in e for e in result.errors)


def test_non_positive_shares_fails():
    row = dict(VALID_ROW, shares=0)
    result = validate_portfolio_df(_df([row]))
    assert not result.ok


def test_invalid_currency_fails():
    row = dict(VALID_ROW, currency="JPY")
    result = validate_portfolio_df(_df([row]))
    assert not result.ok


def test_invalid_asset_class_fails():
    row = dict(VALID_ROW, asset_class="CRYPTO")
    result = validate_portfolio_df(_df([row]))
    assert not result.ok


def test_unparseable_date_fails():
    row = dict(VALID_ROW, purchase_date="not-a-date")
    result = validate_portfolio_df(_df([row]))
    assert not result.ok


def test_future_date_is_only_a_warning():
    future = (date.today() + timedelta(days=30)).isoformat()
    row = dict(VALID_ROW, purchase_date=future)
    result = validate_portfolio_df(_df([row]))
    assert result.ok
    assert result.warnings


def test_empty_portfolio_fails():
    result = validate_portfolio_df(_df([VALID_ROW]).iloc[0:0])
    assert not result.ok


def test_check_price_freshness_none():
    assert check_price_freshness(None, max_stale_days=7) is not None


def test_check_price_freshness_fresh():
    assert check_price_freshness(pd.Timestamp.now(), max_stale_days=7) is None


def test_check_price_freshness_stale():
    old = pd.Timestamp.now() - pd.Timedelta(days=10)
    assert check_price_freshness(old, max_stale_days=7) is not None


def test_missing_tickers():
    assert missing_tickers(["A", "B", "C"], ["A", "C"]) == ["B"]
