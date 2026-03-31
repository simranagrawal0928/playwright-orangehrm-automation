const { defineConfig, devices } = require('@playwright/test');
const config = require('./src/utils/config');

module.exports = defineConfig({
  // Test directory
  testDir: './tests/ui',
  testMatch: '**/*.spec.js',

  // Timeouts
  timeout: config.timeout,
  expect: {
    timeout: 5000,
  },

  // Retry failed tests
  retries: process.env.CI ? 2 : 0, // Retry 2 times in CI, 0 locally

  // Parallel execution workers
  workers: 1, // Run tests sequentially in ONE browser

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'], // Console output
  ],

  // Shared browser launch settings
  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    slowMo: config.slowMo,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // WebServer (optional - for local testing)
  // webServer: {
  //   command: 'npm run dev',
  //   port: 3000,
  // },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Global timeout
  globalTimeout: 30 * 60 * 1000, // 30 minutes
});
