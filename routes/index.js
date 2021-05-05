var express = require("express");
var router = express.Router();
const api = require('./api');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/index", { loggedIn: false });
});

router.get("/auth", function (req, res, next) {
    res.render("pages/auth", { loggedIn: false });
});

router.get("/forgot", function (req, res, next) {
    res.render("pages/forgot_password", { loggedIn: false });
});

router.get("/newpassword", function (req, res, next) {
    res.render("pages/newPassword", { loggedIn: false });
});

router.get("/profile", function (req, res, next) {
    res.render("pages/profile", { user: { email:"my@eg.com", name:"John Doe", regdNo:"1801106333", branch:"Information Technology",},},);
});

router.use(api);

module.exports = router;
