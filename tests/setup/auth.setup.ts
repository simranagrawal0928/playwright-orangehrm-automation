import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { env } from '@utils/env';
import { AUTH_FILE } from '@utils/constants';

// Logs in once through the UI; every authenticated project reuses the
// saved storage state instead of repeating the login in each test.
setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, env.password);
  await expect(page).toHaveURL(/dashboard\/index/);
  await page.context().storageState({ path: AUTH_FILE });
});
