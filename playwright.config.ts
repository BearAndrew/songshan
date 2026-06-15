import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 設定 — 國際線報到櫃檯模組(Songshan Counter Reset)流程測試
 *
 * 觀看測試過程的方式(詳見 docs/counter-reset-e2e.md):
 *   npx playwright test --ui        # UI 模式:可逐步重播、時間旅行(推薦)
 *   npx playwright test --headed    # 開實體瀏覽器視窗執行,可肉眼看流程
 *   npx playwright show-report      # 執行後開啟 HTML 報告(含影片/trace)
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:4200',
    viewport: { width: 1600, height: 920 },
    trace: 'on',            // 每次都留 trace,可在報告中時間旅行
    video: 'on',            // 每次都錄影,可回放整段流程
    screenshot: 'only-on-failure',
    launchOptions: { slowMo: 300 }, // 放慢動作,headed 模式較好觀察
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // 自動啟動 Angular dev server(若已自行啟動則沿用)
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
