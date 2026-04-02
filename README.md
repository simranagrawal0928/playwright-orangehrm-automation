# OrangeHRM Playwright Automation Framework

End-to-end test automation framework for [OrangeHRM](https://opensource-demo.orangehrmlive.com) built with Playwright and JavaScript, following the Page Object Model design pattern.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| JavaScript (Node.js) | Language |
| Page Object Model | Design pattern |
| dotenv | Environment variable management |

---

## Framework Structure

```
PlaywrightProject/
├── src/
│   ├── pages/
│   │   ├── BasePage.js          # Shared base class (navigateTo, isLocatorVisible)
│   │   ├── LoginPage.js         # Login page actions and locators
│   │   ├── DashboardPage.js     # Dashboard page actions and locators
│   │   └── AdminPage.js         # Admin page actions and locators
│   └── utils/
│       └── config.js            # Centralised config (baseUrl, credentials, timeout)
├── tests/
│   └── ui/
│       ├── login.spec.js        # Login test suite
│       ├── dashboard.spec.js    # Dashboard test suite
│       └── admin.spec.js        # Admin test suite
├── reports/                     # Generated test reports (HTML, JSON, JUnit)
├── .env                         # Environment variables (not committed)
└── playwright.config.js         # Playwright configuration
```

---

## Test Suites

| Suite | Coverage |
|---|---|
| `login.spec.js` | Navigation, valid/invalid credentials, logout |
| `dashboard.spec.js` | Logo visibility, dashboard widget presence |
| `admin.spec.js` | Add, search, and delete a system user |

---

## Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <your-repo-url>
cd PlaywrightProject
npm install
npx playwright install
```

### Environment Variables

Create a `.env` file in the project root:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
USERNAME=Admin
PASSWORD=admin123
TIMEOUT=30000
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run on a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run in headed mode
npm run test:headed

# Run a specific spec file
npx playwright test tests/ui/login.spec.js
npx playwright test tests/ui/dashboard.spec.js
npx playwright test tests/ui/admin.spec.js
```

---

## Reports

HTML, JSON and JUnit reports are generated in the `reports/` folder after every run.

```bash
npx playwright show-report reports/html
```