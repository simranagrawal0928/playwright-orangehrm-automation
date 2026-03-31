require('dotenv').config();

const config = {
  // Browser & URL
  baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrm.com',
  browser: process.env.BROWSER || 'chromium',
  browserChannel: process.env.BROWSER_CHANNEL || null,
  headless: process.env.HEADLESS === 'true',
  slowMo: parseInt(process.env.SLOWMO) || 0,
  timeout: parseInt(process.env.TIMEOUT) || 30000,

  // Credentials
  credentials: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    recipient: process.env.EMAIL_RECIPIENT,
  },

  // Paths
  paths: {
    screenshots: './reports/screenshots',
    reports: './reports',
  },
};

module.exports = config;
