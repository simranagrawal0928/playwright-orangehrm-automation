import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TopHeader } from './components/TopHeader';

export class MyInfoPage extends BasePage {
  readonly header = new TopHeader(this.page);

  async goto(): Promise<void> {
    await super.goto('/web/index.php/pim/viewMyDetails');
    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
  }

  /** Full name of the logged in user's employee record, e.g. for Admin user creation. */
  async employeeFullName(): Promise<string> {
    const nameInputs = this.groupByLabel('Employee Full Name').locator('input');
    await expect.poll(() => nameInputs.nth(0).inputValue()).not.toBe('');
    const first = await nameInputs.nth(0).inputValue();
    const last = await nameInputs.nth(2).inputValue();
    return `${first} ${last}`.trim();
  }

  async setContactDetail(label: string, value: string): Promise<void> {
    await this.fillByLabel(label, value);
  }

  /** Contact details live on their own view, linked from the My Info side menu. */
  async gotoContactDetails(): Promise<void> {
    // The form is populated by a follow-up request; filling fields before it
    // lands would be overwritten, so wait for that response first.
    const dataLoaded = this.page.waitForResponse(
      (response) =>
        response.url().includes('/contact-details') && response.request().method() === 'GET',
      { timeout: 20_000 },
    );
    await this.page.getByRole('link', { name: 'Contact Details' }).click();
    await expect(this.page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await dataLoaded.catch(() => undefined);
  }

  async contactDetailValue(label: string): Promise<string> {
    return this.inputByLabel(label).inputValue();
  }

  async saveContactDetails(): Promise<void> {
    const form = this.page.locator('form').filter({ has: this.inputByLabel('Street 1') });
    await form.getByRole('button', { name: 'Save', exact: true }).click();
    await this.toast.expectSuccess('Successfully Updated');
  }
}
