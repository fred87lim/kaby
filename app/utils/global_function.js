var User       		= require('../../app/models/user');
// var Biz				= require('../../app/models/biz');
// var Rate				= require('../../app/models/rate');
// var Experience				= require('../../app/models/experience');
var Article				= require('../../app/models/article');
var Photo 				= require('../../app/models/photo');
var Comment				= require('../../app/models/comment');
var Like				= require('../../app/models/like');
var Page				= require('../../app/models/page');
var Follow				= require('../../app/models/follow');
var Tag					= require('../../app/models/tag');
var Category					= require('../../app/models/category');
var ReadingList			= require('../../app/models/readingList');
var Education 			= require('../../app/models/education');
var Experience 			= require('../../app/models/experience');
var Connect 			= require('../../app/models/connect');
var Job 				= require('../../app/models/job');
var Language			= require('../../app/models/language');
var Application			= require('../../app/models/application');
var City			= require('../../app/models/city');
var Country			= require('../../app/models/country');
var Dummy				= require('../../app/models/dummy');
var PrivacySetting				= require('../../app/models/privacy_setting');

var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
var constants = require('../../app/utils/constants');
var SMTPMailer = require('../../app/utils/SMTPMailer');
var request = require('request');
var uuid = require('node-uuid');
var nodemailer = require("nodemailer");
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: false });
var async = require('async');
var bcrypt   = require('bcrypt-nodejs');
var crypto = require('crypto');
var _s = require('underscore.string');
var _ = require('underscore');

var GlobalFunction = function () {

}

/**
 * Find profile picture.
 * 
 * @param  {String} userId - Data submitted from web form.
 * @return [JSON]
 */
GlobalFunction.findProfilePicture = function (photoId, callback) {
	Photo.findById(photoId, function (err, photo) {
		if (err) {
			callback(err);
		} else {

			var profilePictureJson = {
				url: null,
				isDefault: true,
			}

			if (photo) {
				profilePictureJson.url = photo._id;
				profilePictureJson.isDefault = false;
			} else {
				profilePictureJson.url = 'http://localhost:5000/img/default_user.png';
				profilePictureJson.isDefault = true;
			}

			callback(profilePictureJson);
		}
	});
}

/**
 * Find cover picture.
 * 
 * @param  {String} userId - Data submitted from web form.
 * @return [JSON]
 */
GlobalFunction.findCoverPicture = function (photoId, callback) {
	Photo.findById(photoId, function (err, photo) {
		if (err) {
			callback(err);
		} else {

			var profilePictureJson = {
				url: null,
				isDefault: true,
			}

			if (photo) {
				profilePictureJson.url = photo._id;
				profilePictureJson.isDefault = false;
			} else {
				profilePictureJson.url = 'http://localhost:5000/img/cover1.jpg';
				profilePictureJson.isDefault = true;
			}

			console.log(profilePictureJson);

			callback(profilePictureJson);
		}
	});
}

module.exports = GlobalFunction;