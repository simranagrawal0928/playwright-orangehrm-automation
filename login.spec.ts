import { test, expect } from '@fixtures/test';
import { env } from '@utils/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials reach the dashboard @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.username, env.password);
    await expect(dashboardPage.heading).toBeVisible();
  });

  test('wrong password shows Invalid credentials', async ({ loginPage }) => {
    await loginPage.login(env.username, 'wrongpass123');
    await loginPage.expectInvalidCredentials();
  });

  test('unknown username shows Invalid credentials', async ({ loginPage }) => {
    await loginPage.login('not.a.real.user', env.password);
    await loginPage.expectInvalidCredentials();
  });

  test('empty username and password show Required on both fields', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(await loginPage.errorForField('Username')).toHaveText('Required');
    await expect(await loginPage.errorForField('Password')).toHaveText('Required');
  });

  test('empty password shows Required and stays on the login page', async ({ loginPage, page }) => {
    await loginPage.usernameInput.fill(env.username);
    await loginPage.loginButton.click();
    await expect(await loginPage.errorForField('Password')).toHaveText('Required');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('logout returns to the login page @smoke', async ({
    loginPage,
    dashboardPage,
    topHeader,
    page,
  }) => {
    await loginPage.login(env.username, env.password);
    await expect(dashboardPage.heading).toBeVisible();
    await topHeader.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/auth\/login/);
  });
});
