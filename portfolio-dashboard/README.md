# 個人持股定期追蹤 Dashboard

以 Streamlit 打造的個人持股追蹤儀表板：抓取最新市場價格、計算損益，並與台灣加權指數比較。設計目標是**簡單、穩定、容易維護** —— 新增/調整持股只需要編輯 `portfolio.csv`，不需要改程式碼。

## 功能

- Overview：總市值、總成本、未實現損益／報酬率、今日損益、持股數、最大單一持股權重、台股／美股配置
- Holdings：可排序的持股明細表，支援下載 CSV
- Performance：Portfolio 累積績效曲線、vs TAIEX 比較曲線、每檔持股績效貢獻度
- Allocation：持股權重 Treemap、台股／美股配置、幣別配置
- Risk：簡單門檻式風險警示（集中度、科技股比重、台灣市場比重、美元曝險、單一持股虧損、最大回撤）
- Data Status：每項資料的來源、最後更新時間、是否使用備援/快取、抓取失敗清單

## 專案結構

```
portfolio-dashboard/
  app.py                 # Streamlit 入口（Overview 頁）
  pages/                 # Holdings / Performance / Allocation / Risk / Data Status
  src/
    data_loader.py        # Yahoo Finance 抓取 + TWSE 備援 + 磁碟快取
    fx.py                  # USD/TWD 匯率與日期對齊
    benchmark.py            # TAIEX（一般指數；報酬指數不可用時明確標註）
    portfolio_engine.py     # 讀取 portfolio.csv、計算市值/損益/權重/風險警示
    analytics.py             # 現金加權績效曲線、回撤、貢獻度
    charts.py                 # Plotly 圖表
    validators.py             # portfolio.csv 與資料品質驗證
    cache_layer.py             # st.cache_data 包裝層
    dashboard_data.py           # 組合以上模組，供各頁面共用
  config/settings.py       # 風險門檻、快取 TTL、sector 對照表（全部可調整、不藏在程式邏輯中）
  data/cache/               # GitHub Actions 寫入的每日快照，作為即時來源失敗時的備援
  tests/                    # pytest 單元測試
  portfolio.csv             # 持股資料（唯一需要維護的檔案）
  requirements.txt
```

## 本機執行

```bash
cd portfolio-dashboard
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

瀏覽器開啟 `http://localhost:8501`。左側「立即重新整理」按鈕會清除快取並重抓最新資料。

## 維護持股：只需編輯 portfolio.csv

欄位：`ticker, name, shares, average_cost, currency, purchase_date, asset_class, sector`（`sector` 可省略，缺省時使用 `config/settings.py` 的 `DEFAULT_SECTOR_MAP`）。

- `ticker`：台股用 Yahoo Finance 格式，例如 `2395.TW`；美股直接用代號，例如 `NFLX`
- `currency`：`TWD` 或 `USD`
- `asset_class`：`TW_EQUITY` 或 `US_EQUITY`
- `purchase_date`：`YYYY-MM-DD`

存檔後重新整理頁面即可，不需要改任何程式碼。系統會先驗證格式（`src/validators.py`），格式錯誤時 Overview 頁會顯示明確錯誤訊息並停止計算，而不是猜測或略過。

## 資料來源與備援策略

1. 優先用 **Yahoo Finance**（`yfinance`）抓取台股/美股歷史價、最新價、`^TWII`（台灣加權指數）、`TWD=X`（USD/TWD）。
2. 台股（`.TW`）若 Yahoo Finance 失敗，改用 **TWSE 盤後資訊 API**（`STOCK_DAY`）逐月抓取備援。
3. 若即時來源全部失敗，改讀 `data/cache/history/*.csv`（由 GitHub Actions 每日寫入的最後一次成功快照），並在畫面上明確標示「使用備援/快取」。
4. 任何時候都**不會**用估算值或前一天資料靜默填補缺漏——缺資料就顯示警告。

### 已知限制（第一版刻意的簡化）

- **台灣加權報酬指數（含息）**：Yahoo Finance 目前沒有穩定公開的 ticker，因此第一版使用一般加權股價指數（`^TWII`，不含息）。所有相關圖表與 Data Status 頁都會清楚標註「非報酬指數」。若未來找到穩定來源，只需修改 `config/settings.py` 的 `TAIEX_RETURN_INDEX_TICKER`。
- **Sector 分類**：`config/settings.py` 的 `DEFAULT_SECTOR_MAP` 是靜態、可編輯的對照表，僅用於風險警示（例如「科技股比重過高」），不是市場資料。
- 不含 Monte Carlo、Brinson 歸因或因子模型 —— 只做簡單、可解釋的門檻式風險提醒。

## 績效計算方法（現金加權）

Portfolio 累積績效曲線**不會**假設所有持股從最早買進日就已持有：每檔持股在其個別買進日之前，對應的成本金額視為閒置台幣現金（報酬 0%）。買進日之後才依市值計算。美股（NFLX）先以 USD 計價，再用當日（或最近一個有效交易日）USD/TWD 匯率換算為台幣。詳見 `src/analytics.py`。

## 測試

```bash
cd portfolio-dashboard
source .venv/bin/activate
pytest
```

測試涵蓋 `validators`、`portfolio_engine`（含風險警示規則）、`analytics`（含現金加權邏輯與回撤計算）、`fx`（匯率日期對齊）、`data_loader`（TWSE 日期轉換、快取讀寫、備援鏈）。網路相關的函式在測試中均以 monkeypatch 模擬，不依賴真實外部連線。

## 部署到 Streamlit Community Cloud

1. 將本專案推送到 GitHub。
2. 在 [share.streamlit.io](https://share.streamlit.io) 建立新 App，Repository 選這個 repo，**Main file path** 填 `portfolio-dashboard/app.py`。
3. 不需要額外的 Secrets（Yahoo Finance 與 TWSE 皆為公開、無金鑰的來源）。
4. 建議搭配下方 GitHub Actions 每日更新 `data/cache/`，讓 App 冷啟動時也有備援資料。

## 自動更新（GitHub Actions）

`.github/workflows/portfolio_dashboard_update.yml` 會在每個平日台灣時間 14:00（收盤後）執行 `scripts/refresh_cache.py`，重新抓取所有持股、匯率、TAIEX 的歷史資料並寫入 `data/cache/`，若有變動則自動 commit。非交易日腳本會正常結束（不會讓 workflow failed），只是快取內容不變。也可以在 GitHub Actions 頁面手動 `workflow_dispatch` 觸發。

## 快取策略

`src/cache_layer.py` 用 `st.cache_data` 包裝所有網路抓取：

| 資料 | TTL |
|---|---|
| 個股/指數歷史價 | 6 小時 |
| 最新價格 | 15 分鐘 |
| USD/TWD 匯率 | 1 小時 |

側邊欄「🔄 立即重新整理」按鈕會清除全部快取並重新抓取，避免使用者每次操作都重複下載整段歷史資料。
