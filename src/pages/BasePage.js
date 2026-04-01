const config = require('../utils/config');

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(path = '') {
        const url = `${config.baseUrl}${path ? '/' + path : ''}`;
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        await this.page.waitForLoadState('networkidle');
    }

    async isLocatorVisible(locator, timeout = 10000) {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = BasePage;
