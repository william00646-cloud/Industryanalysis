"""Data Status page: transparency into what data was fetched from where."""
from __future__ import annotations

import pandas as pd
import streamlit as st

from src.dashboard_data import load_dashboard_state

st.set_page_config(page_title="Data Status - 資料狀態", layout="wide")
st.title("資料狀態")

state = load_dashboard_state()
st.caption(f"本次計算時間：{state.generated_at:%Y-%m-%d %H:%M:%S}")

if not state.data_status:
    st.warning("沒有資料狀態紀錄（可能是 portfolio.csv 驗證失敗）。")
    st.stop()

rows = [
    {
        "項目": r.key,
        "資料來源": r.source,
        "取得成功": "✅" if r.success else "❌",
        "使用備援/快取": "⚠️ 是" if r.used_fallback else "否",
        "最後資料時間": r.as_of or "N/A",
        "備註": r.warning or "",
    }
    for r in state.data_status
]
st.dataframe(pd.DataFrame(rows), width="stretch", hide_index=True)

failed = [r for r in state.data_status if not r.success]
fallback = [r for r in state.data_status if r.used_fallback]

col1, col2 = st.columns(2)
with col1:
    st.subheader("抓取失敗的標的")
    st.write(", ".join(r.key for r in failed) if failed else "無")
with col2:
    st.subheader("使用備援/快取資料的項目")
    st.write(", ".join(r.key for r in fallback) if fallback else "無")

st.divider()
if state.benchmark:
    st.subheader("Benchmark 說明")
    st.write(f"目前使用：**{state.benchmark.label}**（ticker: `{state.benchmark.ticker}`）")
    if not state.benchmark.is_return_index:
        st.warning(
            "台灣加權「報酬指數」（含息）目前無穩定的公開 Yahoo Finance 來源，"
            "本系統暫以一般加權股價指數（不含息）取代，所有比較圖表皆已標註此差異。"
        )
