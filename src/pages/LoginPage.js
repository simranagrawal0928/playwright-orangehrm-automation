const BasePage = require('./BasePage');

class LoginPage extends BasePage {

    constructor(page) {
        super(page);

        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton   = page.locator('button[type="submit"]');
        this.errorMessage  = page.locator('.oxd-alert-content');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async isErrorDisplayed() {
        return await this.isLocatorVisible(this.errorMessage, 5000);
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

}

module.exports = LoginPage;