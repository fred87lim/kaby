// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var parentType = ['ARTICLE', 'LINK', 'STATUS', 'COMMENT'];
var privacyState	= ['PUBLIC', 'PRIVATE'];

var CommentSchema = mongoose.Schema({
	content: 		String,
	parentType: 	{ type: String, enum: parentType },
	privacy: 		{ type: String, enum: privacyState},
	parentId: 		Schema.ObjectId,
	commenter: 		{ type: Schema.ObjectId, ref: 'userSchema' },
	dateCreated: 	{ type: Date, default: Date.now },
	isEdited: 		{type: Boolean, default: false}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', CommentSchema);