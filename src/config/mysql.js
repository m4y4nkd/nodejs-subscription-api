const { createConnection } = require("mysql2");

const mysql = createConnection({
  host: "localhost",
  user: "mdwivedi",
  password: "password",
  database: "user-subscription",
});

mysql.connect(function (err) {
  if (err) console.error("Error while conneccting to DB: ", err);
  console.log("Connection to DB Successful!");
});

module.exports = mysql;
