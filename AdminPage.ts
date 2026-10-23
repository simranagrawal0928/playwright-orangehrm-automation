import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Table } from './components/Table';

export interface NewSystemUser {
  employeeName: string;
  role: 'Admin' | 'ESS';
  status: 'Enabled' | 'Disabled';
  username: string;
  password: string;
}

export class AdminPage extends BasePage {
  readonly table = new Table(this.page);

  async gotoList(): Promise<void> {
    await super.goto('/web/index.php/admin/viewSystemUsers');
    await expect(this.page.getByText('System Users')).toBeVisible();
    await this.table.waitForSettled();
  }

  async gotoAdd(): Promise<void> {
    await super.goto('/web/index.php/admin/saveSystemUser');
    await expect(this.page.getByText('Add User')).toBeVisible();
  }

  async searchByUsername(username: string): Promise<void> {
    await this.fillByLabel('Username', username);
    await this.button('Search').click();
    await this.table.waitForSettled();
  }

  async filterByRole(role: 'Admin' | 'ESS'): Promise<void> {
    await this.selectByLabel('User Role', role);
    await this.button('Search').click();
    await this.table.waitForSettled();
  }

  async filterByStatus(status: 'Enabled' | 'Disabled'): Promise<void> {
    await this.selectByLabel('Status', status);
    await this.button('Search').click();
    await this.table.waitForSettled();
  }

  async resetSearch(): Promise<void> {
    await this.button('Reset').click();
    await this.table.waitForSettled();
  }

  async addUser(user: NewSystemUser): Promise<void> {
    await this.gotoAdd();
    await this.selectByLabel('User Role', user.role);
    await this.autocompleteByLabel(
      'Employee Name',
      user.employeeName.split(' ').at(-1) ?? user.employeeName,
      user.employeeName,
    );
    await this.selectByLabel('Status', user.status);
    await this.fillByLabel('Username', user.username);
    await this.fillByLabel('Password', user.password);
    await this.fillByLabel('Confirm Password', user.password);
    await this.button('Save').click();
    await this.toast.expectSuccess('Successfully Saved');
    await expect(this.page).toHaveURL(/viewSystemUsers/);
  }

  async deleteUser(username: string): Promise<void> {
    await this.searchByUsername(username);
    const row = this.table.rowWithText(username).first();
    await expect(row).toBeVisible();
    await row.locator('button:has(i.bi-trash)').click();
    await this.button(/Yes, Delete/).click();
    await this.toast.expectSuccess('Successfully Deleted');
  }

  /**
   * Adds a user for the first candidate employee the form accepts.
   * The employee picker only offers employees who have no account yet,
   * so callers pass several names and the first selectable one wins.
   * Returns the employee name that was used.
   */
  async addUserForFirstAvailableEmployee(
    candidates: string[],
    user: Omit<NewSystemUser, 'employeeName'>,
  ): Promise<string> {
    await this.gotoAdd();
    await this.selectByLabel('User Role', user.role);

    const input = this.inputByLabel('Employee Name');
    let chosen = '';
    for (const candidate of candidates) {
      const token = candidate.split(' ').at(-1) ?? candidate;
      await input.fill('');
      await input.pressSequentially(token, { delay: 40 });
      const dropdown = this.page.locator('.oxd-autocomplete-dropdown');
      const option = dropdown.getByText(candidate, { exact: true });
      const selectable = await option
        .first()
        .waitFor({ state: 'visible', timeout: 5_000 })
        .then(() => true)
        .catch(() => false);
      if (selectable) {
        await option.first().click();
        chosen = candidate;
        break;
      }
      await this.page.keyboard.press('Escape');
    }
    if (!chosen) {
      throw new Error(
        `None of the candidate employees could be selected: ${candidates.join(', ')}`,
      );
    }

    await this.selectByLabel('Status', user.status);
    await this.fillByLabel('Username', user.username);
    await this.fillByLabel('Password', user.password);
    await this.fillByLabel('Confirm Password', user.password);
    await this.button('Save').click();
    await this.toast.expectSuccess('Successfully Saved');
    await expect(this.page).toHaveURL(/viewSystemUsers/);
    return chosen;
  }
}
