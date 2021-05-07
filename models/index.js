const mongoose = require("mongoose"),
    localMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    regNo: {
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
    },
    },  
    {
        strict: true,
        versionKey: false,
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    }
);

userSchema.plugin(localMongoose);

userSchema.statics.serializeUser = function() {
    return function(user, cb) {
        cb(null, user.id);
    }
};

userSchema.statics.deserializeUser = function() {
    var self = this;

    return function(id, cb) {
        self.findOne({ _id:id }, cb);
    }
};



const User = mongoose.model('User', userSchema);


const eventRegistrationSchema = new mongoose.Schema({
    event_id: mongoose.ObjectId,
    participant_id: mongoose.ObjectId,
    team_id: String,
    extra_data: {
        type: Map,
        of: String
    }
});

eventRegistrationSchema.index({ participant_id: 1, event_id: 1 });
eventRegistrationSchema.index({ team_id: 1 });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema)


const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageURL: String,
    date: Date,
    isListed: Boolean,
    max_participants: Number,
    category: {
        type: String,
        enum: [
            "Fun",
            "Tech",
            "Workshop"
        ],
    },
    organisers: [
        {
            name: String,
            phone: String
        }
    ],
    extra_data: [String],
    team_extra_data: [String]
});

const Event = mongoose.model('Event', eventSchema);


const teamSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        uppercase: true
    },
    event_id: mongoose.SchemaTypes.ObjectId,
    team_extra_data: {
        type: Map,
        of: String
    }
});

// Add compound unique constraint for teamname and event_id
teamSchema.index({ name: 1, event_id: 1}, { unique: true });

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