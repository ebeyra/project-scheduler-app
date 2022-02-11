const isLoggedIn = (req, res, next) => {
    // checks if the user is logged in when trying to access a specific page
    if (!req.session?.user?.username) {
      return res.redirect("/not-logged-in");
    }
    req.user = req.session.user.username;
    next();
  };

  module.exports = isLoggedIn;