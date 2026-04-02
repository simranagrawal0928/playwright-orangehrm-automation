const { test, expect } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const AdminPage = require('../../src/pages/AdminPage');
const config = require('../../src/utils/config');

test.describe.serial('OrangeHRM Admin Tests', () => {

    const newUsername = `testuser_${Date.now()}`;

    /** @type {import('@playwright/test').Page} */
    let page;
    /** @type {AdminPage} */
    let adminPage;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        const loginPage = new LoginPage(page);
        adminPage = new AdminPage(page);
        await loginPage.navigateTo();
        await loginPage.login(config.credentials.username, config.credentials.password);
        await page.waitForURL('**/dashboard/**');
        await adminPage.navigateToAdmin();
    });

    test.afterAll(async () => {
        await page.close();
    });

    // TC01: Verify navigation to Admin page and heading is displayed
    test('TC01: Verify Admin page is loaded with correct heading', async () => {
        expect(await adminPage.isAdminPage()).toBeTruthy();
        await expect(adminPage.pageHeading).toBeVisible();
    });

    // TC02: Add a new system user
    test('TC02: Add a new system user', async () => {
        const employeeName = await adminPage.getLoggedInEmployeeName();
        await adminPage.addUser({
            userRole: 'ESS',
            employeeName,
            username: newUsername,
            password: 'Test@1234',
        });
        expect(await adminPage.isAdminPage()).toBeTruthy();
    });

    // TC03: Search for the newly added user
    test('TC03: Search for the newly added user', async () => {
        await adminPage.searchByUsername(newUsername);
        const count = await adminPage.getUserCount();
        expect(count, `User "${newUsername}" should be found`).toBe(1);
    });

    // TC04: Delete the newly added user and verify it no longer exists
    test('TC04: Delete the newly added user', async () => {
        await adminPage.deleteUser(newUsername);
        await adminPage.searchByUsername(newUsername);
        const count = await adminPage.getUserCount();
        expect(count, `User "${newUsername}" should be deleted`).toBe(0);
    });

});