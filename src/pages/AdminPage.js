const BasePage = require('./BasePage');

class AdminPage extends BasePage {

    constructor(page) {
        super(page);

        // Page heading
        this.pageHeading = page.locator('h6:has-text("Admin")');

        // Logged-in user employee name (top bar)
        this.loggedInUserName = page.locator('.oxd-userdropdown-tab p');

        // System Users table — data rows only (excludes header row which has columnheaders)
        this.tableRows = page.getByRole('row').filter({ has: page.getByRole('cell') });

        // Search form
        this.searchUsernameInput = page.locator('.oxd-form input').first();
        this.searchButton        = page.locator('button[type="submit"]');

        // Add User button
        this.addUserButton = page.locator('button:has-text("Add")');

        // Add User form
        this.userRoleDropdown        = page.locator('.oxd-select-text').first();
        this.statusDropdown          = page.locator('.oxd-select-text').nth(1);
        this.employeeNameInput       = page.locator('input[placeholder="Type for hints..."]');
        this.autocompleteFirstOption     = page.locator('.oxd-autocomplete-option').first();
        this.autocompleteSearchingOption = page.locator('.oxd-autocomplete-option:has-text("Searching")');
        this.usernameFormInput       = page.locator('input[autocomplete="off"]:not([type="password"])');
        this.passwordInput           = page.locator('input[type="password"]').nth(0);
        this.confirmPasswordInput    = page.locator('input[type="password"]').nth(1);
        this.saveButton              = page.locator('button[type="submit"]');

        // Delete confirmation
        this.deleteConfirmButton = page.locator('button:has-text("Yes, Delete")');
    }

    async navigateToAdmin() {
        await this.navigateTo('web/index.php/admin/viewAdminModule');
        await this.pageHeading.waitFor({ state: 'visible' });
    }

    async isAdminPage() {
        return this.page.url().includes('admin') && await this.isLocatorVisible(this.pageHeading);
    }

    async getLoggedInEmployeeName() {
        return (await this.loggedInUserName.textContent()).trim();
    }

    async searchByUsername(username) {
        await this.searchUsernameInput.fill(username);
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getUserCount() {
        return await this.tableRows.count();
    }

    async addUser({ userRole, employeeName, status = 'Enabled', username, password }) {
        await this.addUserButton.click();
        await this.page.waitForLoadState('networkidle');

        // Select User Role
        await this.userRoleDropdown.click();
        await this.page.locator(`.oxd-select-option:has-text("${userRole}")`).click();

        // Type Employee Name and pick first autocomplete suggestion
        await this.employeeNameInput.click();
        await this.employeeNameInput.pressSequentially(employeeName, { delay: 100 });
        await this.autocompleteFirstOption.waitFor({ state: 'visible' });
        await this.autocompleteSearchingOption.waitFor({ state: 'hidden' });
        await this.autocompleteFirstOption.click();

        // Select Status
        await this.statusDropdown.click();
        await this.page.locator(`.oxd-select-option:has-text("${status}")`).click();

        // Fill Username
        await this.usernameFormInput.fill(username);

        // Fill Password and Confirm Password
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);

        await this.saveButton.click();
        await this.page.waitForURL('**/viewSystemUsers**');
        await this.pageHeading.waitFor({ state: 'visible' });
    }

    async deleteUser(username) {
        await this.searchByUsername(username);
        await this.tableRows.first().getByRole('cell').last().getByRole('button').first().click();
        await this.deleteConfirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = AdminPage;