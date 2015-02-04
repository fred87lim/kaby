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
var ReadingList			= require('../../app/models/readingList');
var Education 			= require('../../app/models/education');
var Experience 			= require('../../app/models/experience');
var Connect 			= require('../../app/models/connect');
var Job 				= require('../../app/models/job');
var Application			= require('../../app/models/application');
var Dummy				= require('../../app/models/dummy');

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

var UserController = function(app, passport) { 
	this.app = app;
	this.passport = passport;
};



UserRoute.prototype.signup = function (req, res, next) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	passport.authenticate('local-signup', function(err, user, info) {
		
		if (err) {
			return next(err);
		}

		if (!user) {
			result.message = info.message;			
		} else {
			result.status = 'OK';
			result.data = user;
		}
		res.send(result);
	})(req, res, next);
};