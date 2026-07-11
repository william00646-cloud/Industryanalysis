import numpy as np
import pandas as pd
import pytest

from src.models import LatestPriceResult
from src.portfolio_engine import build_holdings_snapshot, compute_summary, evaluate_risk_alerts, load_portfolio


@pytest.fixture
def portfolio_df():
    return pd.DataFrame(
        [
            {
                "ticker": "AAA.TW", "name": "A公司", "shares": 100.0, "average_cost": 100.0,
                "currency": "TWD", "purchase_date": pd.Timestamp("2026-01-01").date(),
                "asset_class": "TW_EQUITY", "sector": "Technology",
            },
            {
                "ticker": "BBB", "name": "B Corp", "shares": 10.0, "average_cost": 50.0,
                "currency": "USD", "purchase_date": pd.Timestamp("2026-01-01").date(),
                "asset_class": "US_EQUITY", "sector": "Communication Services",
            },
        ]
    )


def test_load_real_portfolio_csv_is_valid():
    result = load_portfolio()
    assert result.validation.ok
    assert len(result.df) == 5
    assert set(result.df["ticker"]) == {"2395.TW", "2454.TW", "2327.TW", "3008.TW", "NFLX"}


def test_build_holdings_snapshot_computes_pnl_and_weight(portfolio_df):
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", 110.0, 108.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
        "BBB": LatestPriceResult("BBB", 55.0, 54.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=32.0, usdtwd_warning=None)

    aaa = holdings.set_index("ticker").loc["AAA.TW"]
    assert aaa["market_value_twd"] == pytest.approx(100 * 110.0)
    assert aaa["cost_value_twd"] == pytest.approx(100 * 100.0)
    assert aaa["unrealized_pnl_twd"] == pytest.approx(1000.0)
    assert aaa["return_pct"] == pytest.approx(0.10)

    bbb = holdings.set_index("ticker").loc["BBB"]
    assert bbb["market_value_twd"] == pytest.approx(10 * 55.0 * 32.0)
    assert bbb["cost_value_twd"] == pytest.approx(10 * 50.0 * 32.0)

    assert holdings["weight"].sum() == pytest.approx(1.0)


def test_missing_price_marks_data_not_ok(portfolio_df):
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", None, None, None, "none", False, False, "抓取失敗"),
        "BBB": LatestPriceResult("BBB", 55.0, 54.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=32.0, usdtwd_warning=None)
    aaa = holdings.set_index("ticker").loc["AAA.TW"]
    assert not aaa["data_ok"]
    assert np.isnan(aaa["market_value_twd"])
    # weight should only be computed over holdings with valid data
    bbb = holdings.set_index("ticker").loc["BBB"]
    assert bbb["weight"] == pytest.approx(1.0)


def test_missing_fx_rate_marks_usd_holding_not_ok(portfolio_df):
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", 110.0, 108.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
        "BBB": LatestPriceResult("BBB", 55.0, 54.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=None, usdtwd_warning="匯率抓取失敗")
    bbb = holdings.set_index("ticker").loc["BBB"]
    assert not bbb["data_ok"]


def test_compute_summary_identifies_max_weight_and_allocation(portfolio_df):
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", 110.0, 108.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
        "BBB": LatestPriceResult("BBB", 55.0, 54.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=32.0, usdtwd_warning=None)
    summary = compute_summary(holdings)

    assert summary.num_holdings == 2
    assert summary.max_weight_ticker in {"AAA.TW", "BBB"}
    assert summary.tw_weight_pct + summary.us_weight_pct == pytest.approx(1.0)
    assert summary.unrealized_pnl_twd == pytest.approx((110 - 100) * 100 + (55 - 50) * 10 * 32.0)


def test_evaluate_risk_alerts_triggers_single_holding_weight(portfolio_df):
    # AAA.TW dominates with a big gain -> should exceed the 35% single-holding cap
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", 500.0, 490.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
        "BBB": LatestPriceResult("BBB", 50.0, 50.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=32.0, usdtwd_warning=None)
    summary = compute_summary(holdings)
    alerts = evaluate_risk_alerts(holdings, summary, max_drawdown=0.0)
    assert any("集中度" in a.title for a in alerts)


def test_evaluate_risk_alerts_triggers_single_holding_loss(portfolio_df):
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", 80.0, 82.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
        "BBB": LatestPriceResult("BBB", 55.0, 54.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=32.0, usdtwd_warning=None)
    summary = compute_summary(holdings)
    alerts = evaluate_risk_alerts(holdings, summary, max_drawdown=0.0)
    assert any("虧損超過門檻" in a.title for a in alerts)


def test_evaluate_risk_alerts_triggers_max_drawdown(portfolio_df):
    latest = {
        "AAA.TW": LatestPriceResult("AAA.TW", 100.0, 100.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
        "BBB": LatestPriceResult("BBB", 50.0, 50.0, pd.Timestamp("2026-06-01"), "yfinance", True, False, None),
    }
    holdings = build_holdings_snapshot(portfolio_df, latest, usdtwd_rate=32.0, usdtwd_warning=None)
    summary = compute_summary(holdings)
    alerts = evaluate_risk_alerts(holdings, summary, max_drawdown=-0.20)
    assert any("最大回撤" in a.title for a in alerts)
