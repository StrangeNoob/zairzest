var express = require("express");
var router = express.Router();
const api = require('./api');

/* GET home page. */
router.get("/", function (req, res, next) {
  let loggedIn = false;
    if(req.isAuthenticated)
        loggedIn = true;    

  res.render("pages/index", { loggedIn });
});

router.get("/auth", function (req, res, next) {
    res.render("pages/auth",);
});

router.get("/forgot", function (req, res, next) {
    res.render("pages/forgot_password", );
});

router.get("/newpassword", function (req, res, next) {
    res.render("pages/newPassword",);
});

router.get("/profile", function (req, res, next) {
    user = req.user;
    console.log(user);
    res.render("pages/profile", {user},);
});

router.use(api);

module.exports = router;
