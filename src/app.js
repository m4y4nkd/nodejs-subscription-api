const express = require("express");
const api = require("./api");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () =>
  console.log(
    `Express server listening on port 3000, in ${app.get("env")} mode`
  )
);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Demo for REST APIs</title>
      </head>
      <body>
        <h1>Demo for REST APIs</h1>
      </body>
    </html>
  `);
});

app.use("/api", api);
