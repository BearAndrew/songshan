# 國際線報到櫃檯模組 — 介面翻新 (Songshan Counter Reset) 待處理清單

> 設計來源:Claude Design `Songshan Counter Reset`(10 畫面 / 兩視角)
> 範圍:畫面與流程翻新,API 沿用既有 `ApiService`。
> 新檔位置:`src/app/features/intl-checkin-counter-reset/`

## 🔧 需後端支援 / 需確認規格

- [ ] **看板拖拉編輯 + 儲存** — 缺「拖拉後批次儲存新時段」API(目前看板唯讀,按儲存只跳提示)
- [ ] **看板「整季/單日」調整範圍** — 單日覆寫(不影響整季)無對應資料欄位/API(目前只有 UI 切換)
- [ ] **審核「新增 vs 異動」分辨** — `CounterInfo` 無旗標標示某筆 pending 是異動(目前所有待審核一律開「審核新增」)
- [ ] **審核異動彈窗串接** — 前後對照彈窗已做好,等後端提供 ①異動標記 ②異動前資料 才能接上
- [ ] **星期週日值確認** — 既有碼庫寫入用 `0`、讀取用 `7`(本身不一致);目前沿用寫入=0,請與後端確認正確值
- [ ] **「加開」標籤判斷基準** — 目前前端以「同航班+航點第 2 筆(含)後為加開」推斷,依賴回傳順序;建議改用後端明確欄位

## 🧩 前端待補(等規格確認後)

- [ ] **「+ 新增航班」定位** — 目前接到「新增申請」彈窗(`addCounterApplication`);若應為獨立建航班流程需另議
- [ ] **備註欄位** — 設計有備註,但 `addCounterApplication`/`applyEdit` payload 無此欄位(目前輸入不會送出)
- [ ] **報表「第N週/季別」標籤** — 目前為前端計算的外觀標示,確認是否需後端週次定義
- [ ] **側邊選單連結** — 兩條新路由尚未加入導覽選單

## ✅ 已完成(可直接驗證)

- [ ] 航空公司:tabs(當季/下季/本週/下週/今日)+ 申請別/狀態篩選 + 每櫃一筆表格 + 編輯▾(異動/撤回)
- [ ] 航空公司:新增申請彈窗(`addCounterApplication`)
- [ ] 航空公司:異動彈窗 整季→生效起始日 / 指定期間→生效期間(`applyEdit`)
- [ ] 航空公司:撤回二次確認(`userWithdraw`)
- [ ] 航站:航班資料(pending→審核›、其餘→編輯›)+ 航空公司/申請別/狀態篩選 + 搜尋 + 匯入 EXCEL
- [ ] 航站:審核新增彈窗(唯讀表單 + 必填指派櫃檯 + 駁回原因)→ `adminApproval`
- [ ] 航站:櫃檯分配看板 1–6 櫃 × 06:00–22:00,整季青/指定期間橘
- [ ] 航站:報表 週/日切換、點星期跳當日、前後日、匯出 CSV(`CounterExport`)
- [ ] 路由 `/intl-checkin-counter-reset/airline`、`/admin`;build 通過

## 🔍 驗證指令

- [ ] `npm start` → 開 `/#/intl-checkin-counter-reset/airline?user=BR`
- [ ] 開 `/#/intl-checkin-counter-reset/admin`
- [ ] 對照設計截圖 `/tmp/design_extract/untitled/project/screenshots/`
- [ ] Network 確認打到 `Counter/GetAll`、`Counter/ApplicationManual`、`Counter/ApplyEdit`、`Counter/AdminApproval`、`Withdraw/{id}`、`Counter/GetSeasons`
