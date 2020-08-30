let express = require("express");

let app = express();
const router = require("./router");
//the first "views" is the express option,
//the second "views" is the folder which contains the .ejs file we want to render
app.set("views", "views");
//allow node engine to access the css file
app.use(express.static("public"));
//which templete system(view engine) we want to use
app.set("view engine", "ejs");
app.use("/", router);
app.use("/about", router);

app.listen(3000);
