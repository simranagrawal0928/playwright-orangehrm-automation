import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Table } from './components/Table';

export class LeavePage extends BasePage {
  readonly table = new Table(this.page);

  async gotoMyLeave(): Promise<void> {
    await super.goto('/web/index.php/leave/viewMyLeaveList');
    await expect(this.page.getByText('My Leave List')).toBeVisible();
  }

  async gotoApply(): Promise<void> {
    await super.goto('/web/index.php/leave/applyLeave');
    await expect(this.page.getByRole('heading', { name: 'Apply Leave' })).toBeVisible();
    // The form shows a loader overlay while its data loads; it intercepts
    // clicks until it clears.
    await expect(this.page.locator('.oxd-form-loader')).toBeHidden({ timeout: 30_000 });
  }

  /** Shown when the logged in employee has no leave balance on the demo. */
  get noLeaveTypesMessage(): Locator {
    return this.page.getByText('No Leave Types with Leave Balance');
  }

  /**
   * The shared demo flips between two states for the logged in employee:
   * no leave balance (message only) or a leave type with balance (the form).
   * Waits for one of the two to render and reports which.
   */
  async applyPageState(): Promise<'form' | 'no-balance'> {
    const typeSelect = this.groupByLabel('Leave Type').locator('.oxd-select-text');
    let state: 'form' | 'no-balance' = 'no-balance';
    await expect
      .poll(
        async () => {
          if (await this.noLeaveTypesMessage.isVisible()) {
            state = 'no-balance';
            return true;
          }
          if (await typeSelect.isVisible()) {
            state = 'form';
            return true;
          }
          return false;
        },
        { timeout: 15_000 },
      )
      .toBe(true);
    return state;
  }

  async leaveTypeOptions(): Promise<string[]> {
    return this.openSelectOptions('Leave Type');
  }

  /** Numeric balance from the caption shown for the selected type, e.g. "20.00 Day(s)". */
  private async balanceValue(): Promise<number> {
    const caption = this.page.getByText(/Day\(s\)/).first();
    const text = await caption.innerText().catch(() => '');
    return Number(text.match(/(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  }

  /**
   * Works through the offered leave types and keeps the first one whose
   * balance covers minDays. The demo seeds types with different balances
   * (including zero), so the first option is not always usable.
   * Returns the chosen type, or null when nothing qualifies.
   */
  async pickLeaveTypeWithBalance(
    minDays: number,
  ): Promise<{ leaveType: string; balance: number } | null> {
    const select = this.groupByLabel('Leave Type').locator('.oxd-select-text');
    await select.click();
    const options = this.page.locator('.oxd-select-dropdown [role="option"]');
    await expect(options.first()).toBeVisible();
    const types = (await options.allInnerTexts())
      .map((text) => text.trim())
      .filter((text) => text && text !== '-- Select --');

    for (const type of types) {
      if (
        !(await options
          .first()
          .isVisible()
          .catch(() => false))
      ) {
        await select.click();
        await expect(options.first()).toBeVisible();
      }
      await options.filter({ hasText: type }).first().click();
      // The balance caption refreshes from the server after each selection.
      await expect
        .poll(async () => (await this.balanceValue()) > 0, { timeout: 6_000 })
        .toBe(true)
        .catch(() => undefined);
      const balance = await this.balanceValue();
      if (balance >= minDays) return { leaveType: type, balance };
    }
    return null;
  }

  async submitEmptyApplyForm(): Promise<void> {
    await this.button('Apply').click();
  }

  errorFor(label: string): Locator {
    return this.groupByLabel(label).locator('.oxd-input-field-error-message');
  }

  async selectLeaveType(leaveType: string): Promise<void> {
    await this.selectByLabel('Leave Type', leaveType);
  }

  async applyForLeaveDates(fromDate: string, toDate: string): Promise<void> {
    await this.fillByLabel('From Date', fromDate);
    await expect(this.inputByLabel('From Date')).toHaveValue(fromDate);
    await this.fillByLabel('To Date', toDate);
    await expect(this.inputByLabel('To Date')).toHaveValue(toDate);
    await this.page.keyboard.press('Escape');
    await this.button('Apply').click();
  }

  async applyForLeave(leaveType: string, fromDate: string, toDate: string): Promise<void> {
    await this.selectLeaveType(leaveType);
    await this.applyForLeaveDates(fromDate, toDate);
  }

  async expectPendingLeaveListed(leaveType: string): Promise<void> {
    const row = this.table.rowWithText(leaveType).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText('Pending');
  }

  async expectApplySuccess(): Promise<void> {
    await this.toast.expectSuccess('Successfully Saved');
  }
}
