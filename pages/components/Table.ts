import { expect, type Locator, type Page } from '@playwright/test';

/** Shared wrapper around the div based tables used by PIM, Admin and Leave. */
export class Table {
  private readonly table: Locator;

  constructor(page: Page) {
    this.table = page.locator('.oxd-table');
  }

  get rows(): Locator {
    return this.table.locator('.oxd-table-body .oxd-table-card');
  }

  /** Header texts including the empty checkbox column, for index based lookups. */
  async rawHeaderTexts(): Promise<string[]> {
    const headers = await this.table.locator('.oxd-table-header-cell').allInnerTexts();
    return headers.map((text) => text.trim());
  }

  async headerTexts(): Promise<string[]> {
    await expect(this.table.locator('.oxd-table-header-cell').first()).toBeVisible();
    const headers = await this.table.locator('.oxd-table-header-cell').allInnerTexts();
    return headers.map((text) => text.trim()).filter(Boolean);
  }

  /** The empty state text renders twice in the DOM, so check each copy. */
  private async noRecordsVisible(): Promise<boolean> {
    const matches = this.table.page().getByText('No Records Found');
    for (let i = 0; i < (await matches.count()); i++) {
      if (await matches.nth(i).isVisible()) return true;
    }
    return false;
  }

  /** Waits until the table has finished loading rows (or reports none). */
  async waitForSettled(): Promise<void> {
    await expect
      .poll(
        async () => {
          if ((await this.rows.count()) > 0) return true;
          return this.noRecordsVisible();
        },
        { timeout: 20_000 },
      )
      .toBe(true);
  }

  /** Row count, polled until it stops changing between reads. */
  async stableRowCount(): Promise<number> {
    let last = -1;
    await expect
      .poll(
        async () => {
          const current = await this.rows.count();
          const stable = current === last && current >= 0;
          last = current;
          return stable;
        },
        { intervals: [300, 500, 800], timeout: 15_000 },
      )
      .toBe(true);
    return last;
  }

  /**
   * Cell text in these tables is separated by newlines in innerText, and
   * the text matching normalizes those away entirely, so a plain substring
   * with spaces never matches across cells. Join the words with optional
   * whitespace instead.
   */
  rowWithText(text: string): Locator {
    const pattern = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'));
    return this.rows.filter({ hasText: pattern });
  }

  async cellTexts(row: Locator): Promise<string[]> {
    const cells = await row.locator('.oxd-table-cell').allInnerTexts();
    return cells.map((text) => text.trim());
  }

  async expectNoRecords(): Promise<void> {
    await expect.poll(() => this.noRecordsVisible(), { timeout: 10_000 }).toBe(true);
  }
}
