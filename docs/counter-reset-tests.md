# 國際線報到櫃檯模組(Songshan Counter Reset)單元測試清單

> 測試框架:Jasmine + Karma(`ng test`)
> 執行:`npx ng test --watch=false --browsers=ChromeHeadless`
> 範圍:`src/app/features/intl-checkin-counter-reset/**/*.spec.ts`
> 結果:**38 項全數通過** ✅(2026-06-14)

---

## 1. `reset-shared.spec.ts` — 共用邏輯(純函式,27 項)

### getApplyType(申請類別判定)
- [x] `applyForPeriod` 含 `~` → `range`(指定期間)
- [x] `applyForPeriod` 為空 → `season`(整季)

### getStatusKind(狀態對照)
- [x] `APPLY` → `pending`(待審核)
- [x] `APPROVE` → `approved`(已核准)
- [x] `REJECT` → `rejected`(已駁回)
- [x] `WITHDRAW` → `null`(不顯示)
- [x] 未知 / 空字串 → `null`

### flightCode
- [x] 航空公司代碼 + 航班號(BR + 196 → `BR196`)

### hhmm(時間截斷)
- [x] `06:30:00` → `06:30`
- [x] 空字串 → 空
- [x] `undefined` → 空

### timeToDecimal(時間轉小數,看板定位用)
- [x] `08:30` → `8.5`
- [x] `06:00` → `6`
- [x] 帶秒 `22:00:00` → `22`
- [x] 空值 → `NaN`

### timeRange
- [x] 組出「開始 ~ 結束」(`06:30 ~ 08:00`)
- [x] 缺值回空字串

### parseApplicationDate
- [x] 解析「2026/1/19 上午 12:00:00」→ 正確年/月/日
- [x] 無效輸入 → `null`

### dayOfWeekNumbers
- [x] 解析並排序、過濾 1~7 以外(`3,1,2` → `[1,2,3]`;`0,8,5` → `[5]`)
- [x] 空字串 → `[]`

### dayOfWeekLabel(issue#6:一律斜線分隔)
- [x] `1,2,3,4` → `一/二/三/四`(不用 `~`)
- [x] 全選七天 → `一/二/三/四/五/六/日`
- [x] 不連續 `2,4,6` → `二/四/六`
- [x] 空 → 空

### applyTypeClass(看板色)
- [x] `season` → `is-cyan`
- [x] `range` → `is-orange`

---

## 2. `ops-select.component.spec.ts` — 通用下拉元件(issue#5,7 項)

- [x] 元件建立成功
- [x] `writeValue` 後 `selectedLabel` 反映對應選項(CVA)
- [x] 無對應值時 `selectedLabel` 為空(顯示 placeholder)
- [x] `select()` 更新 value 並觸發 `onChange`(CVA 雙向綁定)
- [x] `select()` 後 `selectedLabel` 更新
- [x] `setDisabledState` 控制 `disabled`
- [x] `disabled` 時點擊不開啟選單

---

## 3. `application-form-modal.component.spec.ts` — 新增/異動彈窗(4 項)

### 新增(mode=new)
- [x] 欄位不完整時 `submit` 不送出結果(驗證攔截)
- [x] 填妥後送出正確 payload:
      - 航班編號拆解(`BR196` → `BR`/`196`)
      - **星期週日轉 0**(`{一,日}` → `1,0`,沿用既有寫入格式)
      - 時間補秒(`06:30` → `06:30:00`)
      - 航點 / 季度正確帶入

### 異動(mode=modify)
- [x] 依既有資料 prefill(航班、申請類別=整季、時間、星期)
- [x] 整季異動需「生效起始日」;未填不送出,填妥後送出 modify payload
      (`requestId`、`dayOfWeek`、`startDate=生效日`、`endDate=''`)

---

## 附註

- 本次為使測試套件可執行,順帶修正了兩個**既有(非本次功能)** 的壞掉 spec:
  - `src/app/app.component.spec.ts` — 移除參照不存在的 `title` 的 starter 測試
  - `src/app/features/taxi-module/components/create/home/home.component.spec.ts` — 修正 import 名稱 `HomeComponent` → `CreateHomeComponent`
- 其他既有元件 spec 仍有 `No provider for HttpClient / ActivatedRoute` 等 **既有** 失敗(未提供測試 providers),與本次功能無關,未在本次處理範圍。
- UI 互動(overlay 開合、彈窗 DOM、拖拉)以邏輯層測試為主;端到端互動建議另以 e2e 補強。
