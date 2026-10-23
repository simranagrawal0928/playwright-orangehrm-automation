import { test, expect } from '@fixtures/test';

const WIDGETS = [
  'Time at Work',
  'My Actions',
  'Quick Launch',
  'Buzz Latest Posts',
  'Employee Distribution by Sub Unit',
  'Employee Distribution by Location',
];

test.describe('Dashboard', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('all dashboard widgets and the logo are visible @smoke', async ({
    dashboardPage,
    sideNav,
  }) => {
    await expect(dashboardPage.heading).toBeVisible();
    for (const widget of WIDGETS) {
      await dashboardPage.expectWidgetVisible(widget);
    }
    await expect(sideNav.logo).toBeVisible();
  });

  test('Quick Launch Assign Leave opens the assign leave page', async ({ dashboardPage, page }) => {
    await dashboardPage.openQuickLaunch('Assign Leave');
    await expect(page).toHaveURL(/leave\/assignLeave/);
    await expect(page.getByRole('heading', { name: 'Assign Leave' })).toBeVisible();
  });

  test('Quick Launch Apply Leave opens the apply leave page', async ({ dashboardPage, page }) => {
    await dashboardPage.openQuickLaunch('Apply Leave');
    await expect(page).toHaveURL(/leave\/applyLeave/);
  });

  test('Quick Launch My Leave opens the my leave page', async ({ dashboardPage, page }) => {
    await dashboardPage.openQuickLaunch('My Leave');
    await expect(page).toHaveURL(/leave\/viewMyLeaveList/);
  });

  test('Quick Launch Timesheets opens the timesheets page', async ({ dashboardPage, page }) => {
    await dashboardPage.openQuickLaunch('Timesheets');
    await expect(page).toHaveURL(/time\/viewEmployeeTimesheet/);
  });

  test('user dropdown shows About and Logout', async ({ topHeader }) => {
    await topHeader.openUserMenu();
    await expect(topHeader.menuItem('About')).toBeVisible();
    await expect(topHeader.menuItem('Logout')).toBeVisible();
  });
});
