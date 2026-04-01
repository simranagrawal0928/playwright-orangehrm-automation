const BasePage = require('./BasePage');

class DashboardPage extends BasePage {

    constructor(page) {
        super(page);

        // Header
        this.logo             = page.locator('.oxd-brand-banner');
        this.userDropdown     = page.locator('.oxd-userdropdown-tab');
        this.logoutButton     = page.locator('a:has-text("Logout")');

        // Dashboard heading
        this.dashboardHeading = page.locator('h6:has-text("Dashboard")');

        // Widget headings
        this.widgetTimeAtWork      = page.locator('p', { hasText: 'Time at Work' });
        this.widgetMyActions       = page.locator('p', { hasText: 'My Actions' });
        this.widgetQuickLaunch     = page.locator('p', { hasText: 'Quick Launch' });
        this.widgetBuzzLatestPosts = page.locator('p', { hasText: 'Buzz Latest Posts' });
        this.widgetEmployeesByUnit = page.locator('p', { hasText: 'Employee Distribution by Sub Unit' });
        this.widgetEmployeesByLoc  = page.locator('p', { hasText: 'Employee Distribution by Location' });
    }

    async isDashboardDisplayed() {
        return await this.isLocatorVisible(this.dashboardHeading);
    }

    async isDashboardUrl() {
        return this.page.url().includes('dashboard');
    }

    async isLogoDisplayed() {
        return await this.logo.isVisible();
    }

    async logout() {
        await this.userDropdown.click();
        await this.logoutButton.waitFor({ state: 'visible' });
        await this.logoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = DashboardPage;
