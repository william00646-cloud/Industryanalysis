from datetime import date

import pandas as pd
import pytest

from src import data_loader


def test_roc_date_to_iso_converts_correctly():
    assert data_loader._roc_date_to_iso("115/05/25") == "2026-05-25"


def test_roc_date_to_iso_handles_bad_input():
    assert data_loader._roc_date_to_iso("garbage") is None
    assert data_loader._roc_date_to_iso("115/05") is None


def test_safe_filename_strips_special_characters():
    assert data_loader._safe_filename("^TWII") == "_TWII"
    assert data_loader._safe_filename("TWD=X") == "TWD_X"
    assert data_loader._safe_filename("2395.TW") == "2395.TW"


def test_history_cache_round_trip(tmp_path, monkeypatch):
    monkeypatch.setattr(data_loader, "HISTORY_CACHE_DIR", tmp_path)
    df = pd.DataFrame({"Close": [1.0, 2.0]}, index=pd.to_datetime(["2026-01-01", "2026-01-02"]))
    data_loader.write_history_cache("TEST.TW", df)
    loaded = data_loader.read_history_cache("TEST.TW")
    assert loaded is not None
    assert list(loaded["Close"]) == [1.0, 2.0]


def test_read_history_cache_missing_file_returns_none(tmp_path, monkeypatch):
    monkeypatch.setattr(data_loader, "HISTORY_CACHE_DIR", tmp_path)
    assert data_loader.read_history_cache("NOPE.TW") is None


def test_fetch_price_history_falls_back_to_twse(monkeypatch):
    twse_df = pd.DataFrame({"Close": [500.0]}, index=pd.to_datetime(["2026-05-25"]))
    monkeypatch.setattr(data_loader, "_fetch_yfinance_history", lambda *a, **k: None)
    monkeypatch.setattr(data_loader, "_fetch_twse_history", lambda *a, **k: twse_df)
    monkeypatch.setattr(data_loader, "write_history_cache", lambda *a, **k: None)

    result = data_loader.fetch_price_history("2395.TW", date(2026, 5, 25), date(2026, 5, 25))
    assert result.success
    assert result.source == "twse"
    assert result.warning is not None


def test_fetch_price_history_falls_back_to_disk_cache(monkeypatch):
    cached_df = pd.DataFrame({"Close": [510.0]}, index=pd.to_datetime(["2026-05-20"]))
    monkeypatch.setattr(data_loader, "_fetch_yfinance_history", lambda *a, **k: None)
    monkeypatch.setattr(data_loader, "_fetch_twse_history", lambda *a, **k: None)
    monkeypatch.setattr(data_loader, "read_history_cache", lambda ticker: cached_df)

    result = data_loader.fetch_price_history("2395.TW", date(2026, 5, 25), date(2026, 5, 25))
    assert result.success
    assert result.used_fallback
    assert result.source == "disk_cache_fallback"


def test_fetch_price_history_all_sources_fail(monkeypatch):
    monkeypatch.setattr(data_loader, "_fetch_yfinance_history", lambda *a, **k: None)
    monkeypatch.setattr(data_loader, "_fetch_twse_history", lambda *a, **k: None)
    monkeypatch.setattr(data_loader, "read_history_cache", lambda ticker: None)

    result = data_loader.fetch_price_history("NFLX", date(2026, 7, 1), date(2026, 7, 1))
    assert not result.success
    assert result.data is None


def test_fetch_latest_price_derives_from_history(monkeypatch):
    hist = pd.DataFrame(
        {"Close": [100.0, 105.0]}, index=pd.to_datetime(["2026-07-09", "2026-07-10"])
    )
    monkeypatch.setattr(data_loader, "_fetch_yfinance_history", lambda *a, **k: hist)
    monkeypatch.setattr(data_loader, "write_history_cache", lambda *a, **k: None)

    result = data_loader.fetch_latest_price("NFLX")
    assert result.success
    assert result.price == pytest.approx(105.0)
    assert result.previous_close == pytest.approx(100.0)
