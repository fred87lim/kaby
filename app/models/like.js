// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var parentType = ['ARTICLE', 'LINK', 'STATUS', 'COMMENT'];


var LikeSchema = mongoose.Schema({
	parentType: 	{ type: String, enum: parentType },
	parentId: 		Schema.ObjectId,
	liker: 		{ type: Schema.ObjectId, ref: 'userSchema' }, /* One who likes */
	dateCreated: 	{ type: Date, default: Date.now },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Like', LikeSchema);