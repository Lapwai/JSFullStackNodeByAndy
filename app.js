let express = require("express");

let app = express();
const router = require("./router");
//Add submit data on to our request object, so we can access data from req.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
