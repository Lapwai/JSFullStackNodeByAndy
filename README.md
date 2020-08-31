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

1. In "router.js" -
<pre><code>
const userController = require("./controller/userController.js");
router.get("/home", userController.home);
</pre></code>
2. In "userController.js" -
<pre><code>
exports.home = function (req, res) {
   res.render("home-guest");
};
</pre></code>

## Validate data

#### When the user click the "register" button, we need to validate their input. "Username" should be in alphanumeric, "Email" should require a validated email address.

#### In "home-gest.ejs" we have a form for user to register their account, when the user click the "register" button, the broswer will send a POST request to the server.

`<form action="/register" method="POST" id="registration-form">`
`</form>`

1. Construct a model that reflects the "user" in this case.
<pre><code>
let User = function (data) {
  this.data = data;
  this.errors = [];
};
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
