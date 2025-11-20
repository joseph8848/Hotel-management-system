const { test, expect } = require('@playwright/test');

const dashboardPath = '/dashboard_customer.html';

test.describe('Customer dashboard front-end smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(dashboardPath);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      if (typeof window.wireCustomerQuickActions === 'function') {
        window.wireCustomerQuickActions();
      }
    });
  });

  test('renders welcome banner and plan-your-stay cards', async ({ page }) => {
    await expect(page.locator('h1.welcome')).toContainText('Joseph Kilonzo');
    await expect(page.locator('.quick-group')).toHaveCount(4);
    await expect(page.locator('.snapshot-card')).toHaveCount(4);
    await expect(page.locator('#dining-feed .dining-item')).toHaveCount(3);
  });

  test('quick action inline panel toggles and opens overlay details', async ({ page }) => {
    const firstGroup = page.locator('.quick-group').first();
    const manageStayBtn = firstGroup.getByRole('button', { name: /Manage Stay/i });
    const panel = firstGroup.locator('.quick-panel');

    await manageStayBtn.click();
    await expect(panel).toContainText('Current Stay');

    await manageStayBtn.click();
    await manageStayBtn.click();
    await expect(panel).toContainText('Current Stay');

    await panel.getByRole('button', { name: 'Open full details' }).click();

    const overlay = page.locator('#quick-action-overlay');
    await expect(overlay).toHaveClass(/is-visible/);
    await expect(overlay.locator('#quick-action-title')).toContainText('Manage Your Stay');

    await page.locator('#quick-action-close').click();
    await expect(overlay).not.toHaveClass(/is-visible/);
  });

  test('sidebar navigation switches between dashboard sections', async ({ page }) => {
    const bookingsLink = page.locator('.sidebar nav').getByRole('link', { name: /My Bookings/ });
    await bookingsLink.click();
    await expect(page.locator('#bookings')).toHaveClass(/active/);
    await expect(page.locator('#dashboard')).not.toHaveClass(/active/);

    const paymentsLink = page.locator('.sidebar nav').getByRole('link', { name: /My Payments/ });
    await paymentsLink.click();
    await expect(page.locator('#payments')).toHaveClass(/active/);
  });

  test('other quick action groups surface inline content', async ({ page }) => {
    const arrivalGroup = page.locator('.quick-group').nth(1);
    const arrivalBtn = arrivalGroup.getByRole('button', { name: /Check-In/ });
    const arrivalPanel = arrivalGroup.locator('.quick-panel');

    await arrivalBtn.click();
    await expect(arrivalPanel).toContainText('Arrival');

    const diningGroup = page.locator('.quick-group').nth(2);
    const reserveDiningBtn = diningGroup.getByRole('button', { name: /Reserve Dining/ });
    const diningPanel = diningGroup.locator('.quick-panel');

    await reserveDiningBtn.click();
    await expect(diningPanel).toContainText('Reserve Dining');
  });
});
