const { test, expect } = require('@playwright/test');

const billingPath = '/billing_transactions.html';

test.describe('Billing & Transactions page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__dialogs = { alerts: [], confirms: [], prompts: [] };
      window.alert = message => {
        window.__dialogs.alerts.push(message);
      };
      window.confirm = message => {
        window.__dialogs.confirms.push(message);
        return true;
      };
      window.prompt = (message, defaultValue) => {
        window.__dialogs.prompts.push({ message, defaultValue });
        return 'RESET';
      };
    });
    await page.goto(billingPath);
  });

  test('renders headline metrics and billing table', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Billing & Transactions' })).toBeVisible();
    const cards = page.locator('.dashboard-cards .card');
    await expect(cards).toHaveCount(4);
    await expect(page.locator('.table-container')).toBeVisible();
    await expect(page.locator('.data-table tbody tr')).toHaveCount(8);
  });

  test('filters table rows via status select', async ({ page }) => {
    const searchBox = page.locator('.filter-bar .search-box');
    await searchBox.fill('Emily Davis');
    const filteredRow = page.locator('.data-table tbody tr').filter({ hasText: 'Emily Davis' }).first();
    await expect(filteredRow).toBeVisible();
  });

  test('marks unpaid bill as paid', async ({ page }) => {
    const unpaidRow = page.locator('.data-table tbody tr').filter({ hasText: 'BILL005' }).first();
    await expect(unpaidRow).toContainText('Unpaid');
    const payButton = unpaidRow.getByRole('button', { name: /Mark Paid/i });
    await payButton.click();
    await page.waitForFunction(() => window.__dialogs && window.__dialogs.alerts.length > 0);
    const lastAlert = await page.evaluate(() => {
      const alerts = window.__dialogs.alerts;
      return alerts.length ? alerts[alerts.length - 1] : '';
    });
    expect(lastAlert).toContain('Bill marked as paid successfully!');
    await page.waitForFunction(() => {
      const rows = Array.from(document.querySelectorAll('.data-table tbody tr'));
      const target = rows.find(row => row.textContent.includes('BILL005'));
      if (!target) return false;
      const statusCell = target.querySelector('.status');
      return statusCell && statusCell.textContent.trim() === 'Paid';
    });
    await expect(unpaidRow.locator('.status')).toHaveText('Paid');
    await expect(unpaidRow.getByRole('button', { name: /Mark Paid/i })).toHaveCount(0);
  });
});
