import { expect, type Locator, type Page } from '@playwright/test';
import { Toast } from './components/Toast';

export abstract class BasePage {
  readonly toast: Toast;

  constructor(protected readonly page: Page) {
    this.toast = new Toast(page);
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /** The .oxd-input-group block whose label matches the given text exactly. */
  protected groupByLabel(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('.oxd-label', { hasText: exactText(label) }) })
      .first();
  }

  protected inputByLabel(label: string): Locator {
    return this.groupByLabel(label).locator('input').first();
  }

  protected async fillByLabel(label: string, value: string): Promise<void> {
    await this.inputByLabel(label).fill(value);
  }

  /** OrangeHRM dropdowns are div based, not native select elements. */
  protected async selectByLabel(label: string, option: string): Promise<void> {
    await this.groupByLabel(label).locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  protected async selectFirstOption(label: string): Promise<string> {
    await this.groupByLabel(label).locator('.oxd-select-text').click();
    const options = this.page.locator('.oxd-select-dropdown .oxd-select-option');
    await expect(options.first()).toBeVisible();
    const texts = (await options.allInnerTexts()).map((text) => text.trim()).filter(Boolean);
    const choice = texts.find((text) => text !== '-- Select --') ?? texts[0];
    await this.page.getByRole('option', { name: choice, exact: true }).click();
    return choice;
  }

  /**
   * Autocomplete fields search as you type. Queries with spaces match
   * nothing in OrangeHRM, so callers pass a single search token (for
   * example a last name) plus the full option text to pick.
   */
  protected async autocompleteByLabel(
    label: string,
    searchText: string,
    optionText: string,
  ): Promise<void> {
    const input = this.inputByLabel(label);
    await input.click();
    await input.pressSequentially(searchText, { delay: 40 });
    const dropdown = this.page.locator('.oxd-autocomplete-dropdown');
    const option = dropdown.getByText(optionText, { exact: false }).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  protected button(name: string | RegExp): Locator {
    return typeof name === 'string'
      ? this.page.getByRole('button', { name, exact: true })
      : this.page.getByRole('button', { name });
  }

  /** Reads the labels of the currently open OrangeHRM dropdown, if any. */
  protected async openSelectOptions(label: string): Promise<string[]> {
    await this.groupByLabel(label).locator('.oxd-select-text').click();
    const options = this.page.locator('.oxd-select-dropdown .oxd-select-option');
    await expect(options.first()).toBeVisible();
    const texts = (await options.allInnerTexts()).map((text) => text.trim()).filter(Boolean);
    await this.page.keyboard.press('Escape');
    return texts;
  }
}

function exactText(text: string): RegExp {
  return new RegExp(`^${text.replace(/[.*+?^${'{}'}()|[\]\\]/g, '\\$&')}$`);
}
