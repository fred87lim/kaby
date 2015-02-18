var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var constants 		= require('../../app/utils/constants');
var async 			= require('async');

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
 * @param  {String} keyword - user keyword.
 * @return [City]
 */
SettingController.findCityByKeyword = function (keyword, callback) {
	var re = new RegExp(keyword, 'i');

	City.find({name: { $regex: re }}, function (err, cities) {
		if (err) {
			return callback(null);
		}

		// Find country of cities
		var industryObject = {
			findIndustryParent: function(industry, callbackMap) {
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