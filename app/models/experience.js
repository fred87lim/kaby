// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var ExperienceSchema = mongoose.Schema({
	companyName:        String,
    company: { type: Schema.ObjectId, ref: 'PageSchema'},
    title:       {type: Schema.ObjectId, ref: 'JobTitleSchema'},
    titleName:          String,
    location:       {type: Schema.ObjectId, ref: 'CitySchema'},
    description:    String,
    isWorking:      Boolean,
    dateStarted : {type: Date},
    dateEnded : {type: Date},
    // dateStarted: {
    //     day:        String,
    //     month:      {type: String},
    //     year:       Number
    // },
    // dateEnded: {
    //     day:        String,
    //     month:      {type: String},
    //     year:       Number
    // },
    user: {type: Schema.ObjectId, ref: 'userSchema'}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Experience', ExperienceSchema);