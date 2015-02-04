var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var constants = require('../utils/constants');

var educationLevel = ['Undergraduate', 'Graduate', 'Postgraduate'];

var EducationSchema = mongoose.Schema({
    schoolName: String,
    school: { type: Schema.ObjectId, ref: 'PageSchema'},
    schoolStarted: {
        day: Number,
        month: Number,
        year: Number
    },
    schoolEnded: {
        day: Number,
        month: Number,
        year: Number
    },
    yearStarted: { type: Number},
    yearEnded: { type: Number},
    degree: String,
    studyField: String,
    grade: Number,
    activities: String,
    description: String,
    user: {type: Schema.ObjectId, ref: 'userSchema'},
    dateCreated: 	{ type: Date, default: Date.now },
    educationLevel: {type: String, enum: educationLevel}
});

module.exports = mongoose.model('Education', EducationSchema);