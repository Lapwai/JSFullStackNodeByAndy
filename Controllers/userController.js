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
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (err) {
      res.send(err);
    });
};
exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};
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
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest");
  }
};
