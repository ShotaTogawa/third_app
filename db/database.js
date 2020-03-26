const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });
require('dotenv').config({ path: 'variables.env.development' });
require('dotenv').config({ path: 'variables.env.test' });
const { DB_USERNAME, DB_NAME, DB_HOST, DB_PASSWORD, DB_DIARECT } = process.env;

module.exports = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIARECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
