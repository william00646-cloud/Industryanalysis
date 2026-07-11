"""Plotly chart builders.

Color use follows a fixed-order categorical palette (identity), a single
blue hue for magnitude, and a blue/red diverging pair for gain/loss and
drawdown (polarity) -- never a rainbow, never color assigned by rank.
"""
from __future__ import annotations

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

CATEGORICAL = ["#2a78d6", "#1baf7a", "#eda100", "#008300", "#4a3aa7", "#e34948", "#e87ba4", "#eb6834"]
BLUE = "#2a78d6"
RED = "#e34948"
GRAY_INK = "#52514e"
MUTED = "#898781"
GRID = "#e1e0d9"

_LAYOUT_DEFAULTS = dict(
    template="plotly_white",
    font=dict(family="system-ui, -apple-system, 'Segoe UI', sans-serif", color="#0b0b0b"),
    margin=dict(l=10, r=10, t=40, b=10),
    plot_bgcolor="#fcfcfb",
    paper_bgcolor="rgba(0,0,0,0)",
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="left", x=0),
)


def _apply_layout(fig: go.Figure, title: str | None = None) -> go.Figure:
    fig.update_layout(**_LAYOUT_DEFAULTS)
    if title:
        fig.update_layout(title=dict(text=title, font=dict(size=15)))
    fig.update_xaxes(showgrid=False, linecolor=MUTED)
    fig.update_yaxes(showgrid=True, gridcolor=GRID, zerolinecolor=GRID)
    return fig


def cumulative_performance_chart(daily: pd.DataFrame) -> go.Figure:
    """Single-series portfolio cumulative return curve (rebased to 100)."""
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=daily.index, y=daily["portfolio_index"], mode="lines",
            line=dict(color=BLUE, width=2), name="Portfolio",
            hovertemplate="%{x|%Y-%m-%d}<br>指數: %{y:.2f}<extra></extra>",
        )
    )
    return _apply_layout(fig, "Portfolio 累積績效（起始=100）")


def portfolio_vs_benchmark_chart(daily: pd.DataFrame, benchmark_label: str) -> go.Figure:
    """Two-series comparison: portfolio index vs. TAIEX index, both rebased to 100."""
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=daily.index, y=daily["portfolio_index"], mode="lines",
            line=dict(color=BLUE, width=2), name="Portfolio",
            hovertemplate="%{x|%Y-%m-%d}<br>Portfolio: %{y:.2f}<extra></extra>",
        )
    )
    fig.add_trace(
        go.Scatter(
            x=daily.index, y=daily["benchmark_index"], mode="lines",
            line=dict(color=CATEGORICAL[1], width=2, dash="dot"), name=benchmark_label,
            hovertemplate="%{x|%Y-%m-%d}<br>" + benchmark_label + ": %{y:.2f}<extra></extra>",
        )
    )
    return _apply_layout(fig, f"Portfolio vs {benchmark_label}（起始=100）")


def contribution_bar_chart(contrib: pd.DataFrame) -> go.Figure:
    """Horizontal bar of each holding's contribution to total portfolio return."""
    df = contrib.dropna(subset=["contribution_pct"]).sort_values("contribution_pct")
    colors = [BLUE if v >= 0 else RED for v in df["contribution_pct"]]
    fig = go.Figure(
        go.Bar(
            x=df["contribution_pct"] * 100, y=df["name"], orientation="h",
            marker_color=colors,
            text=[f"{v * 100:+.2f}%" for v in df["contribution_pct"]],
            textposition="outside",
            hovertemplate="%{y}: %{x:.2f}%<extra></extra>",
        )
    )
    fig.add_vline(x=0, line_color=MUTED, line_width=1)
    return _apply_layout(fig, "每檔持股績效貢獻度（占總成本 %）")


def weight_treemap(holdings: pd.DataFrame) -> go.Figure:
    """Treemap of portfolio weight by holding."""
    df = holdings.dropna(subset=["weight"])
    fig = px.treemap(
        df, path=["name"], values="weight",
        color="name", color_discrete_sequence=CATEGORICAL,
        custom_data=["ticker"],
    )
    fig.update_traces(
        texttemplate="%{label}<br>%{percentRoot:.1%}",
        hovertemplate="%{label} (%{customdata[0]})<br>權重: %{percentRoot:.2%}<extra></extra>",
    )
    fig.update_layout(margin=dict(l=4, r=4, t=30, b=4), paper_bgcolor="rgba(0,0,0,0)")
    fig.update_layout(title=dict(text="持股權重 Treemap", font=dict(size=15)))
    return fig


def allocation_bar_chart(labels: list[str], values: list[float], title: str) -> go.Figure:
    """Simple two/three-category allocation bar (asset class / currency)."""
    fig = go.Figure(
        go.Bar(
            x=labels, y=[v * 100 for v in values],
            marker_color=CATEGORICAL[: len(labels)],
            text=[f"{v * 100:.1f}%" for v in values], textposition="outside",
            hovertemplate="%{x}: %{y:.1f}%<extra></extra>",
        )
    )
    fig.update_yaxes(title="權重 (%)")
    return _apply_layout(fig, title)


def drawdown_chart(drawdown: pd.Series) -> go.Figure:
    """Underwater equity (drawdown) chart, filled area below zero."""
    fig = go.Figure(
        go.Scatter(
            x=drawdown.index, y=drawdown * 100, mode="lines", fill="tozeroy",
            line=dict(color=RED, width=1.5), fillcolor="rgba(227,73,72,0.25)",
            name="Drawdown",
            hovertemplate="%{x|%Y-%m-%d}<br>回撤: %{y:.2f}%<extra></extra>",
        )
    )
    fig.add_hline(y=0, line_color=MUTED, line_width=1)
    fig.update_yaxes(title="回撤 (%)")
    return _apply_layout(fig, "歷史最大回撤")
