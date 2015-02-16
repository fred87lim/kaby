// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var pageType = ['COMPANY', 'ORGANIZATION', 'SCHOOL'];

/**
 * 1 - Myself only
 * 2 - [2 - 10]
 * 11 - [11 - 50]
 * 51 - [51 - 200]
 * 201 - [201 - 500]
 * 1001 - [1001 - 5000]
 * 5001 - [5001 - 10000]
 * 10001 - [10001++]
 */
var size = [1, 2, 11, 51, 201, 501, 1001, 5001, 10001];
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
		city: 			{ type: Schema.ObjectId, ref: 'CitySchema', default: null},
		country: 		{ type: Schema.ObjectId, ref: 'CountrySchema', default: null},
		postalCode: 	String,
		phone: 			String,
	},
	adminLogins        : [adminToken],
	profilePhoto: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
	coverPhoto: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
	about: String,
	yearFounded: { type: Number},
	size : { type: Number, enum: size}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Page', PageSchema);