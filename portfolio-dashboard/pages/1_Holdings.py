"""Holdings page: full per-holding detail table, sortable and downloadable."""
from __future__ import annotations

import streamlit as st

from src.dashboard_data import load_dashboard_state
from src.formatting import format_currency, format_pct

st.set_page_config(page_title="Holdings - 持股明細", layout="wide")
st.title("持股明細")

state = load_dashboard_state()
if not state.validation.ok or state.holdings.empty:
    st.warning("沒有可用的持股資料，請先確認 Overview 頁的驗證訊息。")
    st.stop()

holdings = state.holdings.copy()

display = holdings.assign(
    market_value_twd_fmt=holdings["market_value_twd"].map(lambda v: format_currency(v)),
    unrealized_pnl_twd_fmt=holdings["unrealized_pnl_twd"].map(lambda v: format_currency(v)),
    return_pct_fmt=holdings["return_pct"].map(lambda v: format_pct(v, signed=True)),
    weight_fmt=holdings["weight"].map(lambda v: format_pct(v)),
    today_change_pct_fmt=holdings["today_change_pct"].map(lambda v: format_pct(v, signed=True)),
)[
    [
        "name", "ticker", "shares", "average_cost", "latest_price",
        "market_value_twd_fmt", "unrealized_pnl_twd_fmt", "return_pct_fmt",
        "weight_fmt", "today_change_pct_fmt", "purchase_date", "currency", "warning",
    ]
].rename(
    columns={
        "name": "股票名稱", "ticker": "Ticker", "shares": "股數", "average_cost": "平均成本",
        "latest_price": "最新價格", "market_value_twd_fmt": "市值 (TWD)",
        "unrealized_pnl_twd_fmt": "未實現損益 (TWD)", "return_pct_fmt": "報酬率",
        "weight_fmt": "投組權重", "today_change_pct_fmt": "今日漲跌", "purchase_date": "買進日期",
        "currency": "幣別", "warning": "資料警告",
    }
)

st.dataframe(display, width="stretch", hide_index=True)

csv_bytes = holdings.to_csv(index=False).encode("utf-8-sig")
st.download_button(
    "下載持股明細 CSV", data=csv_bytes, file_name="holdings_snapshot.csv", mime="text/csv"
)

if holdings["warning"].notna().any():
    st.divider()
    st.subheader("資料警告")
    for _, row in holdings[holdings["warning"].notna()].iterrows():
        st.warning(f"{row['name']} ({row['ticker']}): {row['warning']}")
