import { test, expect } from '@fixtures/test';
import { formatDate, futureWeekday } from '@utils/dates';

test.describe('Leave', () => {
  test('My Leave list shows the expected columns @smoke', async ({ leavePage }) => {
    await leavePage.gotoMyLeave();
    const headers = await leavePage.table.headerTexts();
    expect(headers).toEqual(
      expect.arrayContaining([
        'Date',
        'Employee Name',
        'Leave Type',
        'Leave Balance (Days)',
        'Number of Days',
        'Status',
        'Comments',
      ]),
    );
  });

  test('Apply Leave page renders for the logged in employee', async ({ leavePage }) => {
    await leavePage.gotoApply();
    // The shared demo flips the logged in employee between having a leave
    // balance (the form renders) and having none (an explanatory message).
    // Either rendered state is a pass at this level.
    await leavePage.applyPageState();
  });

  test('submitting the Apply form empty asks for a leave type', async ({ leavePage }) => {
    await leavePage.gotoApply();
    const state = await leavePage.applyPageState();
    test.skip(
      state === 'no-balance',
      'Apply form is not rendered while the demo employee has no leave balance',
    );
    await leavePage.submitEmptyApplyForm();
    await expect(leavePage.errorFor('Leave Type')).toContainText('Required');
  });

  test('apply for leave and see it pending in My Leave', async ({ leavePage }) => {
    await leavePage.gotoApply();
    const state = await leavePage.applyPageState();
    test.skip(
      state === 'no-balance',
      'No leave type with balance is available for the demo employee right now',
    );

    const pick = await leavePage.pickLeaveTypeWithBalance(2);
    test.skip(!pick, 'No leave type with at least 2 days of balance is available right now');
    const leaveType = (pick as { leaveType: string }).leaveType;

    const from = futureWeekday(7);
    const to = futureWeekday(8);
    await leavePage.applyForLeaveDates(formatDate(from), formatDate(to));
    await leavePage.expectApplySuccess();

    await leavePage.gotoMyLeave();
    await leavePage.expectPendingLeaveListed(leaveType);
  });
});
