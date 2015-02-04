// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var pageType = ['COMPANY', 'ORGANIZATION', 'SCHOOL'];
var role = ['ADMIN', 'EDITOR'];

var adminToken = mongoose.Schema({
	admin: 	{ type: Schema.ObjectId, ref: 'userSchema' },
    token: 	{ type: String },
    date : 	{ type: Date, default: Date.now }
});

var PageSchema = mongoose.Schema({
	name: String,
	description: String,
	username: {
		type: String, 
        trim: true, 
        unique: true},
	website: String,
	pageType: 	{ type: String, enum: pageType },
	admins: 		[{ type: Schema.ObjectId, ref: 'userSchema' }], /* One who likes */
	dateCreated: 	{ type: Date, default: Date.now },
	address : {
		address1: 		String, // Street address, P.O. box, company name, c/o
		address2: 		String, // Apartment, suite, unit, building, floor, etc.
		city: 			String,
		country: 		String,
		postalCode: 	String,
		phone: 			String,
	},
	adminLogins        : [adminToken],
	profilePhoto: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
	coverPhoto: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Page', PageSchema);