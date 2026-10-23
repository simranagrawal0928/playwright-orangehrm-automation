import { test, expect } from '@fixtures/test';
import { strongPassword, uniqueUsername } from '@utils/data-factory';

test.describe('Admin - User management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.gotoList();
  });

  test('searching Admin shows the administrator account @smoke', async ({ adminPage }) => {
    await adminPage.searchByUsername('Admin');
    await expect(adminPage.table.rows).toHaveCount(1);
    const row = adminPage.table.rows.first();
    await expect(row).toContainText('Admin');
    await expect(row).toContainText('Enabled');
  });

  test('users table shows the expected columns', async ({ adminPage }) => {
    const headers = await adminPage.table.headerTexts();
    expect(headers).toEqual(
      expect.arrayContaining(['Username', 'User Role', 'Employee Name', 'Status']),
    );
  });

  test('filter by ESS role returns only ESS users', async ({ adminPage }) => {
    await adminPage.filterByRole('ESS');
    const count = await adminPage.table.stableRowCount();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(adminPage.table.rows.nth(i)).toContainText('ESS');
    }
  });

  test('filter by Disabled status returns only disabled users or none', async ({ adminPage }) => {
    await adminPage.filterByStatus('Disabled');
    const count = await adminPage.table.stableRowCount();
    if (count === 0) {
      await adminPage.table.expectNoRecords();
    } else {
      for (let i = 0; i < count; i++) {
        await expect(adminPage.table.rows.nth(i)).toContainText('Disabled');
      }
    }
  });

  test('add, search and delete a system user for an existing employee @smoke', async ({
    adminPage,
    pimPage,
  }) => {
    await pimPage.gotoList();
    const candidates = await pimPage.firstEmployeeNames(6);
    expect(candidates.length).toBeGreaterThan(0);
    const username = uniqueUsername('team', 'member');

    const employeeName = await adminPage.addUserForFirstAvailableEmployee(candidates, {
      role: 'ESS',
      status: 'Enabled',
      username,
      password: strongPassword(),
    });
    // The users table shows first and last name only, without the middle name.
    const nameParts = employeeName.split(' ');
    const shownName = `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;

    await adminPage.searchByUsername(username);
    await expect(adminPage.table.rows).toHaveCount(1);
    await expect(adminPage.table.rows.first()).toContainText(shownName);

    await adminPage.deleteUser(username);
    await adminPage.searchByUsername(username);
    await adminPage.table.expectNoRecords();
  });
});
