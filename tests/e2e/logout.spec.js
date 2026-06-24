const { test, expect } = require('@playwright/test');

const logoutPath = '/logout.html';

test.describe('Logout landing page', () => {
  test('shows confirmation message and login link', async ({ page }) => {
    await page.goto(logoutPath);

    await expect(page.locator('h1', { hasText: 'Logged Out' })).toBeVisible();
    await expect(page.locator('.logout-card p')).toContainText(
      'You have been logged out successfully'
    );
    const loginLink = page.locator('a.login-link');
    await expect(loginLink).toHaveAttribute('href', 'login.html');
    await expect(loginLink).toHaveText(/Log In Again/i);
  });
});
