# Playwright OrangeHRM Automation

[![Playwright Tests](https://github.com/simranagrawal0928/playwright-orangehrm-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/simranagrawal0928/playwright-orangehrm-automation/actions/workflows/playwright.yml)

An end-to-end test automation framework for the [OrangeHRM](https://opensource-demo.orangehrmlive.com) public demo application, built with Playwright and TypeScript. It covers the core HR workflows (login, dashboard, employee management in PIM, system users in Admin, leave, personal info and the employee directory) with a page object architecture that is easy to extend to new modules.

The suite runs against the shared public demo, so every test creates the data it needs and cleans up after itself where the application allows it. No test depends on records created by another test.

## Tech stack

- Playwright Test (latest stable) with TypeScript in strict mode
- Node.js 20+
- Faker for realistic, unique test data
- ESLint (flat config) and Prettier for code quality and formatting
- GitHub Actions for CI

## Framework layout

```
.
├── .github/workflows/     CI pipeline (Playwright Tests)
├── fixtures/
│   └── test.ts            Custom test with typed page object fixtures
├── pages/
│   ├── BasePage.ts        Shared helpers for OrangeHRM form controls
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── PimPage.ts         Employee list, add/edit employee, personal details
│   ├── AdminPage.ts       System user management
│   ├── LeavePage.ts       Apply leave and My Leave
│   ├── MyInfoPage.ts      Personal and contact details of the logged in user
│   ├── DirectoryPage.ts   Employee directory
│   └── components/        Reusable building blocks (side navigation,
│                          top header, toast messages, data tables)
├── test-data/
│   └── test-data.json     Static data sets for data-driven tests
├── tests/
│   ├── setup/             Authentication setup (storage state)
│   ├── auth/              Login and protected route tests (no session)
│   ├── dashboard/
│   ├── pim/
│   ├── admin/
│   ├── leave/
│   ├── my-info/
│   ├── directory/
│   └── navigation/
└── utils/
    ├── constants.ts       Shared paths (auth state file)
    ├── data-factory.ts    Faker based generators (employees, usernames, passwords)
    ├── dates.ts           Date helpers for OrangeHRM date fields
    └── env.ts             Environment configuration
```

## Design decisions

**Authentication with storage state.** A dedicated `setup` project logs in through the UI once and saves the session to `playwright/.auth/user.json`. The browser projects depend on it and reuse that state, which keeps the suite fast and avoids repeating the login in every test. Login tests themselves run in a separate `no-auth` project that never receives the stored state, so both authenticated and unauthenticated behavior are covered.

**Page objects with a shared base.** OrangeHRM forms are built from custom controls (div based dropdowns, autocomplete fields, grouped label and input pairs), not native HTML form elements. `BasePage` wraps those patterns once: filling a field by its label, choosing a dropdown option, completing an autocomplete, reading toast notifications. Individual page objects stay small and read like the workflow they model.

**Fixtures over setup code.** Tests receive page objects through typed fixtures (`fixtures/test.ts`), so a spec declares what it needs and never wires up page objects by hand.

**Locators a user would recognize.** Tests locate elements by role, label, placeholder and text wherever the UI allows it. CSS selectors are used only for OrangeHRM layout classes that have no accessible hook, for example toast messages and table rows.

**Data that cannot collide.** Employee names, usernames and credentials are generated per test with Faker, and usernames carry a random suffix. Tests run in parallel against one shared demo instance, so uniqueness is what makes them independent. Employee ids are also assigned by the tests themselves: the demo pre-fills the next free number, which two parallel creations can both read before either saves. Data-driven cases that do not need uniqueness live in `test-data/test-data.json`.

**Web-first assertions.** Assertions use Playwright's auto-waiting expect API. There are no hard sleeps anywhere in the suite.

## Test coverage

| Area       | What is covered                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth       | Valid login, invalid password, unknown user, required field validation, logout, protected URLs redirecting to login                            |
| Dashboard  | All widget headings, Quick Launch shortcuts, user menu contents                                                                                |
| PIM        | Add employee, search by name and by employee id, edit personal details, add employee with login details, delete employee, data-driven creation |
| Admin      | Search users, table columns, filter by role and by status, full add, search and delete flow for a system user                                  |
| Leave      | My Leave table structure, Apply Leave page rendering, empty submit validation, applying for leave and verifying it in My Leave                 |
| My Info    | Updating contact details and verifying the values persist                                                                                      |
| Directory  | Page load, searching an employee, resetting the search                                                                                         |
| Navigation | Every side menu module opens its landing page                                                                                                  |

A note on Leave: the shared demo rotates the data of the logged in employee, so their leave balance changes from run to run. When the user has no leave balance, the Apply Leave page shows a "No Leave Types with Leave Balance" message instead of the form, and the suite asserts that state. When a leave type with balance is available, the suite also covers submitting the form empty (the leave type is required) and applying for leave, then verifying the request sits in My Leave as pending. The balance dependent tests skip with a clear reason when the demo currently offers no balance.

## Getting started

```bash
git clone https://github.com/simranagrawal0928/playwright-orangehrm-automation.git
cd playwright-orangehrm-automation
npm install
npx playwright install
cp .env.example .env
```

The `.env` file is optional. Without it the suite uses the public demo URL and the public demo credentials, which are also the values in `.env.example`:

| Variable             | Default                                     |
| -------------------- | ------------------------------------------- |
| `BASE_URL`           | `https://opensource-demo.orangehrmlive.com` |
| `ORANGEHRM_USERNAME` | `Admin`                                     |
| `ORANGEHRM_PASSWORD` | `admin123`                                  |

## Running the tests

```bash
npm test                                   # full suite, all projects
npx playwright test --project=chromium     # one browser
npx playwright test --project=no-auth      # login tests only
npm run test:headed                        # watch the browser
npm run test:ui                            # interactive UI mode
npm run test:debug                         # step through with the inspector
npx playwright test tests/pim              # a single folder
npx playwright test --grep @smoke          # by tag
npm run report                             # open the last HTML report
```

The `mobile-chrome` project (Pixel 7) runs the dashboard, Leave and My Info specs as the mobile check. On small viewports OrangeHRM switches its list screens to a card layout, hides the side menu behind a hamburger button and collapses the list filters, so the Admin, PIM, Directory and navigation suites run on the desktop projects only.

Other checks:

```bash
npm run typecheck
npm run lint
npm run format
```

## Reports and CI

Every run produces an HTML report in `playwright-report/` and keeps traces, screenshots and videos for failed tests in `test-results/`.

The GitHub Actions workflow **Playwright Tests** runs on every push and pull request to `main` (and on demand from the Actions tab). It installs dependencies and browsers, runs the full suite, and uploads the HTML report and test results as artifacts. On CI the suite retries failed tests twice and writes a JUnit report alongside the HTML one.

## Notes on the demo environment

The OrangeHRM demo is shared by everyone and resets periodically. Seeded data can change between resets, so the suite only relies on stable surface behavior (headings, columns, validation messages, the seeded `Admin` account) and creates everything else itself. If a run leaves data behind after a failure, it is harmless: generated names and usernames are unique, so later runs are unaffected.
