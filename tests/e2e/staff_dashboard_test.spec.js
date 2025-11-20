const { test, expect } = require('@playwright/test');

const staffTestPath = '/staff_dashboard_test.html';

async function waitForResults(page) {
  await page.waitForFunction(() => {
    const container = document.getElementById('test-results');
    return container && container.querySelector('.summary');
  });
}

test.describe('Staff dashboard rendering harness', () => {
  test('all embedded assertions pass', async ({ page }) => {
    await page.goto(staffTestPath);
    await waitForResults(page);

    const summary = page.locator('.summary');
    await expect(summary).toHaveText(/All \d+ checks passed\./);

    const failures = await page.locator('.result.fail').count();
    expect(failures).toBe(0);

    const passCount = await page.locator('.result.pass').count();
    expect(passCount).toBeGreaterThan(0);
  });
});
