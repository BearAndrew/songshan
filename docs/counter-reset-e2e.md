# 國際線報到櫃檯模組 — Playwright 流程測試 / 播放教學

## 測試涵蓋(`e2e/counter-reset.spec.ts`)

**航空公司視角**
1. tabs(當季/下季/本週/下週/今日)顯示且可切換
2. 新增申請彈窗:開啟 → 切換「整季定期航班 / 指定期間」→ 開啟航點下拉 overlay → 取消關閉
3. 編輯選單:同時只有一個,且點選單外部會關閉

**航站管理員視角**
4. nav tabs 切換:航班資料 / 櫃檯分配(看板)/ 報表
5. 報表「週 / 日」切換

> 測試聚焦「畫面流程」,不強依賴後端資料(API 無回應時頁面結構仍渲染;與資料筆數相關的步驟會自動 `skip`)。

---

## 一次性安裝(已完成,新環境才需要)

```bash
npm i -D @playwright/test
npx playwright install chromium
```

`playwright.config.ts` 已設定 `webServer` 自動啟動 `npm start`(Angular dev server,`http://localhost:4200`);若你已自行 `npm start`,會自動沿用,不會重啟。

---

## 如何執行 / 觀看測試過程

| 指令 | 說明 |
|---|---|
| `npm run e2e` | 無頭執行(最快,CI 用)。每次都會錄影 + trace |
| `npm run e2e:headed` | **開實體瀏覽器視窗**,可肉眼看點擊/切換流程(已設 `slowMo: 300ms` 放慢) |
| `npm run e2e:ui` | **UI 模式(最推薦)**:左側列出每個測試,可點「▶」逐一重播、滑時間軸時間旅行、看每步驟 DOM 快照 |
| `npm run e2e:report` | 執行後開啟 HTML 報告(含**影片回放**與 trace) |

### 想「看著它跑」最直覺的方式
```bash
npm run e2e:ui
```
開啟後:
1. 左側勾選/點測試 → 按上方 ▶ 執行
2. 中間時間軸可左右拖,逐格看畫面(Before/After)
3. 點任一步驟看當下的點擊位置、網路請求、Console

### 想看「實體瀏覽器」跑一遍
```bash
npm run e2e:headed
```
會彈出 Chromium 視窗實際操作(放慢動作)。

### 跑完回放影片 / trace
```bash
npm run e2e            # 先跑
npm run e2e:report     # 開報告,點任一測試可看 video.webm 與 trace
```
單一 trace 也可直接開:
```bash
npx playwright show-trace test-results/<該測試資料夾>/trace.zip
```

### 只跑單一測試
```bash
npx playwright test -g "新增申請彈窗"            # 依標題關鍵字
npx playwright test e2e/counter-reset.spec.ts:22 # 依行號
```

---

## 產出物與版控

- `playwright-report/`、`test-results/` 為產出(影片、trace、截圖),建議加入 `.gitignore`。

## 備註

- 目前測試針對兩條路由:`/intl-checkin-counter-reset/airline?user=BR` 與 `/intl-checkin-counter-reset/admin`(專案為 path 路由,非 hash)。
- 若要新增「送出申請 → 驗證 API 真的被呼叫」的斷言,可用 `page.waitForRequest('**/Counter/ApplicationManual')` 等;目前未強制斷言以避免污染後端資料。
