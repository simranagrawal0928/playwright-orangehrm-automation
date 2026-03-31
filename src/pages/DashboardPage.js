const BasePage = require('./BasePage');

class DashboardPage extends BasePage {

    constructor(page) {
        super(page);
    }

    dashboardHeading = 'h6:has-text("Dashboard")';
    userDropdown = '.oxd-userdropdown-tab';
    logoutButton = 'a:has-text("Logout")';

    // Verify dashboard heading is visible using modern locator API
    async isDashboardDisplayed() {
        try {
            console.log('⏳ Waiting for dashboard heading...');
            await this.page.locator(this.dashboardHeading).waitFor({ state: 'visible', timeout: 10000 });
            const isVisible = await this.page.locator(this.dashboardHeading).isVisible();
            console.log('Dashboard heading is visible');
            return isVisible;
        } catch (error) {
            console.error('Dashboard failed to load:', error.message);
            return false;
        }
    }

    // Verify page URL is dashboard
    async isDashboardUrl() {
        const url = this.page.url();
        console.log(`Current URL: ${url}`);
        return url.includes('dashboard');
    }

    // Logout using modern locator API
    async logout() {
        try {
            console.log('Clicking user dropdown...');
            await this.page.locator(this.userDropdown).click();

            console.log('Clicking logout button...');
            await this.page.locator(this.logoutButton).waitFor({ state: 'visible' });
            await this.page.locator(this.logoutButton).click();

            console.log('Waiting for navigation...');
            await this.page.waitForLoadState('networkidle');

            console.log('Logout completed');
        } catch (error) {
            console.error('Logout failed:', error.message);
            throw error;
        }
    }
}

module.exports = DashboardPage;