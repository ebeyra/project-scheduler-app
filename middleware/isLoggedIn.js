const isLoggedIn = (req, res, next) => {
    if (!req.session?.user?.username) {
      return res.redirect("/not-logged-in");
    }
    req.user = req.session.user.username;
    next();
  };

  module.exports = isLoggedIn;