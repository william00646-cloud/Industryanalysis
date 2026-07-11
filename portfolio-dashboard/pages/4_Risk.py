"""Risk page: simple, explainable threshold-based alerts and drawdown chart."""
from __future__ import annotations

import streamlit as st

from config.settings import (
    MAX_DRAWDOWN_ALERT,
    MAX_SECTOR_WEIGHT,
    MAX_SINGLE_HOLDING_WEIGHT,
    MAX_TW_MARKET_WEIGHT,
    SINGLE_HOLDING_DROP_ALERT,
    USD_EXPOSURE_WARN_THRESHOLD,
)
from src.charts import drawdown_chart
from src.dashboard_data import load_dashboard_state
from src.formatting import format_pct

st.set_page_config(page_title="Risk - 風險", layout="wide")
st.title("風險提醒")

state = load_dashboard_state()
if not state.validation.ok or state.holdings.empty:
    st.warning("沒有可用的持股資料。")
    st.stop()

if not state.risk_alerts:
    st.success("目前沒有觸發任何風險門檻。")
else:
    for alert in state.risk_alerts:
        if alert.level == "critical":
            st.error(f"**{alert.title}** — {alert.detail}")
        elif alert.level == "warning":
            st.warning(f"**{alert.title}** — {alert.detail}")
        else:
            st.info(f"**{alert.title}** — {alert.detail}")

st.divider()
st.subheader("歷史最大回撤")
if not state.drawdown.empty:
    st.plotly_chart(drawdown_chart(state.drawdown), width="stretch")
    st.metric(
        "最大回撤",
        format_pct(state.max_drawdown, signed=True),
        help=f"發生於 {state.max_drawdown_date:%Y-%m-%d}" if state.max_drawdown_date is not None else None,
    )
else:
    st.info("尚無足夠資料計算回撤。")

st.divider()
st.subheader("風險門檻設定（第一版，簡單透明規則）")
st.table(
    {
        "規則": [
            "單一持股權重上限", "科技股權重上限", "台灣市場權重上限",
            "美元曝險提示門檻", "單一持股虧損警示", "投組最大回撤警示",
        ],
        "門檻": [
            format_pct(MAX_SINGLE_HOLDING_WEIGHT),
            format_pct(MAX_SECTOR_WEIGHT.get("Technology", 0)),
            format_pct(MAX_TW_MARKET_WEIGHT),
            format_pct(USD_EXPOSURE_WARN_THRESHOLD),
            format_pct(SINGLE_HOLDING_DROP_ALERT, signed=True),
            format_pct(MAX_DRAWDOWN_ALERT, signed=True),
        ],
    }
)
st.caption("第一版僅使用簡單門檻規則，不包含 Monte Carlo、Brinson 歸因或因子模型。")
