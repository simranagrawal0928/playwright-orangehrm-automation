const { defineConfig, devices } = require('@playwright/test');
const config = require('./src/utils/config');

module.exports = defineConfig({
  testDir: './tests/ui',
  testMatch: '**/*.spec.js',

  timeout: config.timeout,
  expect: {
    timeout: 5000,
  },

  retries: process.env.CI ? 2 : 0,
  workers: 1,
  fullyParallel: false,

  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'],
  ],

  use: {
    baseURL: config.baseUrl,
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOWMO) || 0,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // To run on a specific browser: npx playwright test --project=chrome
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  globalTimeout: 30 * 60 * 1000,
});