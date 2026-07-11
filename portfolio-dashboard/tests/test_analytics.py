import numpy as np
import pandas as pd
import pytest

from src.analytics import build_portfolio_value_series, compute_contribution, compute_drawdown, rebase_to_100


@pytest.fixture
def two_holding_portfolio():
    return pd.DataFrame(
        [
            {
                "ticker": "AAA.TW", "name": "A公司", "shares": 100.0, "average_cost": 100.0,
                "currency": "TWD", "purchase_date": pd.Timestamp("2026-01-01").date(),
            },
            {
                "ticker": "BBB.TW", "name": "B公司", "shares": 50.0, "average_cost": 200.0,
                "currency": "TWD", "purchase_date": pd.Timestamp("2026-01-05").date(),
            },
        ]
    )


def test_pre_purchase_capital_is_treated_as_cash(two_holding_portfolio):
    dates = pd.date_range("2026-01-01", "2026-01-08", freq="D")
    aaa_prices = pd.DataFrame({"Close": pd.Series(110.0, index=dates)})  # +10% flat
    bbb_prices = pd.DataFrame({"Close": pd.Series(200.0, index=pd.date_range("2026-01-05", "2026-01-08"))})

    result = build_portfolio_value_series(
        two_holding_portfolio, {"AAA.TW": aaa_prices, "BBB.TW": bbb_prices}, fx_history=None
    )

    total_cost = 100 * 100.0 + 50 * 200.0
    assert result.total_cost_twd == pytest.approx(total_cost)

    first_day = result.daily.index.min()
    assert first_day == pd.Timestamp("2026-01-01")
    # Before BBB is purchased, its cost sits as idle cash (unchanged), only AAA moves.
    expected_first_day_value = 100 * 110.0 + 50 * 200.0
    assert result.daily.loc[first_day, "total_value_twd"] == pytest.approx(expected_first_day_value)

    last_day = result.daily.index.max()
    # After BBB is purchased and flat, total value = AAA gain only, BBB at cost.
    expected_last_day_value = 100 * 110.0 + 50 * 200.0
    assert result.daily.loc[last_day, "total_value_twd"] == pytest.approx(expected_last_day_value)


def test_empty_portfolio_returns_empty_series():
    result = build_portfolio_value_series(pd.DataFrame(), {}, None)
    assert result.daily.empty
    assert result.warnings


def test_missing_history_falls_back_to_cash_and_warns(two_holding_portfolio):
    result = build_portfolio_value_series(two_holding_portfolio, {}, None)
    assert result.daily.empty or result.warnings


def test_compute_drawdown_known_series():
    series = pd.Series([100, 120, 90, 110, 80, 130], index=pd.date_range("2026-01-01", periods=6))
    drawdown, max_dd, max_dd_date = compute_drawdown(series)
    # running max at the worst point (80) is 120 -> drawdown = 80/120 - 1
    assert max_dd == pytest.approx(80 / 120 - 1)
    assert max_dd_date == pd.Timestamp("2026-01-05")


def test_compute_drawdown_empty_series():
    drawdown, max_dd, max_dd_date = compute_drawdown(pd.Series(dtype=float))
    assert drawdown.empty
    assert np.isnan(max_dd)
    assert max_dd_date is None


def test_compute_contribution_sums_to_total_return():
    holdings = pd.DataFrame(
        [
            {"ticker": "A", "name": "A", "unrealized_pnl_twd": 1000.0, "data_ok": True},
            {"ticker": "B", "name": "B", "unrealized_pnl_twd": -400.0, "data_ok": True},
        ]
    )
    total_cost = 10000.0
    contrib = compute_contribution(holdings, total_cost)
    assert contrib["contribution_pct"].sum() == pytest.approx((1000 - 400) / total_cost)


def test_rebase_to_100():
    series = pd.Series([50.0, 55.0, 60.0])
    rebased = rebase_to_100(series)
    assert rebased.iloc[0] == pytest.approx(100.0)
    assert rebased.iloc[-1] == pytest.approx(120.0)


def test_rebase_to_100_empty():
    assert rebase_to_100(pd.Series(dtype=float)).empty
