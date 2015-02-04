// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var status = ['APPLIED', 'SHORTLISTED', 'EMPLOYED'];

var ApplicationSchema = mongoose.Schema({
	job: { type: Schema.ObjectId, ref: 'JobSchema'},
	user: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who applied for the job */
	status: { type: String, enum: status, default: 'APPLIED'},
	dateCreated: 	{ type: Date, default: Date.now },
	reviews: [{ // Internal use for reference
		content: { type: String},
		author:  { type: Schema.ObjectId, ref: 'userSchema'},
		dateCreated: { type: Date, default: Date.now}
	}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Application', ApplicationSchema);