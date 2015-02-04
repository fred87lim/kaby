// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var parentType = ['ARTICLE', 'LINK', 'STATUS'];
var status = ['OPENING', 'INTERVIEWING', 'CLOSED'];

var JobSchema = mongoose.Schema({
	title: 			{ type: String},
	description: 	{ type: String},
	requirements: 	{ type: String},
	industries: 	{ type: String},
	salary: 		{ min: {type: Number}, max: { type: Number}, // -1 means undefined
		currency: { type: String}
	},
	experience: 	{
		min: { type: Number},
		max: { type: Number}
	},
	perks: 			{ type: String},
	status: 		{ type: String, enum: status, default: 'OPENING'},
	quantity: 		{ type: Number},
	location: 		{ type: String},
	owner : 		{ type: Schema.ObjectId, ref: 'PageSchema'},
	user: 			{ type: Schema.ObjectId, ref: 'userSchema' }, // The one who post the job listing
	dateCreated: 	{ type: Date, default: Date.now },
	dateExpire: 	{ type: Date},
	reviewers: 		[{type: Schema.ObjectId, ref: 'userSchema'}] // Reviewer must be connected to user to be added to reviewers list.
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Job', JobSchema);