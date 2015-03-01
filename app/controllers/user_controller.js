var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var Page			= require('../../app/models/page');
var User			= require('../../app/models/user');
var constants 		= require('../../app/utils/constants');

// Third party libs
var async 			= require('async');
var winston = require('winston');

// Controller
var PhotoController = require('../../app/controllers/photo_controller');
var SettingController = require('../../app/controllers/setting_controller');

/**
 * All things user
 */
var UserController = function() {
	winston.log('info', 'Page controller');
};

module.exports = UserController;

/**
 * Check if an email has been registered.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						email: email,
 *					}
 *
 *
 * @return [JSON]
 */
UserController.checkEmailAvailable = function (data, callback) {
	User.findOne({ "local.email": data.email }, function (err, user) {

		var result = {
			available: false,
			reason: null,
		}
		if (err) {
			winston.log('error', err);
			result.reason = 'Error';
			return callback(result);
		}

		if (!user) {
			result.available = true;
		} else {
			result.reason = 'This email has been taken.';
		}

		return callback(result);
	});
};

/**
 * Check if an email has been registered.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						username: username,
 *					}
 *
 *
 * @return [JSON]
 */
UserController.checkUsernameAvailable = function (data, callback) {
	User.findOne({ "local.username": data.username }, function (err, user) {

		var result = {
			available: false,
			reason: null,
		}

		if (err) {
			winston.log('error', err);
			result.reason = 'Error';
			return callback(result);
		}

		if (!user) {
			result.available = true;
		} else {
			result.reason = 'This username has been taken.';
		}

		return callback(result);
	});
};

/**
 * Check if an email has been registered.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						username: username,
 *						email: email,
 *						firstName: first name,
 *						lastName: last name,
 *						password: password,
 *					}
 *
 *
 * @return [JSON]
 */
UserController.signup = function (data, callback) {
	
};

/**
 * Change purpose.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						userId: user id,
 *						purpose: purpose type - [1,2 or 3]
 *					}
 *
 *
 * @return [Boolean] - true if change successful.
 */
UserController.changePurpose = function (data, callback) {
	User.findById(data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			return callback(false);
		}

		if (!user) {
			return callback(false);
		}

		user.purpose = data.purpose;
		user.save(function (err) {
			if (err) {
				winston.log('error', err);
			}

			return callback(false);
		})
	});
};