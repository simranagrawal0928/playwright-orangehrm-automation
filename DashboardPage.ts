import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  async goto(): Promise<void> {
    await super.goto('/web/index.php/dashboard/index');
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Dashboard' });
  }

  widgetTitle(name: string): Locator {
    return this.page.locator('.orangehrm-dashboard-widget-name', { hasText: name });
  }

  async expectWidgetVisible(name: string): Promise<void> {
    await expect(this.widgetTitle(name).first()).toBeVisible();
  }

  quickLaunchButton(title: string): Locator {
    return this.page.locator(`button[title="${title}"]`);
  }

  async openQuickLaunch(title: string): Promise<void> {
    await this.quickLaunchButton(title).click();
  }
}
