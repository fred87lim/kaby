// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var status = ['ADMIN', 'EDITOR'];

var ConnectionSchema = mongoose.Schema({
	status: 	{ type: String, enum: status },
	connector: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who likes */
	connectee: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who likes */
	dateCreated: 	{ type: Date, default: Date.now },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Connection', ConnectionSchema);