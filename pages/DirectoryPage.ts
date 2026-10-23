import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { EmployeeData } from '@utils/data-factory';
import { displayName } from '@utils/data-factory';

export class DirectoryPage extends BasePage {
  async goto(): Promise<void> {
    await super.goto('/web/index.php/directory/viewDirectory');
    await expect(this.page.getByRole('heading', { name: 'Directory' }).first()).toBeVisible();
  }

  get nameInput(): Locator {
    return this.inputByLabel('Employee Name');
  }

  async searchByName(employee: EmployeeData): Promise<void> {
    await this.autocompleteByLabel('Employee Name', employee.lastName, displayName(employee));
    await this.button('Search').click();
  }

  async reset(): Promise<void> {
    await this.button('Reset').click();
  }

  resultCard(employee: EmployeeData): Locator {
    return this.page
      .locator('.orangehrm-directory-card')
      .filter({ hasText: employee.firstName })
      .filter({ hasText: employee.lastName });
  }

  async expectResultVisible(employee: EmployeeData): Promise<void> {
    await expect(this.resultCard(employee).first()).toBeVisible();
  }
}
