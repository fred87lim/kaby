// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var ExperienceSchema = mongoose.Schema({
	companyName:        String,
    company: { type: Schema.ObjectId, ref: 'PageSchema'},
    title:          String,
    location:       String,
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