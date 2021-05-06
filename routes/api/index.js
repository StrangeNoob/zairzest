const assert = require('assert');

const express = require("express"),
    passport = require("passport"),
    models = require("../../models"),
    router = express.Router(),
    mongoose = require('mongoose'),
    { calculateSHA256, sendMail } = require('./util');


const {
    User,
    EventRegistration,
    Event,
    Team,
    ResetRequest
} = models;

const mongourl=process.env.MONGO_URI;   //TODO:change the url while hosting
const TEAM_ID_LENGTH = 6

// TODO: SETUP DATABASE
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);



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
            sendMail(
				{
					email: req.body.username,
					subject: "Zairzest | Registration Successful",
					templateFile: "welcomeEmail.ejs",
					values: { name: req.body.name, zid: req.body.regNo },
					attachments: [
						{
							filename: "Zairzest.png",
							path: path.join(
								__dirname,
								"../../",
								"public/images/zairzest.png"
							),
							cid: "logo",
						},
					],
				},
				function (err, info) {
					if (error) {
						console.log("mail error", error);
					} else {
						console.log("Email sent: " + info.response);
					}
				}
			);

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
                
                sendMail(
					{
						email: user.username,
						subject: "Zairzest | Password reset",
						text: `Hi, ${
							user.name
						}\t\nWe received a request to reset your Zairzest password. If this wasn't you, you can safely ignore this email, otherwise please go to the following link to reset your password:\n${
							req.protocol + "://" + req.get("host")
						}/newpassword?rid=${
							resetRequest._id
						}\n\nThe Zairzest Team`,
					},
					function (error, info) {
						if (error) {
							res.status(500);
							res.send({
								status: "fail",
								message:
									"Sorry, There seems to be a probem at our end",
							});
						} else {
							message =
								"Please check your E-Mail (also check your spam folder) for instructions on how to reset your password";
							res.status(200);
							res.send({ status: "success", message });
						}
					}
				);
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

// User data api
router.get("/user/me",checkIfAuthenticated, (req, res)=>{
    res.send(req.user);
})


// Profile update API
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
router.post('/registerForEvent/:eventID', checkIfAuthenticated, async (req, res) => {
    let event;
    try {
        const event_id = new mongoose.Types.ObjectId(req.params.eventID);
        event = await Event.findById(event_id).exec();
        assert(event);
    } catch (e) {
        res.status(404);
        res.send({ status: 'fail', message: "Invalid Event ID" });
        return;
    }
    try {
        if (event.max_participants == 1) {
            // Individual events
            await (new EventRegistration({
                event_id: event._id,
                participant_id: req.user._id
            })).save();

            return res.status(200).send({
                status: 'success',
                data: {
                    registered: true
                }
            });
        } else if (req.body.team_id) {
            // Team events: Join a team
            const team = await Team.findById(req.body.team_id).exec();
            if (team) {
                await (new EventRegistration({
                    event_id: event._id,
                    participant_id: req.user._id,
                    team_id: team._id
                })).save();
    
                return res.status(200).send({
                    status: 'success',
                    data: {
                        team_id: team._id,
                        team_name: team.name,
                        meeting_link: team.meeting_link
                    }
                });
            } else {
                return res.status(400).send({
                    status: 'fail',
                    message: 'Invalid Team ID'
                });
            }
        } else if (req.body.team_name && req.body.meeting_link) {
            // Team events: Create a team
            const team = new Team({ 
                _id: calculateSHA256(TEAM_ID_LENGTH, req.body.team_name, event._id), 
                name: req.body.team_name, 
                meeting_link: req.body.meeting_link,
                event_id: event._id
            });
            await team.save();
            await (new EventRegistration({
                event_id: event._id,
                participant_id: req.user._id,
                team_id: team._id
            })).save();

            return res.status(200).send({
                status: 'success',
                data: {
                    team_id: team._id,
                    team_name: team.name,
                    meeting_link: team.meeting_link
                }
            });
        } else {
            return res.status(400).send({
                status: 'fail',
                message: 'Insufficient parameters'
            });
        }
    } catch (e) {
        // TODO: Better error handling to tell apart DB write errors from validation/uniqueness errors
        res.status(500).send({ status: 'fail', message: "Sorry, Please try a different team name or try again later" });
    }
});

router.post('/deregisterForEvent/:eventID', checkIfAuthenticated, async (req, res) => {
    let event;
    try {
        const event_id = new mongoose.Types.ObjectId(req.params.eventID);
        event = await Event.findById(event_id).exec();
        assert(event);
    } catch (e) {
        res.status(404);
        res.send({ status: 'fail', message: "Invalid Event ID" });
        return;
    }
    let registration_data;
    try {
        registration_data = await EventRegistration.findOneAndDelete({
            participant_id: req.user._id,
            event_id: event._id
        }).exec();

        res.status(200).send({ status: 'success', data: { registered: false } });
    } catch (e) {
        res.status(500).send({ status: 'fail', message: "Sorry, There seems to be a problem at our end" });
    }

    try {
        if (registration_data?.team_id) {
            const lastMemberQuit = !(await EventRegistration.exists({ team_id: registration_data.team_id }));
            if (lastMemberQuit) {
                await Team.findByIdAndDelete(registration_data.team_id).exec()
            }
        }
    } catch (e) {
        console.error(e);
    }
});

router.get('/getRegistrationData/:eventID', checkIfAuthenticated, async (req, res) => {
    let event;
    try {
        const event_id = new mongoose.Types.ObjectId(req.params.eventID);
        event = await Event.findById(event_id).exec();
        assert(event);
    } catch (e) {
        res.status(404);
        res.send({ status: 'fail', message: "Invalid Event ID" });
        return;
    }

    try {
        const registration_data = await EventRegistration.findOne({participant_id: req.user._id, event_id: event._id}).exec();
        if (event.max_participants == 1) {
            res.status(200).send({
                status: 'success',
                data: {
                    registered: !!registration_data
                }
            });
        } else {
            const team_data = await Team.findById(registration_data?.team_id).exec();
            res.status(200).send({
                status: 'success',
                data: !!registration_data ? {
                    team_id: team_data._id,
                    team_name: team_data.name,
                    meeting_link: team_data.meeting_link
                } : { registered: false }
            });
        }
    } catch (e) {
        res.status(500).send({ status: 'fail', message: "Sorry, There seems to be a problem at our end" });
    }
});

module.exports = router;