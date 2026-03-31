const { test:base } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const DashboardPage = require('../../src/pages/DashboardPage');
const config = require('../../src/utils/config');

const test = base.extend({
  // Provide page objects to all tests
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // Auto-login fixture (for tests that need logged-in state)
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login(config.credentials.username, config.credentials.password);
    await use(page);
  },
});

module.exports = test;
