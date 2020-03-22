const Sequelize = require('sequelize');

if (process.env.NODE_ENV === 'test') {
  module.exports = new Sequelize('circle_test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else if (process.env.NODE_ENV === 'production') {
  // production info
} else {
  module.exports = new Sequelize('myapp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
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
