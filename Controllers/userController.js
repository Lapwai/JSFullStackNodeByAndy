const User = require("../models/User");

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "You must be logged in to perform that action");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.login = function (req, res) {
  console.log(req.body);

  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
      };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (e) {
      req.flash("errors", e);
      //req.session.flash.errors=[e]
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};
exports.register = function (req, res) {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username, avatar: user.avatar };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error);
      });
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", {
      //I dont know here
      user: req.session.user,

      username: req.session.user.username,
      avatar: req.session.user.avatar,
    });
  } else {
    res.render("home-guest", {
      user: req.session.user,

      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
