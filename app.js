let express = require("express");

let app = express();
//the first "views" is the express option,
//the second "views" is the folder which contains the .ejs file we want to render
app.set("views", "views");

//which templete system(view engine) we want to use
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.send("The Simplest Server is Running....");
});

app.listen(3000);
