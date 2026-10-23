import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { AUTH_FILE } from './utils/constants';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com';
const isCI = !!process.env.CI;

// Specs under tests/auth run without a saved session, everything else
// (except the setup project) reuses the storage state from the setup run.
const authenticatedIgnore = ['**/auth/**', '**/setup/**'];

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : '50%',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(isCI ? [['junit', { outputFile: 'test-results/junit.xml' }] as const] : []),
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: authenticatedIgnore,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: authenticatedIgnore,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: authenticatedIgnore,
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      // On small viewports OrangeHRM trades the data tables for a card
      // layout, moves the side menu behind a hamburger button and collapses
      // the list filters, so the Admin, PIM, Directory and navigation
      // suites (plus one table header check) are covered on the desktop
      // projects instead of here.
      testIgnore: [
        ...authenticatedIgnore,
        '**/admin/**',
        '**/directory/**',
        '**/navigation/**',
        '**/pim/**',
      ],
      grepInvert: /My Leave list shows the expected columns/,
    },
    {
      name: 'no-auth',
      testMatch: '**/auth/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
