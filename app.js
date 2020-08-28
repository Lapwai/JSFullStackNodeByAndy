let express = require("express");

let app = express();
//the first "views" is the express option,
//the second "views" is the folder which contains the .ejs file we want to render
app.set("views", "views");
//allow node engin to access the css file
app.use(express.static("public"));
//which templete system(view engine) we want to use
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  //render ejs templete
  res.render("home-guest");
});

app.listen(3000);
