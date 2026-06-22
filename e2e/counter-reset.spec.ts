import { test, expect, Page } from '@playwright/test';

/**
 * 國際線報到櫃檯模組 — 流程 e2e
 * 注意:測試聚焦「畫面流程」(tabs / 彈窗 / 下拉 / 切換),
 * 不依賴後端資料(API 可能無回應,頁面結構仍會渲染)。
 */

const AIRLINE = '/intl-checkin-counter-reset/airline?user=BR';
const ADMIN = '/intl-checkin-counter-reset/admin';

test.describe('航空公司視角', () => {
  test('tabs 顯示且可切換', async ({ page }) => {
    await page.goto(AIRLINE);
    for (const t of ['當季', '下季', '本週', '下週', '今日']) {
      await expect(page.locator('.ops-tab', { hasText: t })).toBeVisible();
    }
    await page.locator('.ops-tab', { hasText: '本週' }).click();
    await expect(page.locator('.ops-tab.is-active', { hasText: '本週' })).toBeVisible();
  });

  test('新增申請彈窗:開啟 → 切換申請類別 → 下拉 overlay → 取消', async ({ page }) => {
    await page.goto(AIRLINE);

    await page.getByRole('button', { name: '新增申請' }).click();
    const modal = page.locator('.ops-modal');
    await expect(modal.getByText('新增櫃檯使用申請')).toBeVisible();

    // 預設整季 → 顯示「季度」
    await expect(modal.locator('.ops-field-label', { hasText: '季度' })).toBeVisible();

    // 切到指定期間(modal 內 radio chip)→ 顯示「指定起迄日期」
    await modal.locator('.ops-radio-chip', { hasText: '指定期間' }).click();
    await expect(modal.getByText('指定起迄日期')).toBeVisible();

    // 切回整季定期航班 → 季度再次出現
    await modal.locator('.ops-radio-chip', { hasText: '整季定期航班' }).click();
    await expect(modal.locator('.ops-field-label', { hasText: '季度' })).toBeVisible();

    // 航班編號可輸入
    await modal.locator('input.ops-input.is-mono').first().fill('BR196');

    // 航點下拉(overlay)可開啟並顯示面板
    await modal.locator('app-ops-select .ops-dd-trigger').first().click();
    await expect(page.locator('.ops-dd-panel')).toBeVisible();
    await page.keyboard.press('Escape');

    // 取消關閉彈窗
    await page.getByRole('button', { name: '取消' }).click();
    await expect(page.getByText('新增櫃檯使用申請')).toHaveCount(0);
  });

  test('編輯選單:同時只有一個且點外部關閉', async ({ page }) => {
    await page.goto(AIRLINE);
    const editButtons = page.getByRole('button', { name: '編輯 ▾' });
    const count = await editButtons.count();
    test.skip(count < 1, '無申請資料,略過(需後端資料)');

    await editButtons.nth(0).click();
    await expect(page.locator('.ops-menu')).toHaveCount(1);

    // 點選單外(表頭)→ 應關閉,確保畫面同時只有一個選單
    await page.locator('.ops-table th').first().click();
    await expect(page.locator('.ops-menu')).toHaveCount(0);
  });
});

test.describe('航站管理員視角', () => {
  async function gotoAdmin(page: Page) {
    await page.goto(ADMIN);
    await expect(page.locator('.ops-tab', { hasText: '航班資料' })).toBeVisible();
  }

  test('nav tabs 切換:航班資料 / 櫃檯分配 / 報表', async ({ page }) => {
    await gotoAdmin(page);

    await page.locator('.ops-tab', { hasText: '櫃檯分配' }).click();
    await expect(page.getByText('櫃檯時間軸', { exact: false })).toBeVisible();
    await expect(page.locator('.ops-gantt')).toBeVisible();

    await page.locator('.ops-tab', { hasText: '報表' }).click();
    await expect(page.locator('.ops-report-switch')).toBeVisible();
  });

  test('報表 週/日 切換', async ({ page }) => {
    await gotoAdmin(page);
    await page.locator('.ops-tab', { hasText: '報表' }).click();

    // 切到「日」→ 顯示前日/後日 導覽
    await page.locator('.ops-report-switch .opt', { hasText: '日' }).click();
    await expect(page.getByRole('button', { name: '前日', exact: false })).toBeVisible();

    // 切回「週」→ 顯示上週/下週 導覽
    await page.locator('.ops-report-switch .opt', { hasText: '週' }).click();
    await expect(page.getByRole('button', { name: '上週', exact: false })).toBeVisible();
  });
});
