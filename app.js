let express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
let app = express();

let sessionOptions = session({
  secret: "I am andy",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());
const router = require("./router");
const { Mongos } = require("mongodb");
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
module.exports = app;
