var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var Page			= require('../../app/models/page');
var constants 		= require('../../app/utils/constants');

// Third party libs
var async 			= require('async');
var winston = require('winston');

// Controller
var PhotoController = require('../../app/controllers/photo_controller');
var SettingController = require('../../app/controllers/setting_controller');

/**
 * All things about page
 */
var PageController = function() {
	winston.log('info', 'Page controller');
};

module.exports = PageController;

/**
 * Find page by username.
 * A page can be queried by different party. Whether it is a public user, an authenticated user, a page's admin,
 * a page's follower. For different role, we need to tailor different data.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						username: page username,
 *						authenticatedUser: authenticated user id, (null for public user)
 *					}
 *
 *
 * @return [Page]
 */
PageController.findPageByUsername = function (data, callback) {
	Page.findOne({ username: data.username}, function (err, page) {
		if (err) {
			winston.log('error', err);
		}

		if (!page) {
			return callback(null);
		}		

		// Find profile picture
		var findProfilePicture = function (photoId, callbackParallel) {
			PhotoController.findPhotoById({ photoId: photoId}, function (photo) {
				callbackParallel(null, photo);
			});
		}

		// Find cover picture
		var findCoverPicture = function (photoId, callbackParallel) {
			PhotoController.findPhotoById({ photoId: photoId}, function (photo) {
				callbackParallel(null, photo);
			});
		}

		// Find City
		var findCity = function (cityId, callbackParallel) {
			SettingController.findCityById({ cityId: cityId}, function (city) {
				callbackParallel(null, city);
			});
		}

		// Find Country
		var findCountry = function (countryId, callbackParallel) {
			SettingController.findCountryById({ countryId: countryId}, function (country) {
				callbackParallel(null, country);
			});
		}

		async.parallel({
			logo: function (next) {
				findProfilePicture(page.profilePicture, next);
			},
			cover: function (next) {
				findCoverPicture(page.coverPicture, next);
			},
			city: function (next) {
				findCity(page.address.city, next);
			},
			country: function (next) {
				findCountry(page.address.country, next);
			}
		}, function (err, results) {
			var logo 		= results.logo;
			var cover 		= results.cover;
			var city 		= results.city;
			var country     = results.country;

			var pageJson = {
				_id: page._id,
				pageType: page.pageType,
				name: page.name,
				username: page.username,
				about: page.about,
				address: {
					address1: page.address.address1,
					address2: page.address.address2,
					city: city,
					country: country
				},
				logo: logo,
				cover: cover,
				yearFounded: page.yearFounded
			}

			return callback(pageJson);
		});
	});
};

PageController.test = function () {
	console.log('Console page controller');
	winston.log('info', 'Console page controller');
}