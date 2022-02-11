const isAdmin = (req, res, next) => {
  if (!req.session.user.admin) {
    return res.redirect("/");
  }
  req.user = req.session.user;
  next();
};

const isEditor = (req, res, next) => {
  if (!req.session.user.editor) {
    return res.redirect("/");
  }
  req.user = req.session.user;
  next();
};

module.exports = { isAdmin, isEditor };
