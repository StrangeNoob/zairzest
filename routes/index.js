var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/index", { loggedIn: false });
});

/* GET coming soon page */
router.get("/comingsoon", function (req, res, next) {
  res.render("pages/comingsoon", { loggedIn: false });
});

module.exports = router;
