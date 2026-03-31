const { test: base } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const DashboardPage = require('../../src/pages/DashboardPage');
const config = require('../../src/utils/config');

const test = base.extend({

  // Factory fixtures — return a function so tests can pass a shared page
  loginPageFixture: async ({}, use) => {
    await use((page) => new LoginPage(page));
  },

  dashboardPageFixture: async ({}, use) => {
    await use((page) => new DashboardPage(page));
  },

  // Per-test page object fixtures (for non-serial tests)
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Authenticated fixture — navigates and logs in before the test
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.navigateTo();
    await loginPage.login(config.credentials.username, config.credentials.password);
    await use(dashboardPage);
  },

});

module.exports = test;