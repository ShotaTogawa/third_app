const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });
const {
  NODE_ENV,
  DEV_DB_USERNAME,
  DEV_DB_NAME,
  DEV_DB_HOST,
  DEV_DB_PASSWORD,
  DEV_DB_DIARECT,
  TEST_DB_USERNAME,
  TEST_DB_NAME,
  TEST_DB_HOST,
  TEST_DB_PASSWORD,
  TEST_DB_DIARECT,
  PROD_DB_USERNAME,
  PROD_DB_NAME,
  PROD_DB_HOST,
  PROD_DB_PASSWORD,
  PROD_DB_DIARECT
} = process.env;

if (NODE_ENV === 'test') {
  module.exports = new Sequelize(
    TEST_DB_NAME,
    TEST_DB_USERNAME,
    TEST_DB_PASSWORD,
    {
      host: TEST_DB_HOST,
      dialect: TEST_DB_DIARECT,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else if (NODE_ENV === 'production') {
  module.exports = new Sequelize(
    PROD_DB_NAME,
    PROD_DB_USERNAME,
    PROD_DB_PASSWORD,
    {
      host: PROD_DB_HOST,
      dialect: PROD_DB_DIARECT,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  module.exports = new Sequelize(
    DEV_DB_NAME,
    DEV_DB_USERNAME,
    DEV_DB_PASSWORD,
    {
      host: DEV_DB_HOST,
      dialect: DEV_DB_DIARECT,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// module.exports = db;

// module.exports = new Sequelize('myapp', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',

//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });
