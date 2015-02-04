/*
 * THIS MODEL REPRESENTS A CONNECTION BETWEEN 2 USERS.
 * A CONNECTION IS ESTABLISHED WHEN USER B (TARGET) ACCEPTS CONNECTION REQUEST FROM USER A (USER).
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var status = ['PENDING', 'ACCEPTED', 'IGNORED'];

var ConnectSchema = mongoose.Schema({
	status: 	{ type: String, enum: status, default: 'PENDING' },
	user: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who likes */
	target: 	{ type: Schema.ObjectId, ref: 'userSchema'},
	dateCreated: 	{ type: Date, default: Date.now },
	dateAccepted: { type: Date, default: null}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Connect', ConnectSchema);