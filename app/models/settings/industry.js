// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var IndustrySchema = mongoose.Schema({
	name: { type: String},
	slug: { 
		type: String,
		trim: true, 
        unique: true },
    description: {type: String},
	dateCreated: 	{ type: Date, default: Date.now },
	icon: { type: Schema.ObjectId, ref: 'PhotoSchema', default: null},
	parent: { type: Schema.ObjectId, ref: 'IndustrySchema', default: null}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Industry', IndustrySchema);