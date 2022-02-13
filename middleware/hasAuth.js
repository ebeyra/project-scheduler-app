// Admin priviledges
const isAdmin = (req, res, next) => {
  if (!req.session.user.admin) {
    return res.redirect("/access-denied");
  }
  req.user = req.session.user;
  next();
};

// Manager priviledges
const isEditor = (req, res, next) => {
  if (!req.session.user.editor) {
    return res.redirect("/access-denied");
  }
  req.user = req.session.user;
  next();
};

module.exports = { isAdmin, isEditor };
