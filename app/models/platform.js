var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// define schema
var platformSchema = mongoose.Schema({
	userAgent : String,
	ipAddress : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Platform', platformSchema);