// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var PhotoSchema = mongoose.Schema({
	filename: String,
    relativePath: String,
    caption: String,
    url: String,
    dateCreated: { type: Date, default: Date.now },
    user: {type: Schema.ObjectId, ref: 'userSchema'},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Photo', PhotoSchema);