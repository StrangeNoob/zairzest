var express = require("express");
var router = express.Router();
const api = require("./api");
const { Event } =  require("../models/index");

const redirectAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect(`/auth?next=${req.url}`);
};

/* GET home page. */
router.get("/", function (req, res, next) {
  let loggedIn = req.isAuthenticated();
  res.render("pages/index", { loggedIn });
});
/* Get events page*/
router.get("/events", function (req, res, next) {
  let user = req.isAuthenticated();
  Event.find({},(err,data)=>{
    if(err){
     return next(err);
    }
    return res.render("pages/events", { user: user, events: data, });
  })
  ;
});

router.get("/auth", function (req, res, next) {
  res.render("pages/auth");
});

router.get("/comingsoon", function (req, res, next) {
  res.render("pages/comingsoon", { loggedIn: false });
});

router.get("/forgot", function (req, res, next) {
  res.render("pages/forgot_password");
});

router.get("/newpassword", function (req, res, next) {
  res.render("pages/newPassword");
});

router.get("/profile", redirectAuth, function (req, res, next) {
  user = req.user;
  res.render("pages/profile", { user });
});

router.get("/me", function (req, res, next) {
  let user = req.isAuthenticated();
  Event.find({category:"Tech"},(err,data)=>{
    if(err){
     return next(err);
    }
    return res.render("pages/me", { user: user, events: data, });
  });
});

router.get("/funevents", function (req, res, next) {
  let user = req.isAuthenticated();
  Event.find({category:"Fun"},(err,data)=>{
    if(err){
     return next(err);
    }
    return res.render("pages/events", { user: user, events: data, });
  });
});

router.get("/workshops", function (req, res, next) {
  let user = req.isAuthenticated();
  Event.find({category:"Workshop"},(err,data)=>{
    if(err){
     return next(err);
    }
    return res.render("pages/events", { user: user, events: data, });
  });
});

router.get("/techevents", function (req, res, next) {
  let user = req.isAuthenticated();
  Event.find({category:"Tech"},(err,data)=>{
    if(err){
     return next(err);
    }
    console.log(data);
    return res.render("pages/events", { user: user, events: data, });
  });
});



router.use(api);

module.exports = router;
