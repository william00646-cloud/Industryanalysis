import pandas as pd
import pytest

from src.fx import usdtwd_rate_on


@pytest.fixture
def fx_history():
    dates = pd.to_datetime(["2026-01-02", "2026-01-05", "2026-01-06", "2026-01-08"])
    return pd.DataFrame({"Close": [32.0, 32.2, 32.1, 32.4]}, index=dates)


def test_exact_match_no_fallback(fx_history):
    rate, used_fallback = usdtwd_rate_on(pd.Timestamp("2026-01-06"), fx_history)
    assert rate == pytest.approx(32.1)
    assert used_fallback is False


def test_missing_date_falls_back_to_prior_quote(fx_history):
    # 2026-01-07 has no quote (weekend/holiday); should use 01-06's rate
    rate, used_fallback = usdtwd_rate_on(pd.Timestamp("2026-01-07"), fx_history)
    assert rate == pytest.approx(32.1)
    assert used_fallback is True


def test_date_before_any_quote_returns_none(fx_history):
    rate, used_fallback = usdtwd_rate_on(pd.Timestamp("2026-01-01"), fx_history)
    assert rate is None
    assert used_fallback is False


def test_empty_history_returns_none():
    rate, used_fallback = usdtwd_rate_on(pd.Timestamp("2026-01-06"), pd.DataFrame())
    assert rate is None
    assert used_fallback is False
