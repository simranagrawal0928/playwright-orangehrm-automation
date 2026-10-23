import { expect, type Locator, type Page } from '@playwright/test';

export class Toast {
  private readonly toast: Locator;

  constructor(page: Page) {
    this.toast = page.locator('.oxd-toast');
  }

  async expectSuccess(message = 'Successfully Saved'): Promise<void> {
    await expect(this.toast).toBeVisible();
    await expect(this.toast).toContainText('Success');
    await expect(this.toast).toContainText(message);
  }
}
