var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var SystemSchema = mongoose.Schema({
	balance: Number
});

// create the model for system and expose it to our app
module.exports = mongoose.model('System', SystemSchema);