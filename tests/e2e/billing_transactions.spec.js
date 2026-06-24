const { test, expect } = require('@playwright/test');

const billingPath = '/billing-transactions.html';

test.describe('Billing & Transactions page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Initialize any mocks here
    });
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
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
    const filteredRow = page
      .locator('.data-table tbody tr')
      .filter({ hasText: 'Emily Davis' })
      .first();
    await expect(filteredRow).toBeVisible();
  });

  test('marks unpaid bill as paid', async ({ page }) => {
    const unpaidRow = page.locator('.data-table tbody tr').filter({ hasText: 'BILL005' }).first();
    await expect(unpaidRow).toContainText('Unpaid');
    const payButton = unpaidRow.getByRole('button', { name: /Mark Paid/i });
    await payButton.click();

    // Verify toast appears
    const toast = page.locator('.toast.alert-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Bill marked as paid successfully!');

    // Wait for UI to update row status
    await expect(unpaidRow.locator('.status')).toHaveText('Paid');
    await expect(unpaidRow.getByRole('button', { name: /Mark Paid/i })).toHaveCount(0);
  });
});
