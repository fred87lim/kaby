var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var Photo			= require('../../app/models/photo');
var constants 		= require('../../app/utils/constants');

// Third party libs
var async 			= require('async');
var winston 		= require('winston');

/**
 * All things about photo
 */
var PhotoController = function() {

};

module.exports = PhotoController;

/**
 * Find photo by id.
 * A page can be queried by different party. Whether it is a public user, an authenticated user, a page's admin,
 * a page's follower. For different role, we need to tailor different data.
 *
 * @param  {JSON} 	data - user data.
 *					data = {
 *						photoId: photo Id,
 *						
 *					}
 *
 *
 * @return [Photo]
 */
PhotoController.findPhotoById = function (data, callback) {
	Photo.findById( data.photoId, function (err, photo) {
		if (err) {
			winston.log('error', err);
		}

		return callback(null);
	});
};