const { test, expect } = require('@playwright/test');

const staffPath = '/dashboard_staff.html';

test.describe('Staff dashboard smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(staffPath);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      if (typeof window.initialiseStaffDashboard === 'function') {
        window.initialiseStaffDashboard();
      }
    });
  });

  test('renders staff header and shift info', async ({ page }) => {
    await expect(page.locator('#staff-name')).toContainText('Alex Johnson');
    await expect(page.locator('#staff-role-label')).toContainText('Front Desk');
    await expect(page.locator('#shift-remaining-menu')).toContainText('Shift ends');
  });

  test('front desk assignments render for current role', async ({ page }) => {
    const visibleAssignments = await page.locator('.assignment-card[data-role="frontdesk"]').count();
    expect(visibleAssignments).toBeGreaterThan(0);
  });

  test('action hub forms include buttons', async ({ page }) => {
    const form = page.locator('.action-hub form').first();
    const labelCount = await form.locator('label').count();
    const buttonCount = await form.locator('button').count();
    expect(labelCount).toBeGreaterThan(0);
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('sidebar navigation switches sections', async ({ page }) => {
    await page.getByRole('link', { name: 'Manage Rooms' }).click();
    await expect(page.locator('#rooms')).toHaveClass(/active/);
  });
});
