var Industry       	= require('../../app/models/settings/industry');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var constants 		= require('../../app/utils/constants');
var async 			= require('async');

/**
 * All things about page
 */
var PageController = function() {

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
	Page.find({ username: data.username}, function (err, page) {
		if (err) {
			
		}
	});
};