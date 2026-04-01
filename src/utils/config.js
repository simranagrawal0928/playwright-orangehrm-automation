require('dotenv').config();

const config = {
  baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
  timeout: parseInt(process.env.TIMEOUT) || 30000,

  credentials: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
};

module.exports = config;