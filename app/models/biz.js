// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var BizSchema = mongoose.Schema({
	name: 			String,
	address1: 		String, // Street address, P.O. box, company name, c/o
	address2: 		String, // Apartment, suite, unit, building, floor, etc.
	city: 			String,
	country: 		String,
	postalCode: 	String,
	phone: 			String,
	webAddress: 	String,
	description: 	String,
	dateCreated: 	{ type: Date, default: Date.now },
	admins: [{type: Schema.ObjectId, ref: 'userSchema'}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Biz', BizSchema);