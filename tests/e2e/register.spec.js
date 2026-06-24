const { test, expect } = require('@playwright/test');

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register.html');
  });

  test('renders registration form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Create Account');
    await expect(page.locator('form#register-form')).toBeVisible();
    await expect(page.locator('input[name="fullname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('shows error on mismatched passwords', async ({ page }) => {
    // Fill out form
    await page.locator('input[name="fullname"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('input[name="phone"]').fill('1234567890');
    await page.locator('input[name="password"]').fill('Password123');
    await page.locator('input[name="confirm_password"]').fill('Password321');
    
    await page.locator('button#register-btn').click();
    
    // Verify mismatch error text
    const errorSpan = page.locator('#confirm-password-error');
    await expect(errorSpan).toBeVisible();
    await expect(errorSpan).toContainText('Passwords do not match');
    await expect(page.locator('input[name="confirm_password"]')).toHaveClass(/invalid/);
  });

  test('submits successfully when passwords match', async ({ page }) => {
    await page.locator('input[name="fullname"]').fill('Jane Doe');
    await page.locator('input[name="email"]').fill('jane@example.com');
    await page.locator('input[name="phone"]').fill('0987654321');
    await page.locator('input[name="password"]').fill('MatchPass123!');
    await page.locator('input[name="confirm_password"]').fill('MatchPass123!');
    
    await page.locator('button#register-btn').click();
    
    // Assert success toast appears
    const toast = page.locator('.toast.alert-success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Registration successful');
  });
});
