// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var RateSchema = mongoose.Schema({
	operatingCost: 			Number,
	charityCost: 		Number, 
	isActive: 		Boolean, 
	dateCreated: 	{ type: Date, default: Date.now },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Rate', RateSchema);