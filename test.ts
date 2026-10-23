import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PimPage } from '@pages/PimPage';
import { AdminPage } from '@pages/AdminPage';
import { LeavePage } from '@pages/LeavePage';
import { MyInfoPage } from '@pages/MyInfoPage';
import { DirectoryPage } from '@pages/DirectoryPage';
import { SideNavigation } from '@pages/components/SideNavigation';
import { TopHeader } from '@pages/components/TopHeader';

interface PageFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  adminPage: AdminPage;
  leavePage: LeavePage;
  myInfoPage: MyInfoPage;
  directoryPage: DirectoryPage;
  sideNav: SideNavigation;
  topHeader: TopHeader;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  pimPage: async ({ page }, use) => use(new PimPage(page)),
  adminPage: async ({ page }, use) => use(new AdminPage(page)),
  leavePage: async ({ page }, use) => use(new LeavePage(page)),
  myInfoPage: async ({ page }, use) => use(new MyInfoPage(page)),
  directoryPage: async ({ page }, use) => use(new DirectoryPage(page)),
  sideNav: async ({ page }, use) => use(new SideNavigation(page)),
  topHeader: async ({ page }, use) => use(new TopHeader(page)),
});

export { expect };
