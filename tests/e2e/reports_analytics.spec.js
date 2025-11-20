const { test, expect } = require('@playwright/test');

const analyticsPath = '/reports_analytics.html';

test.describe('Reports & Analytics portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(analyticsPath);
  });

  test('renders key performance cards and sections', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Reports & Analytics' })).toBeVisible();
    await expect(page.locator('.dashboard-cards .card')).toHaveCount(3);
    await expect(page.locator('.top-customers .customer-list li')).toHaveCount(2);
    await expect(page.locator('.export-section')).toBeVisible();
  });

  test('mobile menu button toggles sidebar visibility', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).not.toHaveClass(/active/);
    await page.locator('.mobile-menu-btn').click();
    await expect(sidebar).toHaveClass(/active/);
  });
});
