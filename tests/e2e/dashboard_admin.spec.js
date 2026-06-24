const { test, expect } = require('@playwright/test');

const adminPath = '/admin-dashboard.html';

test.describe('Admin dashboard smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!window.Chart) {
        window.Chart = class {
          constructor() {}
          destroy() {}
        };
      }
    });
    await page.goto(adminPath);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      if (typeof window.initialiseAdminDashboard === 'function') {
        window.initialiseAdminDashboard();
      }
    });
  });

  test('shows welcome banner and metric cards', async ({ page }) => {
    await expect(page.locator('.welcome-banner h2')).toContainText('Welcome back');
    const metricCount = await page.locator('#admin-metric-cards .card').count();
    expect(metricCount).toBeGreaterThan(0);
  });

  test('module links render and reports visible after click', async ({ page }) => {
    const moduleCount = await page.locator('.module-link').count();
    expect(moduleCount).toBeGreaterThan(0);
    await page.locator('.sidebar a[href="#reports"]').click();
    await expect(page.locator('#reports')).toBeVisible();
    await expect(page.locator('#admin-reports-grid')).toBeVisible();
  });

test('sidebar navigation shows bookings section inline', async ({ page }) => {
  await page.getByRole('link', { name: 'Bookings' }).click();
  await expect(page.locator('#bookings')).toBeVisible();
});
});
