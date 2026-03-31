const config = require('../utils/config');

class BasePage {
    constructor(page) {
        this.page = page;
        this.timeout = config.timeout;
    }

    // Common method to navigate to a specific URL
    async navigateTo(path = '') {
        const url = `${config.baseUrl}${path ? '/' + path : ''}`;
        console.log(`Navigating to: ${url}`);

        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            console.log('Page loaded: domcontentloaded');

            // Wait for network to be idle
            await this.page.waitForLoadState('networkidle', { timeout: 30000 });
            console.log('Page fully loaded: networkidle');

            // Small delay for stability
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.error('Navigation failed:', error.message);
            throw error;
        }
    }

    // Fill input field using modern locator API
    async fillInput(selector, value) {
        await this.page.locator(selector).fill(value);
    }

    // Click an element using modern locator API
    async click(selector) {
        await this.page.locator(selector).click();
    }

    // Get text content of an element using modern locator API
    async getText(selector) {
        return await this.page.locator(selector).textContent();
    }

    // Wait for an element to be visible using modern locator API
    async waitForElement(selector) {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout: this.timeout });
    }

    // Check if an element is visible using modern locator API
    async isVisible(selector) {
        try {
            await this.page.locator(selector).waitFor({ state: 'visible', timeout: this.timeout });
            return true;
        } catch (error) {
            return false;
        }
    }

    // Take a screenshot
    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}_${timestamp}.png`;
        await this.page.screenshot({ path: `${config.paths.screenshots}/${filename}` });
        return filename;
    }

    // Wait for navigation after an action
    async waitForNavigation() {
        await this.page.waitForNavigation({ waitUntil: 'networkidle' });
    }
}

module.exports = BasePage;