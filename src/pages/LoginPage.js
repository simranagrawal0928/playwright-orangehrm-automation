const BasePage = require('./BasePage');

class LoginPage extends BasePage {

    constructor(page) {
        super(page);
    }

    usernameInput = 'input[name="username"]';
    passwordInput = 'input[name="password"]';
    loginButton = 'button[type="submit"]';
    // Error message locator - OrangeHRM uses oxd-alert for error messages
    errorMessage = '.oxd-alert-content';

    async login(username, password) {
        try {
            console.log('Starting login process...');

            // Wait for page to be fully loaded
            await this.page.waitForLoadState('domcontentloaded');
            console.log('Page loaded: domcontentloaded');

            // Wait extra time for OrangeHRM to fully render
            await this.page.waitForTimeout(1000);

            // Fill username using locator().fill()
            console.log(`Filling username: ${username}`);
            await this.page.locator(this.usernameInput).fill(username);
            console.log('Username filled');

            // Fill password using locator().fill()
            console.log('Filling password...');
            await this.page.locator(this.passwordInput).fill(password);
            console.log('Password filled');

            // Click login button using locator().click()
            console.log('Clicking login button...');
            await this.page.locator(this.loginButton).click();
            console.log('Login button clicked');

            // Wait for navigation to complete
            console.log('Waiting for page navigation...');
            await this.page.waitForLoadState('networkidle', { timeout: 30000 });
            console.log('Page navigation complete');

            // Small delay for stability
            await this.page.waitForTimeout(500);

            console.log('Login completed successfully!');

        } catch (error) {
            console.error('Login failed:', error.message);
            console.error('Current URL:', this.page.url());

            // Take screenshot for debugging
            try {
                await this.page.screenshot({ path: 'login-error-screenshot.png' });
                console.error('Error screenshot saved: login-error-screenshot.png');
            } catch (screenError) {
                console.error('Could not take screenshot:', screenError.message);
            }

            throw error;
        }
    }

    async isErrorDisplayed() {
        try {
            return await this.isVisible(this.errorMessage);
        } catch (error) {
            console.error('Error checking for error message:', error.message);
            return false;
        }
    }

    async getErrorMessage() {
        try {
            return await this.getText(this.errorMessage);
        } catch (error) {
            console.error('Error retrieving error message:', error.message);
            return null;
        }
    }

}

module.exports = LoginPage;