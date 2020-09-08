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
"<Your mongodb connection string>";

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

## Hide cretential environment variables

1. Create ".env" in the root path
2. In ".env" - paste `CONNECTIONSTRING=<Your mongodb connection string>`
3. `npm install dotenv`
4. In "db.js",
   add -
   <pre><code>
   const dotenv = require("dotenv");
   dotenv.config()
   </pre></code>
   edit -
   <pre><code>
   mongodb.connect(
   env.process.CONNECTIONSTRING,
   ...
   );
   </pre></code>
5. Use the same way to hide the port number

## Read data from databse (User login function)

1. Add one more router url in "router.js" - `router.post("/login", userController.login)`
2. In "userController.js" -
<pre><code>
exports.login = function (req, res) {
  let user = new User(req.body);
  user.login();
};
</pre></code>
3. In "User.js" -
<pre><code>
User.prototype.login = function () {
  this.cleanUp();
  //look up data from the database
  userCollection.findOne({ username: this.data.username }, function (
    err,
    attemptedUser
  ) {
    //if the mongodb does find the matched user,
    //it will pass the document as the variable "attemptedUser" into the function

});
};

</pre></code>
** The Trap of "this" Keyword in Callback Function **
eg:
<pre><code>
User.prototype.login = function () {
  this.cleanUp();
  //look up data from the database
  userCollection.findOne({ username: this.data.username }, function (
    err,
    attemptedUser
  ) {
    //if the mongodb does find the matched user,
    //it will pass the document as the variable "attemptedUser" into the function
    if (attemptedUser && attemptedUser.password == this.data.password) {
        console.log("Congrats!!!");
    } else {
        console.log("invalid Username / Pssword");
    }
  });
};
</pre></code>
**<Chap. 53, 9:11 >The "this" keyword in `this.data.password` is not pointing to the object we are ready to call, in the case the "User" object will be called. The "findOne" function calls the callback function, so the "this" keyword is pointing to the golbal object**
<hr>

**Fix: change the normal JavasScript anonymous callback function to the arrow function**

<pre><code>
User.prototype.login = function () {
  this.cleanUp();
  //look up data from the database
  userCollection.findOne(
    { username: this.data.username },
    (err, attemptedUser) => {
      //if the mongodb does find the matched user,
      //it will pass the document as the variable "attemptedUser" into the function
      if (attemptedUser && attemptedUser.password == this.data.password) {
        console.log("Congrats!!!");
      } else {
        console.log("invalid Username / Pssword");
      }
    }
  );
};
</pre></code>

**<Chap. 53, 14:46>Callback Trap...to be continued**

## Promise(.all(), .race())

#### To be continued

## Hasing password

1. `npm install bcryptjs`
2. In "User.js" -
<pre><code>
User.prototype.register = function () {
  //1. validate username, email, password
  this.cleanUp();
  this.validate();
  //2. Only if there are no validation errors, then save the user data into a database
  if (!this.errors.length) {
    //hash user password
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    userCollection.insertOne(this.data);
  }
};
</pre></code>
3. In "User.js" -
<pre><code>
User.prototype.login = function (callback) {
  return new Promise((reslove, reject) => {
    this.cleanUp();
    //look up data from the database
    userCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          reslove("Congrats!!!");
        } else {
          reject("Invalid username / password");
        }
      })
      .catch(function () {
        reject("Please try again later");
      });
  });
};
</pre></code>

## Sessions (Store session data in memory)

#### How can we trust or identitfy requests?

1. `npm install express-session`
2. In "app.js" -
<pre><code>
const session = require("express-session");
let sessionOptions = session({
  secret: "I am andy",
  resave: false,
  saveUninitialized: false,
  cookie: {
    //how long the cookie for a session should be valid
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
});
app.use(sessionOptions);
</pre></code>
3. In "userController.js" -
<pre><code>
const User = require("../models/User");
exports.login = function (req, res) {
  console.log(req.body);

let user = new User(req.body);
user
.login()
.then(function (result) {
req.session.user = {
favColor: "lightpink",
username: user.data.username,
};
res.send(result);
})
.catch(function (err) {
res.send(err);
});
};
exports.logout = function () {};
exports.register = function (req, res) {
let user = new User(req.body);
user.register();
if (user.errors.length) {
res.send(user.errors);
} else {
res.send("Thanks for submitting");
}
};
exports.home = function (req, res) {
if (req.session.user) {
res.send("Welcome to the actual application!!!");
} else {
res.render("home-guest");
}
};

</pre></code>
## Tokens

## Sessions (Store session data in Mongodb)

1. `npm install connect-mongo`

2. In "app.js" -
`const MongoStore = require("connect-mongo")(session);`
<pre><code>
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
</pre></code>
3. In "db.js" -
<pre><code>
const dotenv = require("dotenv");
const mongodb = require("mongodb");
dotenv.config();
mongodb.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    //client.db() will return the exact database object we work in
    module.exports = client;
    const app = require("./app");
    app.listen(process.env.PORT);
  }
);

</pre></code>
3. In "User.js" - 
<pre><code>
const userCollection = require("../db").db().collection("users");
</pre></code>

## Use JavasScript script in HTML

1. using `<%%>` to run Javascript in HTML

2. using `<%=%>` to output Javascript in HTML

3. passing data

`{ username: req.session.user.username }`

<pre><code>
exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest");
  }
};
</pre></code>

## Letting using to logout (destroy session data in databse)

1. In "User.js" -
   `router.post("/logout", userController.logout);`
2. In "userController.js" -
<pre><code>
exports.logout = function (req, res) {
  //destroy method takes time, so we use callback
  req.session.destroy(function () {
    res.redirect("/");
  });
};
</pre></code>

<pre><code>
exports.login = function (req, res) {
  console.log(req.body);

  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = {
        favColor: "lightpink",
        username: user.data.username,
      };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (err) {
      res.send(err);
    });
};
</pre></code>
