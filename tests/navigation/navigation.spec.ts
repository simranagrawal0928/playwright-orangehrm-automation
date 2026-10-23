import { test, expect } from '@fixtures/test';

const MODULES: Array<{ menu: string; url: RegExp; heading: string }> = [
  { menu: 'Admin', url: /admin\/viewSystemUsers/, heading: 'System Users' },
  { menu: 'PIM', url: /pim\/viewEmployeeList/, heading: 'Employee Information' },
  { menu: 'Leave', url: /leave\/viewLeaveList/, heading: 'Leave List' },
  { menu: 'Time', url: /time\/viewEmployeeTimesheet/, heading: 'Select Employee' },
  { menu: 'Recruitment', url: /recruitment\/viewCandidates/, heading: 'Candidates' },
  { menu: 'Performance', url: /performance\//, heading: 'Performance' },
  { menu: 'Dashboard', url: /dashboard\/index/, heading: 'Dashboard' },
  { menu: 'Directory', url: /directory\/viewDirectory/, heading: 'Directory' },
  { menu: 'My Info', url: /pim\/view(PersonalDetails|MyDetails)/, heading: 'Personal Details' },
  { menu: 'Buzz', url: /buzz\//, heading: 'Buzz' },
];

test.describe('Side menu navigation', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  for (const { menu, url, heading } of MODULES) {
    test(`opens ${menu} @smoke`, async ({ sideNav, page }) => {
      await sideNav.openModule(menu);
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
    });
  }
});
