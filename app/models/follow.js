// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var status = ['FOLLOWING'];
var followingType = ['USER', 'PAGE'];

var FollowSchema = mongoose.Schema({
	status: 	{ type: String, enum: status, default: 'FOLLOWING' },
	user: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who likes */
	following: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who likes */
	pageFollowing: { type: Schema.ObjectId, ref: 'PageSchema' },
	dateCreated: 	{ type: Date, default: Date.now },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Follow', FollowSchema);