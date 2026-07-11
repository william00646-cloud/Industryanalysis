"""Overview page: entry point of the portfolio tracking dashboard.

Run locally with `streamlit run app.py` from the `portfolio-dashboard/`
directory. See README.md for setup and Streamlit Community Cloud deploy
instructions.
"""
from __future__ import annotations

import streamlit as st

from src import cache_layer
from src.dashboard_data import load_dashboard_state
from src.formatting import format_currency, format_pct

st.set_page_config(page_title="持股追蹤 Dashboard - Overview", layout="wide")


def render_refresh_button() -> None:
    """Sidebar refresh control: clears all caches then re-runs the app."""
    with st.sidebar:
        st.header("控制項")
        if st.button("🔄 立即重新整理", width="stretch"):
            cache_layer.clear_all()
            load_dashboard_state.clear()
            st.rerun()
        st.caption("資料具快取（依來源 15 分鐘～6 小時），避免每次互動都重抓歷史資料。")


render_refresh_button()

state = load_dashboard_state()

st.title("📊 個人持股追蹤 Dashboard")
st.caption(f"資料最後計算時間：{state.generated_at:%Y-%m-%d %H:%M:%S}")

if not state.validation.ok:
    st.error("portfolio.csv 驗證失敗，請修正後再重新整理：")
    for err in state.validation.errors:
        st.write(f"- {err}")
    st.stop()

for warning in state.validation.warnings:
    st.warning(warning)

summary = state.summary
holdings = state.holdings

if summary is None or holdings.empty:
    st.warning("目前沒有可用的持股資料。")
    st.stop()

if summary.holdings_missing_data:
    st.warning(f"以下標的最新價格取得失敗，未計入總市值計算：{', '.join(summary.holdings_missing_data)}")

col1, col2, col3, col4 = st.columns(4)
col1.metric("投資組合總市值 (TWD)", format_currency(summary.total_market_value_twd))
col2.metric("投資組合總成本 (TWD)", format_currency(summary.total_cost_twd))
col3.metric(
    "未實現損益 (TWD)",
    format_currency(summary.unrealized_pnl_twd),
    delta=format_pct(summary.unrealized_return_pct, signed=True),
)
col4.metric("今日損益 (TWD)", format_currency(summary.today_pnl_twd))

col5, col6, col7, col8 = st.columns(4)
col5.metric("未實現報酬率", format_pct(summary.unrealized_return_pct, signed=True))
col6.metric("持股數量", summary.num_holdings)
col7.metric(
    "最大單一持股權重",
    format_pct(summary.max_weight_pct) if summary.max_weight_pct is not None else "N/A",
    help=summary.max_weight_ticker or "",
)
col8.metric("台股配置", format_pct(summary.tw_weight_pct))

st.divider()

st.subheader("台股與美股配置")
alloc_col1, alloc_col2 = st.columns(2)
alloc_col1.metric("台股 (TW_EQUITY)", format_pct(summary.tw_weight_pct))
alloc_col2.metric("美股 (US_EQUITY)", format_pct(summary.us_weight_pct))

if state.risk_alerts:
    st.divider()
    st.subheader("⚠️ 風險提醒摘要")
    st.info(f"共有 {len(state.risk_alerts)} 項風險警示，詳見「Risk」頁面。")

st.divider()
st.caption("其餘明細請見左側頁面：Holdings／Performance／Allocation／Risk／Data Status。")
