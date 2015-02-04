var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var constants = require('../utils/constants');

var LanguageSchema = mongoose.Schema({
    language: String,    
    proficiency: String,
    user: {type: Schema.ObjectId, ref: 'userSchema'},
    dateCreated: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Language', LanguageSchema);