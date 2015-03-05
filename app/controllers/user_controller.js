var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var Page			= require('../../app/models/page');
var User			= require('../../app/models/user');
var Experience			= require('../../app/models/experience');
var constants 		= require('../../app/utils/constants');

// Third party libs
var async 			= require('async');
var winston = require('winston');

// Controller
var PhotoController = require('../../app/controllers/photo_controller');
var SettingController = require('../../app/controllers/setting_controller');
var PageController = require('../../app/controllers/page_controller');

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
			status: true,
			reason: null,
			data: {
				isAvailable: false
			}
		}

		if (err) {
			winston.log('error', err);
			result.status = false;
			result.reason = 'Database error';
			return callback(result);
		}

		if (!user) {
			result.data.isAvailable = true;
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
 * Find original user by id. This will return simple page object to assign to other object
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						userId: user id
 *					}
 *
 *
 * @return [City]
 */
UserController.findOriginalUserById = function (data, callback) {
	User.findById( data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			return callback(null);
		}

		if (!user) {
			return callback(null);
		}

		return callback(user);
	});
};

/**
 * Find original user by login token id. This will return simple page object to assign to other object
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						loginToken: login token id
 *					}
 *
 *
 * @return [City]
 */
UserController.findOriginalUserByLoginToken = function (data, callback) {
	User.findOne({'platforms.token' : data.loginToken}, function (err, user) {
		if (err) {
			winston.log('error', err);
			return callback(null);
		}

		if (!user) {
			return callback(null);
		}

		return callback(user);
	});
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
	var result = {
		status: false,
		message: null,
		data: null
	};

	User.findById(data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			result.message = 'Database error';
			return callback(result);
		}

		if (!user) {
			result.message = 'User not authenticated';
			return callback(result);
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
			user.desciption = data.desciption;
			user.save(function (err) {
				if (err) {
					winston.log('error', err);
				}

				result.status = true;
				result.data = data;
				return callback(result);
			});	
		});
	});
};

/**
 * Find original experience by id. This will return simple page object to assign to other object
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						experienceId: experience id
 *					}
 *
 *
 * @return [Experience]
 */
UserController.findOriginalExperienceById = function (data, callback) {
	Experience.findById( data.experienceId, function (err, experience) {
		if (err) {
			winston.log('error', err);
			return callback(null);
		}

		if (!user) {
			return callback(null);
		}

		return callback(experience);
	});
};

/**
 * Add user experience.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						userId: user id,
 *						companyName: company name,
 *						companyId: company Id,
 *						titleId: title id,
 *						titleName: title name
 *						location: city id
 *						isWorking: if user is still holding this job
 *						date: {
 *							start: {
 *								month: 	
 *								year: 
 *							},
 *							end: {
 *								month: 	
 *								year: 
 *							},
 *						},
 *						desciption: [Text]
 *					}
 *
 *
 * @return [ResultJSON] - .
 */
UserController.addExperience = function (data, callback) {

	var result = {
		status: false,
		message: null,
		data: null
	};

	User.findById(data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			result.message = 'Database error';
			return callback(result);
		}

		if (!user) {
			result.message = 'User not found';
			return callback(result);
		}

		// Find page to get page object to assign to experience object, so dont need full object
		var findPageById = function (pageId, parallelCallback) {
			if (pageId) {
				PageController.findOriginalPageById({ pageId: pageId }, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}
		}

		var findCityById = function (cityId, parallelCallback) {
			if (cityId) {
				SettingController.findOriginalCityById({ cityId: cityId}, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}
		}

		var findJobTitleById = function (jobTitleId, parallelCallback) {
			if (jobTitleId) {
				SettingController.findOriginalJobTitleById({ titleId: jobTitleId}, function (result) {
					parallelCallback(null, result);
				});
			} else {
				parallelCallback(null, null);
			}
		}

		async.parallel({
			page: function (next) {
				findPageById(data.companyId, next);
			},
			city: function (next) {
				findCityById(data.location, next);
			},
			title: function (next) {
				findJobTitleById(data.titleId, next);
			}
		}, function (err, results) {
			var page = results.page;
			var city = results.city;
			var title = results.title;
			
			var experience 			= new Experience();
			experience.isWorking 	= data.isWorking;
			experience.location		= city;
			experience.description 	= data.description;
			experience.dateStarted 	= new Date(data.date.start.year, data.date.start.month);

			if (experience.isWorking == false) {
				experience.dateEnded 	= new Date(data.date.end.year, data.date.end.month);
			}
			
			experience.user 		= user;

			if (page) {
				experience.company = page;
				experience.companyName = page.companyName;
			} else {
				experience.company = null;
				experience.companyName = data.titleName;
			}

			if (title) {
				experience.title = title;
				experience.titleName = title.name;
			} else {
				experience.title = null;
				experience.titleName = data.companyName;
			}

			experience.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				result.status = true;
				result.data = experience;
				return callback(result);
			});
		});		
	});
};

/**
 * Edit user experience.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						userId: user id,
 *						loginToken: login token id. Currently we use user id to identify. Later probably we have to use login token id to validate user authentication
 *						experienceId: experience id,
 *						companyName: company name,
 *						companyId: company Id,
 *						title: title
 *						location: city id
 *						isWorking: if user is still holding this job
 *						date: {
 *							start: {
 *								month: 	
 *								year: 
 *							},
 *							end: {
 *								month: 	
 *								year: 
 *							},
 *						},
 *						desciption: [Text]
 *					}
 *
 *
 * @return [ResultJSON] - true if change successful.
 */
UserController.editExperience = function (data, callback) {

	var result = {
		status: false,
		message: null,
		data: null
	};

	User.findById(data.userId, function (err, user) {
		if (err) {
			winston.log('error', err);
			result.message = 'Database error';
			return callback(result);
		}

		if (!user) {
			result.message = 'User not found';
			return callback(result);
		}

		// Find experience
		UserController.findOriginalExperienceById(data.experienceId, function (experience) {
			if (!experience) {
				result.message = 'Experience not found';
				return callback(result);
			} else {
				// Find page to get page object to assign to experience object, so dont need full object
				var findPageById = function (pageId, parallelCallback) {
					if (pageId) {
						PageController.findOriginalPageById({ pageId: pageId }, function (result) {
							parallelCallback(null, result);
						});
					} else {
						parallelCallback(null, null);
					}
				}

				var findCityById = function (cityId, parallelCallback) {
					if (cityId) {
						SettingController.findOriginalCityById({ cityId: cityId}, function (result) {
							parallelCallback(null, result);
						});
					} else {
						parallelCallback(null, null);
					}
				}

				async.parallel({
					page: function (next) {
						findPageById(data.companyId, next);
					},
					city: function (next) {
						findCityById(data.location, next);
					}
				}, function (err, results) {
					var page = results.page;
					var city = results.city;
					
					experience.isWorking 	= data.isWorking;
					experience.location		= city;
					experience.title 		= data.title;
					experience.description 	= data.description;
					experience.dateStarted 	= new Date(data.date.start.year, data.date.start.month);

					if (experience.isWorking == false) {
						experience.dateEnded 	= new Date(data.date.end.year, data.date.end.month);
					}
					
					experience.user 		= user;

					if (page) {
						experience.company = page;
						experience.companyName = page.companyName;
					} else {
						experience.company = null;
						experience.companyName = data.companyName;
					}

					experience.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return callback(result);
						}

						result.status = true;
						result.data = experience;
						return callback(result);
					});
				});	
			}
		});

			
	});
};