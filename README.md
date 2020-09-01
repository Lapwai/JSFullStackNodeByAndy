## Impletement ejs engine

1. In "app.js" -
<pre><code>
//the first "views" is the express option,
//the second "views" is the folder which contains the .ejs file we want to render
app.set("views","views");
//which templete system(view engine) we want to use
app.set("view engine", "ejs");
</pre></code>

2. Put `res.render("<your ejs file name>")` in the router

3. Install ejs engine - `npm install ejs`

4. Allow node engine to access static file -
   eg: let html page access css file
   - Create "public" folder under the root path
   * Create "main.css" file under "public" folder
   - Place `<link rel="stylesheet" href="main.css">` in the html page
   * Place `app.use(express.static("public"));` in "app.js" file

## Nodemon

1. `npm install nodemon`
2. Go to "package.json" file and add one more script `"watch":"nodemon app.js"` right above the "test" script

## Two most common ways of submitting data on the web

#### Add submit data on to our request object, so we can access data from req.body-

1. `app.use(express.urlencoded({ extended: false }));`- traditional html form submit
2. `app.use(express.json());`- sending over a bit json data

## Setting up a router

1. In "app.js" -
<pre><code>
const router = require("the router file url");
app.use("/", router);
</pre></code>
2. In "router.js" -
<pre><code>
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  res.render("home-guest");
});
module.exports = router;
</pre></code>

## Usage of module.exports

1. `module.exports` can export properties including object, function that we want to require and use it in the node server.
2. eg:
<pre><code>
module.exports = {
   name: "andy",
   position: "developer",
   code: function(){
   console.log("I am coding")
   }
}
</pre></code>

## Controller

1. Create "Controllers" folder under the root path
2. Create "userController.js" under "Controller" folder
3. In "router.js" -
<pre><code>
const userController = require("./controller/userController.js");
router.get("/home", userController.home);
</pre></code>
4. In "userController.js" -
<pre><code>
exports.home = function (req, res) {
   res.render("home-guest");
};
</pre></code>

## Validate data

#### When the user click the "register" button, we need to validate their input. "Username" should be in alphanumeric, "Email" should require a validated email address.

#### In "home-gest.ejs" we have a form for user to register their account, when the user click the "register" button, the broswer will send a POST request to the server.

<form action="/register" method="POST" id="registration-form">
<input type="text" name="username"/>
<input type="text" name="email"/>
<input type="password" name="password"/>
</form>

1. Construct a model that reflects the "user" in this case.

- Create "User.js/models"
<pre><code>
let User = function (data) {
  this.data = data;
  //errors array is to store the errors
  this.errors = [];
};
exports.moduel = User;

</pre></code>

2. We define the "validate" and "register" method with JavaScript prototype property
<pre><code>
User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("Please enter an provide a username");
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers");
  }
  //isEmail method is from validator package
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("Please enter an provide a valid email");
  }
  if (this.data.password == "") {
    this.errors.push("Please enter an provide a password");
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters");
  }
  if (this.data.password.length > 100) {
    this.errors.push("Password can not exceed 100 characters");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters");
  }
  if (this.data.username.length > 30) {
    this.errors.push("Username can not exceed 30 characters");
  }
};
User.prototype.register = function () {
  //1. validate username, email, password
  this.validate();
  //2. Only if there are no validation errors, then save the user data into a database
};
</pre></code>
3. Install validator package - `npm install validator`
   In "User.js" - `const validator = require("validator");`
4. In "router.js" - `router.post("/register", userController.register)`
5. In "userController.js" -
<pre><code>
let User = require("../models/user");
exports.register = function (req, res) {
   let user = new User(req.body);
   user.register();
      if (user.errors.length) {
         res.send(user.errors);
            } else {
         res.send("Thanks for submitting");
      }
};
</pre></code>

## Avoid user send other than string via the register form

1. In "User.js", add `this.cleanUp()` to register function
2. cleanUp function
<pre><code>
if (typeof this.data.username != "string") {
    //aviod user sending non string value to the database
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }
  //get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
</pre></code>

## Save user data into a database

1. Create "db.js" in the root path
2. `npm install mongodb`
3. In "db.js" -
<pre><code>
const mongodb = require("mongodb");

const connectionString =
"mongodb+srv://abc:abc@cluster0-luxcw.azure.mongodb.net/JSFullStackNodeByAndy?retryWrites=true&w=majority";

mongodb.connect(
connectionString,
{ useNewUrlParser: true, useUnifiedTopology: true },
function (err, client) {
//client.db() will return the exact database object we work in
module.exports = client.db();
const app = require("./app");
app.listen(3000);
}
);

</pre></code>
4. In "app.js" - replace `app.listen(3000);` to `module.exports = app;`
5. In "package.json" - change `"watch": "nodemon app.js"` to `"watch": "nodemon db.js"`
6. In "User.js" - add `const userCollection = require("../db").collection("users");` to the top of the script
7. In "User.js", change the register function to - 
<pre><code>
User.prototype.register = function () {
  //1. validate username, email, password
  this.cleanUp();
  this.validate();
  //2. Only if there are no validation errors, then save the user data into a database
  if (!this.errors.length) {
    userCollection.insertOne(this.data);
  }
};
</pre></code>
