// 1. create packages track file - npm init -y
// 2. install express framework - npm inistall express
// 3. create git ignore file ".git ignore"
// 4. node theSimpleServer.js to run the server
let express = require("express");

let app = express();

app.get("/", function (req, res) {
  res.send("The Simplest Server is Running....");
});

app.listen(3000);
