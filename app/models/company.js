// Business establishment or restaurant

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var companyType = ['Public Company', 'Educational', 'Self Employed', 'Government Agency', 'Non Profit', 'Self Owned',
					'Privately Held', 'Partnership'];

var operatingStatus = ['Operating', 'Operating Subsidiary', 'Reorganizing', 'Out of business', 'Acquired'];

var CompanySchema = mongoose.Schema({
	name: 			String,
	address1: 		String, // Street address, P.O. box, company name, c/o
	address2: 		String, // Apartment, suite, unit, building, floor, etc.
	city: 			String,
	country: 		String,
	postalCode: 	String,
	phone: 			String,
	webAddress: 	String,
	description: 	String, // Tell members about the page's purpose and what sort of content to expect.
	dateCreated: 	{ type: Date, default: Date.now },
	yearFounded: 		Number,
	admins: [{type: Schema.ObjectId, ref: 'userSchema'}],

    companyType     : { type: String, enum: companyType}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Biz', BizSchema);

