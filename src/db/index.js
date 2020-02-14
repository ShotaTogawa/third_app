const mysql = require("mysql");
const keys = require("../../config/keys.js");

const con = mysql.createConnection({
  host: keys.mysqlHost,
  user: keys.mysqlUser,
  database: keys.mysqlDatabase,
  password: keys.mysqlPassword
});

module.exports = con;
