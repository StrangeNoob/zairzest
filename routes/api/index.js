const assert = require('assert');

const express = require("express"),
    passport = require("passport"),
    models = require("../../models"),
    router = express.Router(),
    ejs = require("ejs"),
    nodemailer = require("nodemailer"),
    mongoose = require('mongoose');


const {
    User,
    EventRegistration,
    Event,
    Team,
    ResetRequest
} = models;

const mongourl=process.env.MONGO_URI;   //TODO:change the url while hosting

// TODO: SETUP DATABASE
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

// TODO: Setup mailing
// const transporter = nodemailer.createTransport({
//     service:"Gmail",
//     auth:{
//     type:"OAuth2",
//       user:"",
//       clientId: "",
//       clientSecret: "",
//       refreshToken: ""
//     }
//   });

// Temporary test mailing setup
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'alexys45@ethereal.email',
        pass: 'qX8zZT2Nfe9ZeMJFBa'
    }
});


//Initialization of passportjs
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());
router.use(passport.session());


const checkIfAuthenticated = (req, res, next) => {
  console.log(req.user,req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(404).json({ status: "fail", message: "Not Authenticated" });
};



router.get("/logout", function (req, res) {
    req.logout();
    res.status(200);
    res.send();
});

router.post("/signin", function (req, res, next) {
    req.body.username = req.body.email
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            res.status(404).json(err);
            return;
        }

        if (user) {
            req.logIn(user, function (err) {
                if (err) {
                    return res.status(500).json(err);
                }
                res.status(200).json(user.id);
            });
        } else {
            res.status(401).json(info);
        }
    })(req, res, next);
});

router.post("/signup", function (req, res) {
    req.body.username = req.body.email;
    const newUser = new User({
        username: req.body.email,
        name: req.body.name,
        regNo: req.body.regNo,
        branch: req.body.branch
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.status(401);
            return res.send({
                status: 'fail',
                message: err.message
            });
        }
        passport.authenticate("local")(req, res, () => {
            ejs.renderFile(__dirname + "/mailTemplate.ejs", { name: req.user.name }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                // TODO: make email template to send registered
                transporter.sendMail({
                    from: 'Zairzest Team, CETB',
                    to: req.user.username,
                    subject: 'Zairzest | Registration Successful',
                    html: data
                }, function (error, info) {
                    if (error) {
                        console.log("mail error", error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
            res.status(200);
            res.send({
                status: 'success'
            });
        });
    });
});



// Forgot password form posts here with username(email address) in body
router.post('/forgotpassword', (req, res) => {
    User.findOne({
        username: req.body.email
    }, (err, user) => {
        let message;
        if (err) {
            res.status(500);
            res.send({status: 'fail', message: err.message});
        } else if (!user) {
            message = "An account with the given credentials does not exist";
            res.status(401);
            res.send({status: 'fail', message});
        } else {
            // create a new password reset request
            const resetRequest = new ResetRequest({
                r_id: user._id,
            });
            
            // save the request to the database
            resetRequest.save((err, request) => {
                if (err) {
                    res.status(500);
                    res.send({status: 'fail', message: err.message});
                    return;
                }
                
                // Send an E-Mail with a password reset link with id of the request
                // TODO: use the hosted URL in email
                transporter.sendMail({
                    from: 'Zairzest Team, CETB',
                    to: user.username,
                    subject: 'Zairzest | Password reset',
                    text: `Hi, ${user.name}\t\nWe received a request to reset your Zairzest password. If this wasn't you, you can safely ignore this email, otherwise please go to the following link to reset your password:\nhttps://localhost:3000/newpassword?rid=${resetRequest._id}\n\nThe Zairzest Team`,
                }, function (error, info) {
                    if (error) {
                        res.status(500);
                        res.send({status: 'fail', message: "Sorry, There seems to be a problem at our end"});
                    } else {
                        message = "Please check your E-Mail (also check your spam folder) for instructions on how to reset your password";
                        res.status(200);
                        res.send({status: 'success', message});
                    }
                });
            });
        }
    });
});

// Reset password form posts here with new password
router.post('/resetpassword/:resetRequestID', function (req, res, next) {
    ResetRequest.findByIdAndDelete(req.params.resetRequestID, function (requestError, resetRequest) {
        if (requestError || !resetRequest) {
            res.status(404);
            res.send({status: 'fail', message: "Invalid password reset link, Please go to Forgot Password to request another link"});
        } else {
            User.findById(resetRequest.r_id, function (userError, user) {
                user.setPassword(req.body.password, function (hashingError, updatedUser) {
                    if (hashingError || !updatedUser) {
                        message = "Sorry, There seems to be a problem at our end";
                        res.status(500);
                        res.send({status: 'fail', message});
                    } else {
                        updatedUser.save()
                        .then(() => {
                            message = "Your password has been successfully reset. Please login to continue";
                            res.status(200);
                            res.send({status: 'success', message});
                        })
                        .catch(saveError => {
                            message = "Sorry, There seems to be a problem at our end";
                            res.status(500);
                            res.send({status: 'fail', message});
                        });
                    }
                });
            });
        }
    });
});

// Profiel update API
router.post("/profile",checkIfAuthenticated, (req, res)=>{
    const userInfo = {
        username: req.body.email,
        name: req.body.name,
        regNo: req.body.regNo,
        branch: req.body.branch
    };
    
    User.findByIdAndUpdate(req.user._id, userInfo, {new:true}, function(err, user){
        if(err || !user){
            return res.status(500).send({status: 'fail', message: "Error in updating profile"});
        }
        res.status(200).json({ status: "success", user, message:"Successfully Updated" });
    });
    
});


// Event API

// Register for an event
router.get('/registerForEvent/:eventID', async (req, res) => {
    try {
        const event_id = new mongoose.Types.ObjectId(req.params.eventID);
        const event = await Event.findById(event_id).exec();
        assert(event);
    }catch(e) {
        res.status(404);
        res.send({status: 'fail', message: "Invalid Event ID"});
        return;
    }

    // Registration happens here
})

module.exports = router;