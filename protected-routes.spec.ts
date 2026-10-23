import { test, expect } from '@fixtures/test';

test.describe('Protected routes', () => {
  test('dashboard URL redirects to login when logged out', async ({ page, loginPage }) => {
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('employee list URL redirects to login when logged out', async ({ page, loginPage }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
