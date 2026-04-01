const { test, expect } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const DashboardPage = require('../../src/pages/DashboardPage');
const config = require('../../src/utils/config');

test.describe.serial('OrangeHRM Dashboard Tests', () => {

    /** @type {import('@playwright/test').Page} */
    let page;
    /** @type {DashboardPage} */
    let dashboardPage;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        const loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigateTo();
        await loginPage.login(config.credentials.username, config.credentials.password);
        await dashboardPage.dashboardHeading.waitFor({ state: 'visible' });
    });

    test.afterAll(async () => {
        await page.close();
    });

    // TC01: Verify OrangeHRM logo is displayed
    test('TC01: Verify OrangeHRM logo is displayed', async () => {
        expect(await dashboardPage.isLogoDisplayed()).toBeTruthy();
    });

    // TC02: Verify all dashboard widgets are displayed
    test('TC02: Verify all dashboard widgets are displayed', async () => {
        await expect(dashboardPage.widgetTimeAtWork).toBeVisible();
        await expect(dashboardPage.widgetMyActions).toBeVisible();
        await expect(dashboardPage.widgetQuickLaunch).toBeVisible();
        await expect(dashboardPage.widgetBuzzLatestPosts).toBeVisible();
        await expect(dashboardPage.widgetEmployeesByUnit).toBeVisible();
        await expect(dashboardPage.widgetEmployeesByLoc).toBeVisible();
    });

});