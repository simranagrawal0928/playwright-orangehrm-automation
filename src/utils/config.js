require('dotenv').config();

const config = {
  baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
  timeout: parseInt(process.env.TIMEOUT) || 30000,

  credentials: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : null,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    recipient: process.env.EMAIL_RECIPIENT,
  },

  paths: {
    screenshots: './reports/screenshots',
    reports: './reports',
  },
};

module.exports = config;