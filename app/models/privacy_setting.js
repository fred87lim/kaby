// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var privacy = [1,2,3,4]; // refer to constants.js

var PrivacySettingSchema = mongoose.Schema({
	name: 	{ type: String,unique: true },
	value: 		{ type: Number,unique: true }, 
	description: 		{ type: String }});

// create the model for users and expose it to our app
module.exports = mongoose.model('PrivacySetting', PrivacySettingSchema);