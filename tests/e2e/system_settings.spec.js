const { test, expect } = require('@playwright/test');

const settingsPath = '/system-settings.html';

test.describe('System settings workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Initialize layout or mock APIs if necessary
    });
    await page.goto(settingsPath);
    await expect(page.locator('#currentDate')).not.toHaveText('Monday, October 16, 2023');
  });

  test('renders settings cards and room categories', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'System Settings' })).toBeVisible();
    await expect(page.locator('.settings-card')).toHaveCount(3);
    await expect(page.locator('table.data-table tbody tr')).toHaveCount(4);
  });

  test('validates password mismatch in change password form', async ({ page }) => {
    const form = page.locator('.password-form');
    await form.locator('#current-password').fill('oldPass1!');
    await form.locator('#new-password').fill('NewPass123');
    await form.locator('#confirm-password').fill('Mismatch321');
    await form.locator('button', { hasText: 'Change Password' }).click();
    
    // Assert that a toast notification appears with the error
    const toastMessage = page.locator('.toast.alert-error');
    await expect(toastMessage).toBeVisible();
    await expect(toastMessage).toContainText('do not match');
  });

  test('initiates database backup and observes success flow', async ({ page }) => {
    const backupButton = page.locator('button', { hasText: 'Backup Database' });

    await backupButton.click();

    // The backup modal should appear
    const modal = page.locator('#global-modal-overlay');
    await expect(modal).toBeVisible();
    await expect(page.locator('#global-modal-title')).toHaveText('Initiate Database Backup');

    // Confirm the backup
    await page.locator('#global-modal-confirm').click();

    // Verify information toast
    const infoToast = page.locator('.toast.alert-info');
    await expect(infoToast).toBeVisible();
    await expect(infoToast).toContainText('backup initiated');

    // Verify success toast appears after timeout
    const successToast = page.locator('.toast.alert-success').first();
    await expect(successToast).toBeVisible({ timeout: 5000 });
    await expect(successToast).toContainText('backup completed');
  });
});
