import { expect, type Locator, type Page } from '@playwright/test';

export class TopHeader {
  private readonly dropdownTab: Locator;
  private readonly menu: Locator;

  constructor(private readonly page: Page) {
    this.dropdownTab = page.locator('.oxd-userdropdown-tab');
    this.menu = page.locator('.oxd-dropdown-menu');
  }

  async userName(): Promise<string> {
    return (await this.page.locator('.oxd-userdropdown-name').innerText()).trim();
  }

  async openUserMenu(): Promise<void> {
    await this.dropdownTab.click();
    await expect(this.menu).toBeVisible();
  }

  menuItem(name: string): Locator {
    return this.menu.getByText(name, { exact: true });
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.menuItem('Logout').click();
  }
}
