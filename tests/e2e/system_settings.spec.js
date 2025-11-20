const { test, expect } = require('@playwright/test');

const settingsPath = '/system_settings.html';

test.describe('System settings workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__dialogs = { alerts: [], confirms: [], prompts: [] };
      window.alert = message => {
        window.__dialogs.alerts.push(message);
      };
      window.confirm = message => {
        window.__dialogs.confirms.push(message);
        return true;
      };
      window.prompt = (message, defaultValue) => {
        window.__dialogs.prompts.push({ message, defaultValue });
        return 'RESET';
      };
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
    const beforeAlerts = await page.evaluate(() => window.__dialogs.alerts.length);
    await form.locator('button', { hasText: 'Change Password' }).click();
    await page.waitForFunction(prev => window.__dialogs.alerts.length > prev, beforeAlerts);
    const lastAlert = await page.evaluate(() => {
      const alerts = window.__dialogs.alerts;
      return alerts.length ? alerts[alerts.length - 1] : '';
    });
    expect(lastAlert).toContain('do not match');
  });

  test('initiates database backup and observes success alert', async ({ page }) => {
    const backupButton = page.locator('button', { hasText: 'Backup Database' });
    const [initialConfirmCount, initialAlertCount] = await page.evaluate(() => [
      window.__dialogs.confirms.length,
      window.__dialogs.alerts.length,
    ]);

    await backupButton.click();

    const dialogState = await page.evaluate(({ prevConfirm, prevAlert }) => {
      return new Promise(resolve => {
        const check = () => {
          const state = {
            confirms: window.__dialogs.confirms,
            alerts: window.__dialogs.alerts,
          };
          if (state.confirms.length > prevConfirm && state.alerts.length > prevAlert) {
            resolve(state);
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });
    }, { prevConfirm: initialConfirmCount, prevAlert: initialAlertCount });

    expect(dialogState.confirms[dialogState.confirms.length - 1]).toContain('backup the database');
    expect(dialogState.alerts[dialogState.alerts.length - 1]).toContain('backup initiated');

    await page.waitForFunction(prev => window.__dialogs.alerts.length > prev && window.__dialogs.alerts[window.__dialogs.alerts.length - 1].includes('backup completed'), dialogState.alerts.length);
    const latestAlert = await page.evaluate(() => {
      const alerts = window.__dialogs.alerts;
      return alerts.length ? alerts[alerts.length - 1] : '';
    });
    expect(latestAlert).toContain('backup completed');
  });
});
