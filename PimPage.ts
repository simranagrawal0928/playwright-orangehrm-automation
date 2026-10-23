import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Table } from './components/Table';
import type { EmployeeData } from '@utils/data-factory';
import { displayName, uniqueEmployeeId } from '@utils/data-factory';

export interface NewEmployee extends EmployeeData {
  employeeId: string;
}

export class PimPage extends BasePage {
  readonly table = new Table(this.page);

  async gotoList(): Promise<void> {
    await super.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.page.getByText('Employee Information')).toBeVisible();
    await this.table.waitForSettled();
  }

  async gotoAdd(): Promise<void> {
    await super.goto('/web/index.php/pim/addEmployee');
    await expect(this.page.getByPlaceholder('First Name')).toBeVisible();
  }

  async searchByName(employee: EmployeeData): Promise<void> {
    await this.autocompleteByLabel('Employee Name', employee.lastName, displayName(employee));
    await this.button('Search').click();
    await this.table.waitForSettled();
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.fillByLabel('Employee Id', employeeId);
    await this.button('Search').click();
    await this.table.waitForSettled();
  }

  /** Types a name without picking an autocomplete suggestion (for names that no longer exist). */
  async searchByTypedName(name: string): Promise<void> {
    await this.inputByLabel('Employee Name').fill(name);
    await this.button('Search').click();
    await this.table.waitForSettled();
  }

  async resetSearch(): Promise<void> {
    await this.button('Reset').click();
    await this.table.waitForSettled();
  }

  /**
   * Adds an employee and lands on their personal details page.
   * Returns the record including the employee id that was assigned.
   */
  async addEmployee(
    employee: EmployeeData,
    login?: { username: string; password: string },
  ): Promise<NewEmployee> {
    await this.gotoAdd();
    await this.page.getByPlaceholder('First Name').fill(employee.firstName);
    await this.page.getByPlaceholder('Middle Name').fill(employee.middleName);
    await this.page.getByPlaceholder('Last Name').fill(employee.lastName);
    await this.fillByLabel('Employee Id', uniqueEmployeeId());

    if (login) {
      await this.page.locator('.oxd-switch-input').click();
      await this.fillByLabel('Username', login.username);
      await this.fillByLabel('Password', login.password);
      await this.fillByLabel('Confirm Password', login.password);
    }

    await this.button('Save').click();
    await this.toast.expectSuccess('Successfully Saved');
    await expect(this.page).toHaveURL(/viewPersonalDetails/);

    // The details form fills in from a follow-up request; wait until it has
    // loaded the new record before reading or editing any of its fields.
    const nameInputs = this.groupByLabel('Employee Full Name').locator('input');
    await expect.poll(() => nameInputs.nth(0).inputValue()).toBe(employee.firstName);
    const employeeId = await this.inputByLabel('Employee Id').inputValue();
    return { ...employee, employeeId };
  }

  get personalDetailsHeading(): Locator {
    return this.page.locator('.orangehrm-edit-employee-name h6');
  }

  async setDriversLicense(value: string): Promise<void> {
    await this.fillByLabel("Driver's License Number", value);
  }

  async driversLicenseValue(): Promise<string> {
    return this.inputByLabel("Driver's License Number").inputValue();
  }

  async savePersonalDetails(): Promise<void> {
    const form = this.page
      .locator('form')
      .filter({ has: this.inputByLabel("Driver's License Number") });
    await form.getByRole('button', { name: 'Save', exact: true }).click();
    await this.toast.expectSuccess('Successfully Updated');
  }

  async deleteEmployee(employee: EmployeeData): Promise<void> {
    await this.searchByName(employee);
    const row = this.table.rowWithText(displayName(employee)).first();
    await expect(row).toBeVisible();
    await row.locator('button:has(i.bi-trash)').click();
    await this.button(/Yes, Delete/).click();
    await this.toast.expectSuccess('Successfully Deleted');
  }

  async expectEmployeeListed(employee: NewEmployee): Promise<void> {
    const row = this.table.rowWithText(displayName(employee)).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(employee.employeeId);
  }

  /** Full names of the first employees in the list, in row order. */
  async firstEmployeeNames(limit: number): Promise<string[]> {
    const headers = await this.table.rawHeaderTexts();
    const firstIdx = headers.indexOf('First (& Middle) Name');
    const lastIdx = headers.indexOf('Last Name');
    const names: string[] = [];
    const count = Math.min(await this.table.rows.count(), limit);
    for (let i = 0; i < count; i++) {
      const cells = await this.table.cellTexts(this.table.rows.nth(i));
      names.push(`${cells[firstIdx]} ${cells[lastIdx]}`.replace(/\s+/g, ' ').trim());
    }
    return names;
  }
}
