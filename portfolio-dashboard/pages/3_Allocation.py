"""Allocation page: weight treemap, TW/US split, currency split."""
from __future__ import annotations

import streamlit as st

from src.charts import allocation_bar_chart, weight_treemap
from src.dashboard_data import load_dashboard_state

st.set_page_config(page_title="Allocation - 配置", layout="wide")
st.title("配置")

state = load_dashboard_state()
if not state.validation.ok or state.holdings.empty:
    st.warning("沒有可用的持股資料。")
    st.stop()

holdings = state.holdings
valid = holdings[holdings["data_ok"]]

st.subheader("持股權重")
if not valid.empty:
    st.plotly_chart(weight_treemap(holdings), width="stretch")
else:
    st.info("尚無足夠資料繪製權重圖。")

col1, col2 = st.columns(2)

with col1:
    st.subheader("台股／美股配置")
    if not valid.empty:
        by_asset = valid.groupby("asset_class")["weight"].sum()
        labels = ["台股 (TW_EQUITY)" if k == "TW_EQUITY" else "美股 (US_EQUITY)" for k in by_asset.index]
        st.plotly_chart(
            allocation_bar_chart(labels, by_asset.values.tolist(), "台股／美股配置"),
            width="stretch",
        )
    else:
        st.info("尚無足夠資料。")

with col2:
    st.subheader("幣別配置")
    if not valid.empty:
        by_currency = valid.groupby("currency")["weight"].sum()
        st.plotly_chart(
            allocation_bar_chart(by_currency.index.tolist(), by_currency.values.tolist(), "幣別配置"),
            width="stretch",
        )
    else:
        st.info("尚無足夠資料。")
