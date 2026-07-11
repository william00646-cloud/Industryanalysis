"""Performance page: cumulative return, benchmark comparison, contribution."""
from __future__ import annotations

import streamlit as st

from src.charts import contribution_bar_chart, cumulative_performance_chart, portfolio_vs_benchmark_chart
from src.dashboard_data import load_dashboard_state
from src.formatting import format_pct

st.set_page_config(page_title="Performance - 績效", layout="wide")
st.title("績效")

state = load_dashboard_state()
if not state.validation.ok or state.performance is None or state.performance.daily.empty:
    st.warning("目前沒有足夠的歷史價格資料可繪製績效曲線。")
    st.stop()

st.caption(
    "績效曲線採「現金加權」方式計算：每檔持股在其買進日之前的資金視為現金（報酬 0%），"
    "並非假設所有持股從最早買進日起就已持有。"
)

if state.performance.warnings:
    for w in state.performance.warnings:
        st.warning(w)

st.subheader("Portfolio 累積績效曲線")
if not state.comparison_df["portfolio_index"].dropna().empty:
    st.plotly_chart(cumulative_performance_chart(state.comparison_df), width="stretch")
else:
    st.info("尚無足夠資料繪製累積績效曲線。")

st.subheader(f"Portfolio vs {state.benchmark.label if state.benchmark else 'TAIEX'}")
if state.benchmark and not state.benchmark.is_return_index:
    st.caption("⚠️ 目前使用台灣加權股價指數（未含息），非報酬指數，比較僅供參考。")
if state.benchmark and state.benchmark.fetch.warning:
    st.warning(f"TAIEX 資料: {state.benchmark.fetch.warning}")
if not state.comparison_df["benchmark_index"].dropna().empty:
    st.plotly_chart(
        portfolio_vs_benchmark_chart(state.comparison_df, state.benchmark.label if state.benchmark else "TAIEX"),
        width="stretch",
    )
else:
    st.info("尚無足夠的 TAIEX 資料可比較。")

st.subheader("每檔持股績效貢獻度")
if not state.contribution.dropna(subset=["contribution_pct"]).empty:
    st.plotly_chart(contribution_bar_chart(state.contribution), width="stretch")
    st.caption("貢獻度 = 該持股未實現損益 ÷ 投資組合總成本，加總後等於總報酬率。")
else:
    st.info("尚無足夠資料計算貢獻度。")

latest_return = state.comparison_df["portfolio_index"].dropna()
if not latest_return.empty:
    st.metric("目前累積報酬率（現金加權）", format_pct(latest_return.iloc[-1] / 100 - 1, signed=True))
