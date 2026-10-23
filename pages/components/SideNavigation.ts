import type { Locator, Page } from '@playwright/test';

export class SideNavigation {
  private readonly panel: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.locator('.oxd-sidepanel');
  }

  get logo(): Locator {
    return this.panel.locator('.oxd-brand-banner img');
  }

  menuItem(name: string): Locator {
    return this.panel.getByRole('link', { name, exact: true });
  }

  async openModule(name: string): Promise<void> {
    await this.menuItem(name).click();
  }

  async itemNames(): Promise<string[]> {
    const items = await this.panel.locator('.oxd-main-menu-item .oxd-text').allInnerTexts();
    return items.map((text) => text.trim()).filter(Boolean);
  }
}
