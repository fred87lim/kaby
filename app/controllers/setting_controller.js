var Industry       		= require('../../app/models/settings/industry');
var constants = require('../../app/utils/constants');

var SettingController = function() {

};

module.exports = SettingController;

/**
 * Find page that authenticated user is managing.
 * 
 * @param  {String} userId - Data submitted from web form.
 * @return [ActionResult]
 */
SettingController.findIndustryByKeyword = function (keyword, callback) {
	var re = new RegExp(keyword, 'i');

	Industry.find({ name: { $regex: re }}, function (err, industries) {
		if (err) {
			return callback(industries);
		}

		// Find parent industry if any
		return callback(industries);
	});
};

