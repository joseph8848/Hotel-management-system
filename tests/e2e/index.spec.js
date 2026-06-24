const { test, expect } = require('@playwright/test');

test.describe('Landing Page Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('footer links navigate to the correct static pages', async ({ page }) => {
    // Check Services Link (Room Service)
    const servicesLink = page.locator('footer a', { hasText: /^Room Service$/ });
    await expect(servicesLink).toHaveAttribute('href', 'services.html');

    // Check Contact Link
    const contactLink = page.locator('footer a', { hasText: 'Contact Us' });
    await expect(contactLink).toHaveAttribute('href', 'contact.html');

    // Check FAQ Link
    const faqLink = page.locator('footer a', { hasText: /^FAQ$/ });
    await expect(faqLink).toHaveAttribute('href', 'faq.html');

    // Check Terms Link
    const termsLink = page.locator('footer a', { hasText: 'Terms of Service' });
    await expect(termsLink).toHaveAttribute('href', 'terms.html');
  });

  test('navigation takes user to services page', async ({ page }) => {
    // Click services link and verify landing
    await page.locator('footer a', { hasText: /^Room Service$/ }).click();
    await expect(page).toHaveURL(/.*services\.html$/);
    await expect(page.locator('h1')).toContainText('Premium Services');
  });
});
