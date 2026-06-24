const { test, expect } = require('@playwright/test');

const menuPath = '/menu-orders.html';

test.describe('Menu & Orders management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Mock APIs or initialization could go here
    });
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto(menuPath);
    await expect(page.locator('#currentDate')).not.toHaveText('Monday, October 16, 2023');
  });

  test('shows headline stats, menu items, and orders', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Menu & Food Orders' })).toBeVisible();
    await expect(page.locator('.dashboard-cards .card')).toHaveCount(4);
    await expect(page.locator('table.data-table').first().locator('tbody tr')).toHaveCount(4);
    await expect(page.locator('table.data-table').nth(1).locator('tbody tr')).toHaveCount(5);
  });

  test('submits add menu item form and resets fields', async ({ page }) => {
    await page.fill('#item-name', 'Seared Tuna');
    await page.fill('#item-price', '29.50');
    await page.selectOption('#item-category', 'main-course');
    await page.fill('#item-description', 'Pan-seared tuna with citrus glaze');

    await page.click('button:has-text("Add Menu Item")');
    
    // Assert that a success toast appears
    const toast = page.locator('.toast.alert-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Menu item "Seared Tuna" added successfully!');
    
    // Verify form cleared
    await expect(page.locator('#item-name')).toHaveValue('');
    await expect(page.locator('#item-price')).toHaveValue('');
    await expect(page.locator('#item-category')).toHaveValue('');
    await expect(page.locator('#item-description')).toHaveValue('');
  });

  test('marks pending order as served', async ({ page }) => {
    const pendingRow = page
      .locator('table.data-table')
      .nth(1)
      .locator('tbody tr')
      .filter({ hasText: 'ORD001' });
    const serveButton = pendingRow.getByRole('button', { name: /Mark Served/ });
    await serveButton.click();
    
    // Assert success toast appears
    const toast = page.locator('.toast.alert-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Order marked as served successfully!');

    await expect(pendingRow.locator('.status')).toHaveText('Served');
    await expect(pendingRow.getByRole('button', { name: /View/ })).toHaveCount(1);
  });

  test('cancels pending order after confirmation', async ({ page }) => {
    const pendingRow = page
      .locator('table.data-table')
      .nth(1)
      .locator('tbody tr')
      .filter({ hasText: 'ORD003' });
    const cancelButton = pendingRow.getByRole('button', { name: /Cancel/ });
    
    await cancelButton.click();
    
    // Check that custom HTML modal appears
    const modal = page.locator('#global-modal-overlay');
    await expect(modal).toBeVisible();
    await expect(page.locator('#global-modal-title')).toHaveText('Cancel Order');
    
    // Click custom confirm button
    await page.locator('#global-modal-confirm').click();
    
    // Assert success toast appears
    const toast = page.locator('.toast.alert-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Order cancelled successfully!');

    await expect(pendingRow.locator('.status')).toHaveText('Cancelled');
    await expect(pendingRow.getByRole('button', { name: /View/ })).toHaveCount(1);
  });
});
