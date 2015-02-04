// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var CountrySchema = mongoose.Schema({
	name: 	{ type: String,unique: true },
	code: 		{ type: Number,unique: true },  
	iso: 		{ type: String }}); // Country ISO code in 2 characters

// create the model for users and expose it to our app
module.exports = mongoose.model('Country', CountrySchema);