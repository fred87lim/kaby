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
			data: null
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
			data: null
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

/**
 * Save user basic information.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						userId: user id,
 *						location: city id,
 *						birthday: {
 *							day: [1 - 31]
 *							month: [0 - 11]
 *							year: [Number]
 *							privacy: [Privacy]
 *						},
 *						desciption: [Text]
 *					}
 *
 *
 * @return [Boolean] - true if change successful.
 */
UserController.saveBasicInfo = function (data, callback) {
	User.findById(data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			return callback(false);
		}

		if (!user) {
			return callback(false);
		}

		

		var findPrivacyById = function (privacyId, parallelCallback) {
			if (privacyId) {
				SettingController.findPrivacyById({ privacyId: privacyId}, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}			
		}

		var findCityById = function (cityId, parallelCallback) {
			if (cityId) {
				SettingController.findCityById({ cityId: cityId}, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}
		}

		var parallelJson = {
			privacy: function (next) {
				findPrivacyById(data.birthday.privacy, next);
			},
			city: function (next) {
				findCityById(data.location, next);
			}
		};

		async.parallel({
			privacy: function (next) {
				findPrivacyById(data.birthday.privacy, next);
			},
			city: function (next) {
				findCityById(data.location, next);
			}
		}, function (err, results) {
			var privacy = results.privacy;
			var city = results.city;
			
			if (data.birthday.day != null && data.birthday.month != null && 
				data.birthday.year != null && data.birthday.privacy != null) {
				var birthday = new Date(data.birthday.year, data.birthday.month, data.birthday.day);
				user.birthday.date = birthday;
				user.birthday.privacy = privacy;
			}

			user.livesin = city;
			console.log(data.location);
			console.log(city);
			//console.log(user);
			user.save(function (err) {
				if (err) {
					winston.log('error', err);
				}

				return callback(true);
			});	
		});
	});
};

/**
 * Add user experience.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						userId: user id,
 *						location: city id,
 *						birthday: {
 *							day: [1 - 31]
 *							month: [0 - 11]
 *							year: [Number]
 *							privacy: [Privacy]
 *						},
 *						desciption: [Text]
 *					}
 *
 *
 * @return [Boolean] - true if change successful.
 */
UserController.saveBasicInfo = function (data, callback) {
	User.findById(data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			return callback(false);
		}

		if (!user) {
			return callback(false);
		}

		

		var findPrivacyById = function (privacyId, parallelCallback) {
			if (privacyId) {
				SettingController.findPrivacyById({ privacyId: privacyId}, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}			
		}

		var findCityById = function (cityId, parallelCallback) {
			if (cityId) {
				SettingController.findCityById({ cityId: cityId}, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}
		}

		var parallelJson = {
			privacy: function (next) {
				findPrivacyById(data.birthday.privacy, next);
			},
			city: function (next) {
				findCityById(data.location, next);
			}
		};

		async.parallel({
			privacy: function (next) {
				findPrivacyById(data.birthday.privacy, next);
			},
			city: function (next) {
				findCityById(data.location, next);
			}
		}, function (err, results) {
			var privacy = results.privacy;
			var city = results.city;
			
			if (data.birthday.day != null && data.birthday.month != null && 
				data.birthday.year != null && data.birthday.privacy != null) {
				var birthday = new Date(data.birthday.year, data.birthday.month, data.birthday.day);
				user.birthday.date = birthday;
				user.birthday.privacy = privacy;
			}

			user.livesin = city;
			console.log(data.location);
			console.log(city);
			//console.log(user);
			user.save(function (err) {
				if (err) {
					winston.log('error', err);
				}

				return callback(true);
			});	
		});
	});
};