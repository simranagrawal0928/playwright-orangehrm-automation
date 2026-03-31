const { expect } = require('@playwright/test');
const test = require('../fixtures/testFixtures');
const config = require('../../src/utils/config');

test.describe.serial('OrangeHRM Login Tests - Sequential in One Browser', () => {

  let page;
  let loginPage;
  let dashboardPage;

  test.beforeAll(async ({ browser, loginPageFixture, dashboardPageFixture }) => {
    page = await browser.newPage();
    loginPage = loginPageFixture(page);
    dashboardPage = dashboardPageFixture(page);
    await loginPage.navigateTo();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // TC01: Verify Login Page is Loaded
  test('TC01: Navigate to OrangeHRM Login Page', async () => {
    expect(page.url()).toContain('orangehrmlive.com');
  });

  // TC02: Invalid Credentials Shows Error
  test('TC02: Login with Invalid Credentials Shows Error', async () => {
    await loginPage.login('invalid_user', 'invalid_pass');

    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  // TC03: Successful Login
  test('TC03: Login with Valid Credentials', async () => {
    await loginPage.login(config.credentials.username, config.credentials.password);

    expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
    expect(await dashboardPage.isDashboardUrl()).toBeTruthy();
  });

  // TC04: Verify Dashboard is Still Loaded
  test('TC04: Verify Dashboard is Fully Loaded', async () => {
    expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
  });

  // TC05: Logout
  test('TC05: Logout from Dashboard', async () => {
    await dashboardPage.logout();
    expect(page.url()).toContain('login');
  });

});