const { test, expect } = require('@playwright/test');

const accessDeniedPath = '/access_denied.html';

test.describe('Access denied page', () => {
  test('displays error messaging and support info', async ({ page }) => {
    await page.goto(accessDeniedPath);

    await expect(page.locator('h1', { hasText: 'Access Denied' })).toBeVisible();
    await expect(page.locator('.error-card p').first()).toContainText("you don't have permission", {
      ignoreCase: true,
    });
    await expect(page.locator('.error-details')).toContainText('403 Forbidden');
    const currentTime = await page.locator('#current-time').innerText();
    expect(currentTime.trim().length).toBeGreaterThan(0);
    await expect(page.locator('.dashboard-link')).toHaveAttribute('href', 'logout.php');
  });
});
