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
