const mongoose = require("mongoose"),
    localMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    regno: {
        type: String,
        uppercase: true
    },
    phone: String,
    branch: {
        type: String,
        enum: [
            "Computer Science & Engineering",
            "Information Technology",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Electronics & Intrumentation Engineering",
            "Biotechnology",
            "Civil Engineering",
            "Textile Engineering",
            "Fashion & Apparel Technology",
            "Architecture",
            "Computer Science & Application",
            "Planning",
            "Mathematics & Humanities",
            "Physics",
            "Chemistry",
        ],
    }
});

userSchema.plugin(localMongoose);

const User = mongoose.model('User', userSchema);


const eventRegistrationSchema = new mongoose.Schema({
    event_id: mongoose.ObjectId,
    participant_id: mongoose.ObjectId,
    team_id: mongoose.ObjectId
});

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema)


const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageURL: String,
    date: Date,
    isListed: Boolean,
    organisers: [
        {
            name: String,
            phone: String
        }
    ]
});

const Event = mongoose.model('Event', eventSchema);


const teamSchema = new mongoose.Schema({
    name: String,
    meeting_link: String
});

const Team = mongoose.model('Team', teamSchema);


const resetRequestSchema = new mongoose.Schema({
    r_id: mongoose.SchemaTypes.ObjectId
});

const ResetRequest = mongoose.model('ResetRequest', resetRequestSchema)

module.exports = {
    User,
    EventRegistration,
    Event,
    Team,
    ResetRequest
}