exports.viewCreateScreen = function (req, res) {
  res.render("create-post", {
    //I dont know here2
    user: req.session.user,

    username: req.session.user.username,
    avatar: req.session.user.avatar,
  });
};
