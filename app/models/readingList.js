// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var privacyState	= ['PUBLIC', 'PRIVATE'];

var ReadingListSchema = mongoose.Schema({
	name: 		{type: String},
	privacy: 		{ type: String, enum: privacyState},
	owner: 		{ type: Schema.ObjectId, ref: 'userSchema' },
	slug: { 
		type: String,
		trim: true},
    description: {type: String},
	dateCreated: 	{ type: Date, default: Date.now },
	icon: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
	articles : [{
		article: {type: Schema.ObjectId, ref: 'ArticleSchema'},
		dateAdded: {type: Date, default: Date.now},
		isRead: {type: Boolean, default: false}
	}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('ReadingList', ReadingListSchema);