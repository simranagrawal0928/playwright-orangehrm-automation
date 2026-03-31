const { expect, test, chromium, firefox, webkit } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const DashboardPage = require('../../src/pages/DashboardPage');
const config = require('../../src/utils/config');

const browserTypes = { chromium, firefox, webkit };

test.describe.serial('OrangeHRM Login Tests - Sequential in One Browser', () => {

  let browser;
  let page;
  let loginPage;
  let dashboardPage;

  test.beforeAll(async () => {
    const browserType = browserTypes[config.browser] || chromium;
    const launchOptions = { headless: config.headless, slowMo: config.slowMo };
    if (config.browserChannel) launchOptions.channel = config.browserChannel;
    browser = await browserType.launch(launchOptions);
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.navigateTo();
    console.log(`Browser opened (${config.browser}) and navigated to login page`);
  });

  test.afterAll(async () => {
    await browser.close();
  }, 60000);

  // TC01: Verify Login Page Loaded
  test('TC01: Navigate to OrangeHRM Login Page', async () => {
    const currentUrl = page.url();
    expect(currentUrl).toContain('orangehrmlive.com');
    console.log('TC01: Navigated to login page');
  });

  // TC02: Successful Login
  test('TC02: Login with Valid Credentials', async () => {
    await loginPage.login(config.credentials.username, config.credentials.password);

    const isDashboardLoaded = await dashboardPage.isDashboardDisplayed();
    expect(isDashboardLoaded).toBeTruthy();

    const isDashboardUrl = await dashboardPage.isDashboardUrl();
    expect(isDashboardUrl).toBeTruthy();

    console.log('TC02: Login successful - Dashboard loaded');
  });

  // TC03: Verify Dashboard Elements
  test('TC03: Verify Dashboard is Fully Loaded', async () => {
    const isDashboardLoaded = await dashboardPage.isDashboardDisplayed();
    expect(isDashboardLoaded).toBeTruthy();
    console.log('TC03: Dashboard elements verified');
  });

  // TC04: Logout
  test('TC04: Logout from Dashboard', async () => {
    await dashboardPage.logout();
    console.log('TC04: Logged out successfully');
  });

});