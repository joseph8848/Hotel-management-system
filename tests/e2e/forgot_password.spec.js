const { test, expect } = require('@playwright/test');

test.describe('Forgot Password Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password.html');
  });

  test('renders forgot password form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Reset Password');
    await expect(page.locator('form#reset-form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('submitting reset email shows success toast', async ({ page }) => {
    // Fill out form
    await page.locator('input[name="email"]').fill('user@example.com');
    await page.locator('button[type="submit"]').click();
    
    // Assert success toast appears
    const toast = page.locator('.toast.alert-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Password reset link sent to user@example.com');
  });
});
