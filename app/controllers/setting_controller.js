var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var PrivacySetting	= require('../../app/models/privacy_setting');
var JobTitle	= require('../../app/models/settings/title');
var QualificationType	= require('../../app/models/settings/qualification_type');
var constants 		= require('../../app/utils/constants');


var async 			= require('async');
var winston 		= require('winston');

var SettingController = function() {

};

module.exports = SettingController;

/**
 * Find industries by keyword.
 * 
 * @param  {String} keyword - user keyword.
 * @return [Industry]
 */
SettingController.findIndustryByKeyword = function (keyword, callback) {
	var re = new RegExp(keyword, 'i');

	// Since sup-industries have no parent and we don't want to return them together with sub-industries, so
	// filter them out by $ne: null
	Industry.find({ $and: [ {name: { $regex: re }}, {parent: { $ne: null }} ]}, {limit: 1}, function (err, industries) {
		if (err) {
			return callback(industries);
		}

		// Find parent industry if any
		var industryObject = {
			findIndustryParent: function(industry, callbackMap) {
				var industryJson = {
					_id: industry._id,
					name: industry.name,
					slug: industry.slug,
					parent: null
				};
				
				// Return sup-industries also
				if (industry.parent) {
					Industry.findById(industry.parent, function (err, parent) {
						if (err) {
							callbackMap(err);
						}
						
						if (parent) {
							var parentJson = {
								_id: parent._id,
								name: parent.name,
								slug: parent.slug
							}
							industryJson.parent = parentJson;							
						} 
						callbackMap(null, industryJson);
					});
				} else {
					callbackMap(null, industryJson);
				}
			}
		}
		
		async.map(industries, industryObject.findIndustryParent.bind(industryObject), function (err, callbackResult) {
			return callback(callbackResult);
		});
	});
};

/**
 * Find industry by id.
 * 
 * @param  {String} id - Industry Id.
 * @return {Industry}
 */
SettingController.findIndustryById = function (id, callback) {

	Industry.findById(id, function (err, industry) {
		if (err) {
			return callback(null);
		}
		
		if (!industry) {
			return callback(null);
		}
		
		var industryJson = {
			_id: industry._id,
			name: industry.name,
			slug: industry.slug,
			parent: null
		};
		
		if (industry.parent) {
			Industry.findById(industry.parent, function (err, parent) {
				if (err) {
					callbackMap(err);
				}
				
				if (parent) {
					var parentJson = {
						_id: parent._id,
						name: parent.name,
						slug: parent.slug
					}
					industryJson.parent = parentJson;							
				}
				return callback(industryJson);
			});
		} else {
			return callback(industryJson);
		}
	});
};

/**
 * Find cities by keyword.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						keyword: keyword
 *					}
 *
 *
 * @return [City]
 */
SettingController.findCityByKeyword = function (data, callback) {
	var re = new RegExp(data.keyword, 'i');

	City.find({ name: { $regex: re }	}, function (err, cities) {
		if (err) {
			winston.log('error', err);
		}

		// look up country of these cities
		var cityObject = {
			findCity: function (city, callbackMap) {

				var cityJson = {
					_id: city._id,
					name: city.name,
					country: null
				};

				SettingController.findCountryById({ countrId: city.country}, function (country) {
					if (!country) {
						callbackMap(null, cityJson);
					}

					var countryJson = {
						_id: country._id,
						name: country.name,
					};
					cityJson.country = countryJson;

					callbackMap(null, cityJson);
				});
			}
		};

		// For each city, find its country respectively
		async.map(cities, cityObject.findCity.bind(cityObject), function (err, callbackResult) {
			return callback(callbackResult);
		});
	});
};

/**
 * Find city by id.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						cityId: city id
 *					}
 *
 *
 * @return [City]
 */
SettingController.findCityById = function (data, callback) {
	City.findById( data.cityId, function (err, city) {
		if (err) {
			winston.log('error', err);
			return callback(null);
		}

		if (!city) {
			return callback(null);
		}

		var cityJson = {
			_id: city._id,
			name: city.name,
			country: null
		};

		// Find city's country respectively
		SettingController.findCountryById({ countryId: city.country }, function (country) {
			if (!country) {
				return callback(cityJson);
			}

			var countryJson = {
				_id: country._id,
				name: country.name,
			};

			cityJson.country = countryJson;
			return callback(cityJson);
		});
	});
};

/**
 * Find original city by id. This will return simple page object to assign to other object
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						cityId: city id
 *					}
 *
 *
 * @return [City]
 */
SettingController.findOriginalCityById = function (data, callback) {
	City.findById( data.cityId, function (err, city) {
		if (err) {
			winston.log('error', err);
			return callback(null);
		}

		if (!city) {
			return callback(null);
		}

		return callback(city);
	});
};

/**
 * Find countries by keyword.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						keyword: keyword
 *					}
 *
 *
 * @return [Country]
 */
SettingController.findCountryByKeyword = function (data, callback) {
	var re = new RegExp(data.keyword, 'i');

	Country.find({ name: { $regex: re }	}, function (err, countries) {
		if (err) {
			winston.log('error', err);
		}

		return callback(callbackResult);
	});
};

/**
 * Find country by id.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						countryId: country id
 *					}
 *
 *
 * @return [Country]
 */
SettingController.findCountryById = function (data, callback) {
	Country.findById( data.countryId, function (err, country) {
		if (err) {
			winston.log('error', err);
		}

		return callback(country);
	});
};

/**
 * Find all privacy setting
 *
 * @param  {Callback} 	
 *
 *			
 * @return [Country]
 */
SettingController.findPrivacySettings = function (callback) {
	PrivacySetting.find({}, function (err, privacies) {
		if (err) {
			winston.log('error', err);
		}

		return callback(privacies);
	});
}

/**
 * Find privacy setting by id.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						privacyId: privacy id
 *					}
 *
 *
 * @return [Privacy]
 */
SettingController.findPrivacyById = function (data, callback) {
	PrivacySetting.findById( data.privacyId, function (err, privacy) {
		if (err) {
			winston.log('error', err);
		}

		return callback(privacy);
	});
};

/**
 * Find job title by keyword.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						keyword: keyword
 *					}
 *
 *
 * @return [JobTitle]
 */
SettingController.findJobTitlesByKeyword = function (data, callback) {
	var re = new RegExp(data.keyword, 'i');

	JobTitle.find({ name: { $regex: re }	}, function (err, titles) {
		if (err) {
			winston.log('error', err);
		}

		return callback(titles);
	});
};

/**
 * Find qualification type by keyword.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						keyword: keyword
 *					}
 *
 *
 * @return [JobTitle]
 */
SettingController.findQualificationTypeByKeyword = function (data, callback) {
	var re = new RegExp(data.keyword, 'i');

	QualificationType.find({ name: { $regex: re }	}, function (err, qualifications) {
		if (err) {
			winston.log('error', err);
		}

		return callback(qualifications);
	});
};
