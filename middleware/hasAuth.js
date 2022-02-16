// Admin priviledges
const isAdmin = (req, res, next) => {
  if (req.session.user.privilege !== "Admin") {
    return res.redirect("/access-denied");
  }
  req.user = req.session.user;
  next();
};

// Manager priviledges
const isEditor = (req, res, next) => {
  if (req.session.user.privilege !== "Editor") {
    return res.redirect("/access-denied");
  }
  req.user = req.session.user;
  next();
};

const isEmployee = (req, res, next) => {
  if (req.session.user.privilege === "None") {
    return res.render("employee/employee-profile");
  }
  req.user = req.session.user;
  next();
};

module.exports = { isAdmin, isEditor, isEmployee };
