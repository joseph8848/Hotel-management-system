const { test, expect } = require('@playwright/test');

const menuPath = '/menu_orders.html';

test.describe('Menu & Orders management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__dialogs = { alerts: [], confirms: [] };
      window.alert = message => {
        window.__dialogs.alerts.push(message);
      };
      window.confirm = message => {
        window.__dialogs.confirms.push(message);
        return true;
      };
    });
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

    const alertsBefore = await page.evaluate(() => window.__dialogs.alerts.length);
    await page.click('button:has-text("Add Menu Item")');
    await page.waitForFunction(({ prev }) => window.__dialogs.alerts.length > prev, { prev: alertsBefore });
    await expect(page.locator('#item-name')).toHaveValue('');
    await expect(page.locator('#item-price')).toHaveValue('');
    await expect(page.locator('#item-category')).toHaveValue('');
    await expect(page.locator('#item-description')).toHaveValue('');

    const alertMessage = await page.evaluate(() => {
      const alerts = window.__dialogs && window.__dialogs.alerts ? window.__dialogs.alerts : [];
      return alerts.length ? alerts[alerts.length - 1] : '';
    });
    expect(alertMessage).toContain('Menu item "Seared Tuna" added successfully!');
  });

  test('marks pending order as served', async ({ page }) => {
    const pendingRow = page.locator('table.data-table').nth(1).locator('tbody tr').filter({ hasText: 'ORD001' });
    const serveButton = pendingRow.getByRole('button', { name: /Mark Served/ });
    const alertsBefore = await page.evaluate(() => window.__dialogs.alerts.length);
    await serveButton.click();
    await page.waitForFunction(({ prev }) => window.__dialogs.alerts.length > prev, { prev: alertsBefore });
    await expect(pendingRow.locator('.status')).toHaveText('Served');
    await expect(pendingRow.getByRole('button', { name: /View/ })).toHaveCount(1);

    const alertMessage = await page.evaluate(() => {
      const alerts = window.__dialogs && window.__dialogs.alerts ? window.__dialogs.alerts : [];
      return alerts.length ? alerts[alerts.length - 1] : '';
    });
    expect(alertMessage).toContain('Order marked as served successfully!');
  });

  test('cancels pending order after confirmation', async ({ page }) => {
    const pendingRow = page.locator('table.data-table').nth(1).locator('tbody tr').filter({ hasText: 'ORD003' });
    const cancelButton = pendingRow.getByRole('button', { name: /Cancel/ });
    const countsBefore = await page.evaluate(() => ({
      alerts: window.__dialogs.alerts.length,
      confirms: window.__dialogs.confirms.length,
    }));
    await cancelButton.click();
    await page.waitForFunction(({ prev }) => window.__dialogs.confirms.length > prev, { prev: countsBefore.confirms });
    await page.waitForFunction(({ prev }) => window.__dialogs.alerts.length > prev, { prev: countsBefore.alerts });
    await expect(pendingRow.locator('.status')).toHaveText('Cancelled');
    await expect(pendingRow.getByRole('button', { name: /View/ })).toHaveCount(1);

    const dialogState = await page.evaluate(() => ({
      confirmLast: (() => {
        const confs = window.__dialogs && window.__dialogs.confirms ? window.__dialogs.confirms : [];
        return confs.length ? confs[confs.length - 1] : '';
      })(),
      alertLast: (() => {
        const alerts = window.__dialogs && window.__dialogs.alerts ? window.__dialogs.alerts : [];
        return alerts.length ? alerts[alerts.length - 1] : '';
      })(),
    }));

    expect(dialogState.confirmLast).toContain('Are you sure you want to cancel this order?');
    expect(dialogState.alertLast).toContain('Order cancelled successfully!');
  });
});
