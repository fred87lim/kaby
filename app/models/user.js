// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var constants = require('../utils/constants');

var platformSchema = mongoose.Schema({
    userAgent : String,
    ipAddress: String,
    token: String,
    date : {type: Date, default: Date.now},
    provider: String //Authentication provier [local, facebook, twitter...]
});

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                'November', 'December'];

var educationLevel = ['Undergraduate', 'Graduate', 'Postgraduate'];

var privacy = [1,2,3,4]; // refer to constants.js

var purposeType = [1,2,3];

var TimePeriodSchema = mongoose.Schema({
    month: String,
    year: Number
});

var ProjectSchema = mongoose.Schema({
    name : String,
    occupation: String,
    isOngoing: Boolean,
    from: {
        month: {type: String, require: false, enum: months},
        year: Number
    },
    to: {
        month: {type: String,  require: false, enum: months},
        year: Number
    },
    projectUrl: String,
    description: String,
    members: [{type: Schema.ObjectId, ref: 'userSchema'}]
});

var TopupSchema = mongoose.Schema({
    amount: Number,
    payment: String, // paypal, creditcard
    operationAmount: Number,
    charityAmount: Number,
    actualAmount: Number, // the actual amount after paypal fee, operation cost, charity contribution
    dateCreate: { type: Date, default: Date.now },
    transactionId: String, // paypal trasaction Id
    feeAmount: Number  // fee charged by paypal
});

var userType = ['USER', 'ADMIN', 'SYSTEM'];
var maritalType = ['Married', 'Single'];

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        username     : { 
            type: String, 
            trim: true, 
            unique: true,
            required: constants.ERROR9003},
        email        : { 
            type: String, 
            trim: true, 
            unique: true,
            required: constants.ERROR9004,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, constants.ERROR9005] },
        password     : { type: String }, 
        firstName    : { type: String, trim: true },
        lastName     : { type: String, trim: true },
        activationCode : String,
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date, default: Date.now },
        isActivated  : { type: Boolean, default: false},
        platforms    : [platformSchema]
    },
    facebook         : {
        id           : String,
        email        : String,
        name         : String,
        platforms    : [platformSchema]
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    platforms        : [platformSchema],
    topups: [TopupSchema],
    userType     : { type: String, enum: userType},
    interests : [String],
    birthday: { 
        date : { type: Date },
        privacy: { type: Schema.ObjectId, ref: 'PrivacySettingSchema' }
    },
    livesin: { type: Schema.ObjectId, ref: 'CitySchema' },
    description: { type: String },
    maritalStatus: { type: String, enum: maritalType},
    projects: [ProjectSchema],
    profilePicture: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
    following: [{type: Schema.ObjectId, ref: 'userSchema'}], // a list of users whom this user is following
    followers: [{type: Schema.ObjectId, ref: 'userSchema'}], // a list of users who is following this user
    pagesFollowing: [{type: Schema.ObjectId, ref: 'PageSchema'}],
    pageManaging: {type: Schema.ObjectId, ref: 'PageSchema'},

    // 1 - User is currently looking for job
    // 2 - User is currently employed but open to better position
    // 3 - User is currently employed and happy with current position
    purpose: { type: Number, enum: purposeType }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};



// checking if password is valid
userSchema.methods.validPassword = function(password) {
    var result = bcrypt.compareSync(password, this.local.password);
    return result;
};

userSchema.static('getUser', function(email, password, cb) {
    User.authenticate(email, password, function(err, user) {
        if (err || !user) {
            return cb(err);
        }
        console.log('Authenticated: ' + user.local.email);
        cb(null, user.local.email);
    });
});

userSchema.static('authenticate', function(email, password, cb) {
    this.findOne({ 'local.email': email }, function(err, user) {
        if (err || !user) {
            return cb(err);
        }
        console.log('Authenticating....' + password + '/' + user.local.password);
        cb(null, bcrypt.compareSync(password, user.local.password) ? user : null);
    });
});

var Topup = mongoose.model('Topup', TopupSchema);
mongoose.model('User', userSchema);
var User = mongoose.model('User');
// create the model for users and expose it to our app
module.exports = User;