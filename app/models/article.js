// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var postStatus = ['PUBLISHED', 'DRAFT'];

var ArticleSchema = mongoose.Schema({
	title: String,
	slug: String, // title's slug
	content: String,
	url: String,
	urlTitle: String,
	status: { type: String, enum: postStatus},
	tags: [{type: Schema.ObjectId, ref: 'TagSchema'}],
	category: {type: Schema.ObjectId, ref: 'CategorySchema'},
	privacy: {type: Schema.ObjectId, ref: 'PrivacySettingSchema'},
	views: {type: Number, default: 0},
	author: {type: Schema.ObjectId, ref: 'userSchema'},
	pageOwner: {type: Schema.ObjectId, ref: 'PageSchema', default: null},
	dateCreated: 	{ type: Date, default: Date.now },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Article', ArticleSchema);