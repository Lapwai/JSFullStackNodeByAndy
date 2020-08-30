## Impletement ejs

#### 1. the first "views" is the express option,

#### 2. the second "views" is the folder which contains the .ejs file we want to render

`app.set("views","views") `

#### 3. which templete system(view engine) we want to use

`app.set("view engine", "ejs");`

#### 4.put `res.render("<your ejs file name>")` in the router

#### 5. install ejs engine

run `npm install ejs in the terminal`

## Allow node engine to access static file

1. `app.use(express.static("public"));`

## Nodemon

1. `npm install nodemon`
2. go to "package.json" file and add one more script `"watch":"nodemon app.js"` right above the "test" script

## Setting up a router

1. In "app.js" - `const router = require("the router file url")`
2. In "router.js" -
   `const express = require("express")`
   `const router = express.Router()`

## Usage of module.exports

1. `module.exports` can export properties including object, function that we want to require and use it in the node server.
2. eg: `module.exports = {`
   `name: "andy",`
   `position: "developer",`
   `code: function(){`
   `console.log("I am coding")`
   `}`
   `}`

## Controller

1. In "router.js" -
   `const userController = require("./controller/userController.js")`
   `router.get("/home", userController.home)`
2. In "userController" -
   `exports.home = function (req, res) {`
   `res.render("home-guest");`
   `};`
