// @ts-nocheck
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: {
    command: 'npx http-server -p 4173 -c-1 .',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
