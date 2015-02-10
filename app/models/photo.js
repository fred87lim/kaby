// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/*
 * When a photo is uploaded, we need to separate the user and the owner. When a user uploads his own photo,
 * the owner is the user. When a user uploads a photo for a friend, a company or a school, the owner is the one
 * he is posting the photo to.
 * user: The one who uploads the photo
 * owner: The one who owns the photo. This can be a user, a company or a school.
 */
var PhotoSchema = mongoose.Schema({
	filename: String,
    relativePath: String,
    caption: String,
    url: String,
    dateCreated: { type: Date, default: Date.now },
    user: {type: Schema.ObjectId, ref: 'userSchema'},
    owner: {type: Schema.ObjectId}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Photo', PhotoSchema);