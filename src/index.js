const express = require("express");
const cors = require("cors");
const app = express();
const con = require("./db");

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 4000, err => {
  if (err) {
    console.log(err);
  }
  console.log("listening");
});
