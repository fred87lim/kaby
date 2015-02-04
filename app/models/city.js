// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var CitySchema = mongoose.Schema({
	name: 	{ type: String,unique: true },
	country: {type: Schema.ObjectId, ref: 'CountrySchema'},
}) // Country ISO code in 2 characters

// create the model for users and expose it to our app
module.exports = mongoose.model('City', CitySchema);