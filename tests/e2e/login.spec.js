const { test, expect } = require('@playwright/test');

const loginPath = '/login.html';

test.describe('Login portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginPath);
  });

  test('shows inline validation when submitting empty form', async ({ page }) => {
    await page.click('#login-btn');

    await expect(page.locator('#email-error')).toHaveText('Email is required');
    await expect(page.locator('#password-error')).toHaveText(
      'Password must be at least 6 characters'
    );
    await expect(page.locator('#email')).toHaveClass(/invalid/);
    await expect(page.locator('#password')).toHaveClass(/invalid/);
  });

  test('toggles password visibility with compact eye icon', async ({ page }) => {
    const passwordField = page.locator('#password');
    const toggleButton = page.locator('#toggle-password');

    await passwordField.fill('Secret123');
    await expect(passwordField).toHaveAttribute('type', 'password');

    await toggleButton.click();
    await expect(passwordField).toHaveAttribute('type', 'text');
    await expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    await toggleButton.click();
    await expect(passwordField).toHaveAttribute('type', 'password');
    await expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('accepts demo credentials and redirects to customer dashboard', async ({ page }) => {
    await page.fill('#email', 'kilonzojoseph8848@gmail.com');
    await page.fill('#password', '8848joseph');
    await page.click('#login-btn');

    await page.waitForURL('**/customer-dashboard.html');
    await expect(page).toHaveURL(/customer-dashboard\.html$/);
    await expect(page.locator('h1.welcome')).toContainText('Joseph Kilonzo');
  });
});
