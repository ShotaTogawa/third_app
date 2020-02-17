const express = require("express");
const cors = require("cors");
const app = express();

const db = require("../db/database");

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log("Error: " + err));

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 4000, err => {
  if (err) {
    console.log(err);
  }
  console.log(`listening port ${process.env.PORT || 4000}`);
});
