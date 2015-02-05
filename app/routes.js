var models       		= require('../app/models/user');
var Biz					= require('../app/models/biz');
var Rate				= require('../app/models/rate');
var Experience			= require('../app/models/experience');
var Post				= require('../app/models/article');
var Photo 				= require('../app/models/photo');
var Comment				= require('../app/models/comment');
var Like				= require('../app/models/like');
var Page				= require('../app/models/page');
var User       			= require('../app/models/user');
var PrivacySetting		= require('../app/models/privacy_setting');

var UserRoute 		= require('../app/routes/userRoute');
var constants = require('../app/utils/constants');
// Oauth2 server
//var oauth2 = require('../app/oauth2');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var request = require('request');
var uuid = require('node-uuid');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: false });
var _s = require('underscore.string');
var _ = require('underscore');
var paypal = require('paypal-rest-sdk');

module.exports = function (app, passport) {

	var userController = new UserRoute(app, passport);

	app.all('/api/v2/oauth/token', app.oauth.grant());

	app.get('/api/v1/test', userController.test);

	//app.post('/api/v2/oauth/token', oauth2.token);

	app.post('/api/v2/signup', userController.signup);

	app.get('/api/v2/user/username/:username', userController.findUserByUsernameAPI);

	app.post('/api/v2/login', userController.login);

	app.post('/api/v2/logout', userController.logout);

	app.post('/api/v2/user/password/reset', userController.requestPasswordResetAPI);

	app.post('/api/v2/recover/password', userController.resetPassword);

	app.post('/api/v2/change/password', userController.changePassword);

	app.post('/api/v2/user/follow', userController.follow);

	app.post('/api/v2/user/unfollow', userController.unfollow);

	app.post('/api/v2/user/article', userController.postNewArticle);

	app.post('/api/v2/page', userController.createNewPage);
	app.post('/api/v2/page/follow', userController.followPage);
	app.post('/api/v2/page/unfollow', userController.unfollowPage);
	app.get('/api/v2/page/:username', userController.findPageByUsername);

	/* Article */
	app.post(	'/api/v2/article', 			userController.postNewArticle);
	app.put(	'/api/v2/article', 			userController.editArticle);

	app.post(	'/api/v2/comment', 	userController.commentArticle);
	app.put(	'/api/v2/comment', 	userController.editComment);
	app.delete(	'/api/v2/comment', 	userController.deleteComment);

	app.post(	'/api/v2/like', 	userController.like);
	app.delete(	'/api/v2/unlike', 	userController.unlike);

	app.post('/api/v2/readinglist', userController.createReadingList);
	app.put('/api/v2/readinglist', userController.editReadingList);
	app.post('/api/v2/readinglist/add', userController.addToReadingList);
	app.post('/api/v2/readinglist/remove', userController.removeArticleFromReadingList);

	app.post('/api/v2/education', userController.addEducation);
	app.put('/api/v2/education', userController.editEducation);
	app.delete('/api/v2/education', userController.removeEducation);

	app.post('/api/v2/experience', userController.addExperience);
	app.put('/api/v2/experience', userController.editExperience);
	app.delete('/api/v2/experience', userController.removeExperience);

	app.post('/api/v2/connect', userController.requestConnect);
	app.put('/api/v2/connect', userController.acceptConnectRequest);
	app.post('/api/v2/connect/ignore', userController.ignoreConnectRequest);
	app.post('/api/v2/connect/remove', userController.removeConnect);

	app.post('/api/v2/job', userController.postJob);
	app.post('/api/v2/job/application', userController.applyJob);
	app.get('/api/v2/job/:job_id', userController.findApplicationByJobId);
	app.delete('/api/v2/job/application', userController.unapplyJob);

	app.post('/api/v2/page/login', userController.loginAsAdmin);

	app.post('/api/v2/company/jobs', userController.findJobListingByEmployeeId);

	// /api/v2/settings/tags?k=nod
	app.get('/api/v2/settings/tags', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		var keyword = req.query.k;

		userController.findTags(keyword, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	// /api/v2/countries?k=nod
	app.get('/api/v2/countries', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		var keyword = req.query.k;

		userController.findCountries(keyword, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	// /api/v2/cities?k=nod
	app.get('/api/v2/cities', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		var keyword = req.query.k;

		userController.findCities(keyword, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	// Home Page 
	app.get('/api/v2/settings/general', function(req, res) {

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		// find settings
		userController.findSettings(req.user._id, function (callbackResult) {
			if (callbackResult.status) {
				result.data = callbackResult.data;
			}
			return res.send(callbackResult);
		});
	});

	app.get('/ajax/:username/articles/:article_slug', function (req, res) {
		var username = req.params.username;
		var articleSlug = req.params.article_slug;

		var loginUser = null;
		if (req.user) {
			loginUser = req.user;
		}

		userController.findArticle(username, articleSlug, loginUser, function (callbackResult) {

			var result = {
				status: callbackResult.status,
				message: callbackResult.message,
				data: callbackResult.data,
			}
			return res.send(callbackResult);
		});
	});

	/*
	 * Create new page
	 */
	app.post('/ajax/page/new', function (req, res, next) {
		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		var data = {
			username: 	req.body.username,
			name: 		req.body.name,
			address1: 	req.body.address1,
			address2: 	req.body.address2,
			city: 		req.body.city,
			country: 	req.body.country,
			latitude: 	req.body.latitude,
			longitude: 	req.body.longitude,
			phone: 		req.body.phone,
			postalCode: req.body.postalCode,
			type: 		req.body.type,
			url: 		req.body.url,
			yearFounded:req.body.yearFounded,
			about: 		req.body.about,
			userId: 	null,
		}

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		data.userId = req.user._id;

		userController.createNewPage(data, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/ajax/unlike/article', function (req, res, next) {
		var articleId = req.body.articleId;

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		userController.unlikeArticle(req.user._id, articleId, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/ajax/comment/like', function (req, res, next) {
		var commentId = req.body.commentId;

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		console.log(commentId);

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		userController.likeComment(req.user._id, commentId, function (callbackResult) {
			console.log(callbackResult);
			return res.send(callbackResult);
		});
	});

	// Unlike comment
	app.post('/ajax/comment/unlike', function (req, res, next) {
		var commentId = req.body.commentId;

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		console.log(commentId);

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		userController.unlikeComment(req.user._id, commentId, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	// Unlike comment
	app.post('/ajax/comment/reply', function (req, res, next) {
		var commentId = req.body.commentId;
		var content = req.body.content;

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		userController.replyComment(req.user._id, commentId, content, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/ajax/like/article', function (req, res, next) {
		var articleId = req.body.articleId;

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		userController.likeUnlikeArticle(req.user._id, articleId, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/ajax/article/comment', function (req, res, next) {
		var articleId = req.body.articleId;
		var content = req.body.content;

		var result = {
			status: false,
			message: '',
			data: null,
			errors: []
		};

		// Redirect if user not logged in
		if (req.user == null) {
			var error = 'User not authenticated';
			result.message = error;
			return res.send(result);
		}

		userController.commentArticleV2(req.user._id, articleId, content, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.get('/:username/articles/:article_slug', function (req, res) {
		var username = req.params.username;
		var articleSlug = req.params.article_slug;

		// Query article data. Check if user is logged in
		if (!req.user) {

		}

		var data = {
			title: articleSlug,
			username: username,
			articleSlug: articleSlug
		}

		// Render page
		res.render('pages/article.html', { data: data});
	});

	// Render New Page 
	app.get('/page/new', function (req, res) {
		var username = req.params.username;

		// Query article data. Check if user is logged in
		if (!req.user) {
			return res.redirect('/');
		}

		var data = {
			title: 'New Page',
			username: username
		}

		// Render page
		res.render('pages/new_page.html', { data: data});
	});

	// Login Page
	app.get('/login', function(req, res) {
		var title = 'Log in to Project X';
		var login_error = null;

		if (req.session.login_error) {
			login_error = req.session.login_error;
		}

		var redirect_url = req.protocol + '://' + req.get('host') + '/';

		var data = {
			title: 'Log in to Project X',
			redirect_url: redirect_url,
			message: login_error // second call of req.flash('error') will return null
		}

		if (req.user) {
			return res.redirect('/');
		}
		res.render('pages/login.html', { data: data});
	});

	// process the login form
	// app.post('/login', passport.authenticate('local-login', {
	// 	successRedirect: '/',
	// 	failureRedirect: '/login',
	// 	failureFlash: true
	// }));

	// app.post('/login', passport.authenticate('local-login', {
	// 	successRedirect: '/',
	// 	failureRedirect: '/login',
	// 	failureFlash: true
	// }));

	

	app.post('/login', function(req, res, next) {
		var url = req.body.redirect_url;
	  	passport.authenticate('local-login', function(err, user, info) {
	    	if (err) { return next(err); }
	    	// Redirect if it fails
	    	if (!user) { 
	    		// store login message in session
	    		req.session.login_error = info.message;
	    		return res.redirect('/login'); 
	    	}

	    	req.logIn(user, function(err) {
	      		if (err) { 
	      			return next(err); 
	      		}

	      		req.session.login_error = null;
	      		if (!url) {
	      			url = '/';
	      		}
	      		// Redirect if it succeeds
	      		return res.redirect(url);
	    	});
	  	})(req, res, next);
	});

	app.get('/password_reset', function(req, res) {
		var title = 'Password Reset';

		// This variable is to check whether user is allowed to reset his password. User can reset only if he is 
		// logged in or has a valid reset token.
		var reset_allowed = false;
		var data = {
			title: title,
			reset_allowed: false,
			error_message: null
		}

		var reset_code = req.query.token;
		var user_id = req.query.uid;

		// If no reset_code, check if user logged in.

		if (req.user) {
			reset_allowed = true;
			res.render('pages/password_reset.html', { data: data});
		} else {
			if (reset_code) {
				// Validate reset code
				userController.validatePasswordResetToken(user_id, reset_code, function (callbackResult) {
					console.log(callbackResult);
					if (!callbackResult.status) {
						// Redirect to request password reset page with expire link error
						//req.session.reset_email_sent = true;
						req.session.reset_error_message = callbackResult.message;
						return res.redirect('/request_password_reset');

						//data.error_message = callbackResult.message;
					} else {
						data.reset_allowed = true;
					}
					res.render('pages/password_reset.html', { data: data});
				});
			} else {
				return res.redirect('/');
			}
		}

		
	});

	app.get('/request_password_reset', function(req, res) {
		var title = 'Request for password reset';

		var did_not_receive = req.query.did_not_receive;
		// Reset session value
		if (did_not_receive) {
			req.session.reset_email_sent = null;
			req.session.email = null;
			req.session.reset_error_message = null;
		}

		var reset_email_sent = false;
		var has_requested = false;

		if (req.session.reset_email_sent) {
			reset_email_sent = true;
		}

		var data = {
			title: title,
			reset_email_sent: reset_email_sent,
			reset_error_message: req.session.reset_error_message
		}

		// redirect user to home page if user has already logged in.
		if (req.user) {
			return res.redirect('/');
		}

		res.render('pages/request_password_reset.html', { data: data});
	});

	// Request for password reset userController.requestPasswordReset
	app.post('/request_password_reset', function (req, res) {
		var email = req.body.email;
		var host = req.headers.host;
		var result = userController.requestPasswordReset(email, host, function (callbackResult) {

			if (callbackResult.status == true) { // request successfully
				req.session.reset_email_sent = true;
				req.session.email = email;
			} else { //request failed
				req.session.reset_email_sent = false;
				req.session.reset_error_message = callbackResult.message;
			}

			// redirect to request password reset page
			return res.redirect('/request_password_reset');
		});
	});

	app.post('/experiences', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}
		var exp = {
			userId: req.user._id,
			companyName: 	_.escape(req.body.companyName),
			companyId: 		req.body.companyId,
			isStillHere: 	req.body.isStillHere,
			title: 			_.escape(req.body.title),
			location: 		_.escape(req.body.location),
			dateStarted: 	req.body.dateStarted,
			dateEnded: 		req.body.dateEnded,
			description: 	_.escape(req.body.description)
		};

		userController.addExperienceV2(exp, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.delete('/experiences/:expId', function (req, res) {
		var expId = req.params.expId;
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			res.send(result);
		}

		// find target user
		userController.removeExperienceV2(expId, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	// Edit Basic information
	app.put('/info', function (req, res) {
		var result = {
			status: false,
			messages: [],
			data: null
		};

		if (!req.user) {
			result.messages.push('User not authenticated');
			return res.send(result);
		}

		var info = {
			userId: req.user._id,
			firstName: _.escape(req.body.firstName),
			lastName: 	_.escape(req.body.lastName),
			livesin: 		_.escape(req.body.livesin),
			birthday: 	req.body.birthday,
			description: 	_.escape(req.body.description)
		};

		console.log(info);

		userController.editBasicInfo(info, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.put('/experiences', function (req, res) {
		var result = {
			status: false,
			messages: [],
			data: null
		};

		if (!req.user) {
			result.messages.push('User not authenticated');
			return res.send(result);
		}

		var exp = {
			userId: req.user._id,
			experienceId: req.body.experienceId,
			companyName: 	_.escape(req.body.companyName),
			companyId: 		req.body.companyId,
			isStillHere: 	req.body.isStillHere,
			title: 			_.escape(req.body.title),
			location: 		_.escape(req.body.location),
			dateStarted: 	req.body.dateStarted,
			dateEnded: 		req.body.dateEnded,
			description: 	_.escape(req.body.description)
		};

		userController.editExperienceV2(exp, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/tags', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		var newTag = {
			userId: req.user._id,
			name: req.body.name,
			slug: req.body.slug
		}

		userController.addTag(newTag, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/categories', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		var newCategory = {
			userId: req.user._id,
			name: req.body.name,
			slug: req.body.slug
		}

		userController.addCategory(newCategory, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/educations', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}
		var edu = {
			userId: req.user._id,
			schoolName: _.escape(req.body.school_name),
			degree: _.escape(req.body.degree),
			studyField: _.escape(req.body.study_field),
			schoolId: req.body.school_id,
			grade: req.body.grade,
			educationLevel: req.body.education_level,
			yearStarted: req.body.year_started,
			yearEnded: req.body.year_ended,
			description: _.escape(req.body.description)
		};

		userController.addEducationV2(edu, function (callbackResult) {
			return res.send(callbackResult);
		})
	});

	/*
	 * Render articles page
	 */
	app.get('/:username/articles', function (req, res) {

	});

	app.get('/ajax/user/:username/people_suggestions', function (req, res) {
		var targetUsername = req.params.username;

		// find target user
		userController.findPeopleSuggestions(targetUsername, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.get('/ajax/user/:username/following', function (req, res) {
		var targetUsername = req.params.username;

		// find target user
		userController.findFollowing(targetUsername, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.get('/ajax/user/:username/followers', function (req, res) {
		var targetUsername = req.params.username;

		// find target user
		userController.findFollowers(targetUsername, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.get('/ajax/user/:username', function (req, res) {
		var targetUsername = req.params.username;

		// find target user
		userController.findUserByUsername(targetUsername, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/ajax/likes/article/:articleId', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		var articleId = req.params.articleId;

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		userController.likeUnlikeArticle(req.user._id, articleId, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/ajax/follow/:username', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		var targetUsername = req.params.username;

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		userController.followV2(req.user._id, targetUsername, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.get('/ajax/:username/articles', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		var username = req.params.username;

		userController.findArticlesByUsername(username, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/articles', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		var article = {
			userId: req.user._id,
			title: req.body.title,
			slug: req.body.slug,
			content: _.escape(req.body.content),
			tags: req.body.tags,
			category: req.body.category,
			privacy: req.body.privacy
		}

		userController.newArticle(article, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	app.post('/languages', function (req, res) {
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		var language = {
			userId: req.user._id,
			language: 		req.body.language,
			proficiency: 	req.body.proficiency
		}

		userController.addLanguage(language, function (callbackResult) {
			return res.send(callbackResult);
		});

	});

	// Home Page 
	app.get('/new_article', function(req, res) {

		var title = 'Welcome to Project X';

		// Redirect if user not logged in
		if (req.user == null) {
			return res.redirect('/');
		}

		console.log('Title');

		var data = {
			title: title,
			user: req.user,
			redirect_url: null,
			target_user: null,
			settings: null
		}

		// find settings
		userController.findSettings(req.user._id, function (callbackResult) {
			console.log(callbackResult);
			if (callbackResult.status) {
				data.settings = callbackResult.data;
			}
		});

		// user is logged in user
		res.render('pages/new_article.html', { data: data });
	});

	// Home Page 
	app.get('/edit_profile', function (req, res) {

		// Redirect if user not logged in
		if (req.user == null) {
			return res.redirect('/');
		}

		var currentYear = new Date().getFullYear();
		var years = [];
		var eduYears = [];
		var days = [];
		for (var i = currentYear; i >= currentYear - 50; i--) {
			var year = {"name": i, "value": i};
			years.push(year);
		}

		for (var i = currentYear + 8; i >= currentYear - 50; i--) {
			var year = {"name": i, "value": i};
			eduYears.push(year);
		}

		for (var i = 1; i <= 31; i++) {
			var day = { name: i, value: i};
			days.push(day);
		}

		var title = 'Edit Profile';
		var data = {
			title: title,
			user: req.user,
			target_user: null,
			months: constants.MONTHS,
			years: years,
			eduYears: eduYears,
			days: days,
			privacy_setting: null,
			educationLevels: constants.EDUCATION_LEVEL,
			languages: constants.LANGUAGE_PROFICIENCY
		}

		// find target user
		userController.findUserByUsername(data.user.local.username, function (callbackResult) {
			if (callbackResult.status) {
				data.target_user = callbackResult.data;
			}

			// find setting 
			PrivacySetting.find({}, function (err, privacies) {
				if (err) {

				}

				data.privacy_setting = privacies;
				// user is logged in user
			res.render('pages/profile_edit.html', { data: data });
			});

			
		});
	});

	app.post('/educations', function (req, res) {
		var edu = {
			schoolId: req.body.school_id,
			schoolName: _.escape(req.body.school_name),
			degree: _.escape(req.body.degree),
			studyField: _.escape(req.body.study_field),
			description: _.escape(req.body.description),
			yearStarted: req.body.year_started,
			yearEnded: req.body.year_ended
		};

		var result = {
			status: 'false',
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			res.send(result);
		}
	});

	

	app.delete('/educations/:eduId', function (req, res) {
		var eduId = req.params.eduId;
		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			res.send(result);
		}

		// find target user
		userController.removeEducationV2(eduId, function (callbackResult) {
			return res.send(callbackResult);
		});
	})

	

	// send to twitter to do the authentication
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// Home Page 
	app.get('/', function(req, res) {

		var loginUser = req.user;
		var loginToken = null;

		if (req.session.loginToken) {
			loginToken = req.session.loginToken;
		}

		var title = 'Welcome to Project X';

		if (loginUser) {
			title = loginUser.local.firstName + ' ' + loginUser.local.lastName;
		}

		var redirect_url = req.protocol + '://' + req.get('host') + req.originalUrl;

		var data = {
			title: title,
			user: req.user,
			redirect_url: redirect_url
		}

		// user is logged in user
		res.render('pages/index.html', {
			loggedInUser : req.user, loginToken: loginToken, user: req.user, data: data
		});
	});

	/*
	 * This endpoint is to save uer profile picture. Note that unless user do cropping on his
	 * profile picture, it is still considered null photo.
	 * We will store this photo in a tempopary folder and return to client a JSON contained its path
	 * for end user cropping.
	 */
	app.post('/profile_picture', function (req, res) {
		//console.log(req.files);

		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		var originalFilename = req.files.file.originalFilename;
		var path = req.files.file.path;
		//var contentType = req.files.content-type;
		var size = req.files.file.size;

		/* Delete previous image saved in session */
		var prevImg = req.session.imageTempPath;

		if (prevImg) {
			fs.unlink(prevImg, function (err, data) {
				console.log('Removed previous image: ' + prevImg);
			});
		}

		var uuid1 = uuid.v1();
		//return res.send(result);

		User.findById(req.user._id, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				result.message = 'User not found.';
				return res.send(result);
			}

			if (req.files.file.size == 0) {
				result.message = 'No file uploaded.';
				return res.send(result);
        	}
            else {
                var file = req.files.file;

                /* temp path */
                var tempPath = file.path;

                var relativePath = '/public/img/profile_temp/';
                var lastIndex = __dirname.lastIndexOf('/');
                var appDir = __dirname.substring(0, lastIndex );

                /* Path for resized image */
                var resizeNewPath = uuid1 + '_resized_'  + originalFilename;

                var imgLocalUrl = appDir + relativePath + resizeNewPath;

                gm(tempPath).resize(480).write(imgLocalUrl, function (err) {
                   	if (!err) {
                   		console.log('Image resized');
                   		// save file path to cookie for later cropping.
		                req.session.imageTempPath = resizeNewPath;

		                var data = {
                        	file: {
	                        	name: originalFilename,
	                        	size: size,
	                        	url: 'http://localhost:5000/img/profile_temp/' + resizeNewPath
							}
                        };

                        console.log(data);

                        result.data = data;
                        result.status = true;
						return res.send(result);

                   	} else {
                   		console.log(err);
                   		result.message = 'File does not exist.';
						return res.send(result);
                    }
                });
            }
		});
	});

	app.post('/profile_picture/crop', function (req, res) {
		var imagePath = req.session.imageTempPath;

		var result = {
			status: false,
			message: '',
			data: null
		};

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}

		/* Check if the temporary image path exists */
		if (!imagePath) {
			result.message = 'No file uploaded.';
			return res.send(result);
		}

		/* Crop image and set image as profile picture */		
		var x = req.body.x;
		var y = req.body.y;
		var w = req.body.w;
		var h = req.body.h;



		var relativePath = '/public/img/profile_temp/';
        var lastIndex = __dirname.lastIndexOf('/');
        var appDir = __dirname.substring(0, lastIndex );

        var imgLocalUrl = appDir + relativePath + imagePath;

        User.findById(req.user._id, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				result.message = 'User not found.';
				return res.send(result);
			}

			gm(imgLocalUrl).crop(w, h, x, y).write(imgLocalUrl, function (err) {
				if (err) {
					result.message = 'Unable to crop image.';
					return res.send(result);
				} else {
					var data = {
						url: 'http://localhost:5000/img/profile_temp/' + imagePath
					}

					/* Save photo */
					var photo = new Photo();
					photo.filename = imagePath;
					photo.relativePath = imgLocalUrl;
					photo.url = data.url;
					photo.user = user;

					photo.save(function (err) {
						if (err) {
							console.log(err);
						}

						user.profilePicture = photo;

						user.save(function (err) {
							if (err) {
								console.log(err);	
							}
							
							
						});

						// set image as profile picture
						result.status = true;
						result.data = photo;
						console.log(result);
						return res.send(result);
					});
					
				}
			});
			
		});		
	});

	

	// Home Page 
	app.get('/:username', function(req, res) {
		var username = req.params.username;

		var loginUser = req.user;
		var loginToken = null;

		if (req.session.loginToken) {
			loginToken = req.session.loginToken;
		}

		var redirect_url = req.protocol + '://' + req.get('host') + req.originalUrl;

		var title = 'Welcome to Project X';

		if (loginUser) {
			title = loginUser.local.firstName + ' ' + loginUser.local.lastName;
		}

		var data = {
			title: title,
			user: req.user,
			redirect_url: redirect_url,
			target_user: null
		}

		// find target user
		userController.findUserByUsername(username, function (callbackResult) {
			if (callbackResult.status) {
				data.target_user = callbackResult.data;
			}

			// If user is not found, look up for company and school and render
			// respectively.
			// user is logged in user
			res.render('pages/user.html', {
				loggedInUser : req.user, loginToken: loginToken, user: req.user, data: data
			});
		});		
	});

	// Home Page 
	app.delete('/sessions/:session_id', function(req, res) {
		var session_id = req.params.session_id;
		console.log('Session: ' + session_id);

		var result = {
			status: false,
			message: null,
			data: null
		}

		if (!req.user) {
			result.message = 'User not authenticated';
			return res.send(result);
		}
		console.log('user: ' + req.user._id);
		userController.terminateSession(req.user._id, session_id, function (callbackResult) {
			return res.send(callbackResult);
		});
	});

	

	app.post('/api/v1/logout', function (req, res) {
		var loginToken = req.body.loginToken;

		// Find current user with login token
		models.User.findOneAndUpdate({'platforms.token' : loginToken}, {
			$pull: {
				'platforms' : { 'token': loginToken} 
			}
		}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status': 'USER_NOT_FOUND', 'error_message' : 'User is not found in database'});
			}

			req.logout();
			req.session.loginToken = undefined;
			
			console.log('User logged out: ' + loginToken);
			res.send({'status': 'OK'});
		});
	});

	// // Login Page
	// app.get('/:username', function(req, res) {
	// 	var username = req.params.tokenId;
	// 	var title = 'Log in to Project X';
	// 	var data = {
	// 		title: 'Log in to Project X',
	// 		message: req.flash('error') // second call of req.flash('error') will return null
	// 	}

	// 	if (req.user) {
	// 		return res.redirect('/');
	// 	}
	// 	res.render('pages/login.html', { data: data});
	// });

	// app.post('/api/v1/login', passport.authenticate('local-login', {}), function (req, res, next) {
	// 	res.send(req.user);
	// });
	
	app.post('/api/v1/login', function (req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err) {
				var result = {
					'status': 'FAILED',
					'message': 'Unable to find user with given email and passport.',
					'data': err
				}
				res.send(result);
				return;
			}

			if (!user) {
				console.log("Data: " + JSON.stringify(info.message));
				var result = {
					'status': 'FAILED',
					'message': info.message,
					'data': null
				}
				res.send(result);
				return;
			}

			req.logIn(user, function (err) {
					if (err) {
						return next(err);
					}

					console.log('Login Token: ' + info.loginToken);
					if(req.body.rememberme) {
						req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
					}

					// save login token to session
					req.session.loginToken = info.loginToken;

					var result = {
						'status': 'OK',
						'message': null,
						'data': {
							'user': req.user, 
							'loginToken': info.loginToken
						}
					}
					res.send(result);
					//res.json(200, { "email": user.local.username });
				});

			
		})(req, res, next);
	});

	// Signup Page
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	

	app.get('/activate/:code', function (req, res) {
		var code = req.param('code');

		// get user with activation code from database.
		models.User.findOne({ 'local.activationCode': code}, function (err, user) {
			if (err) {
				return next(err);
			}

			if (!user) {
				res.send(400);
			}

			// If user is found, activate account.
			if (user) {
				user.local.isActivated = true;
				user.save(function(err) {
				    if (err)
				        throw err;
				    res.send(200, {'status': 'OK'});
				});
			}
		});
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.post('/api/v1/signup', function (req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) {
				return next(err);
			}

			console.log("Sign Up: " + JSON.stringify(user));

			if (!user) {
				console.log("Data: " + JSON.stringify(info.message));
				res.send(400);
				//return res.redirect('/login');
			}

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				res.send(req.user);
				//res.json(200, { "data": user.local.username });
			});
		})(req, res, next);
	});

	// Profile page
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user : req.user, // get the user out of session
			fbToken : req.session.fbToken
		});
	});

	// PayPal URL redirect execute
	app.get('/execute', function (req, res) {
		var paymentId = req.session.paymentId;
		var payerId = req.param('PayerID');
		console.log('Execute: ' + paymentId + "/" + payerId);

		var details = { "payer_id": payerId };
		var payment = paypal.payment.execute(paymentId, details, function (error, payment) {
			if (error) {
				console.log(error);
				res.render('cancel', { 'error': error });
			} else {
				console.log("Execute: " + payment.id + payment.transactions[0].description);
				
				var transactionId = payment.transactions[0].related_resources[0].sale.id;
				console.log('Get transactionId: ' + transactionId);

				var fee;
				var amount;
				// Get tax value from payment
				var url = 'https://api-3t.sandbox.paypal.com/nvp';
				    //var transactionId = paymentId;
				    var bodyStr = "METHOD=GetTransactionDetails&" + "USER=tranhungnguyen-facilitator_api1.gmail.com&" +
				    	"PWD=1398659527&" + "SIGNATURE=AqUtS4TrmV15dm8N.zFu0wdPrh3nAStA777GtR3j0OQ9dpxLhySYCzmB&" +
				    	"TRANSACTIONID=" + transactionId + "&VERSION=95.0"
				     var apiCall = request.post({
				          url:     url,
				          body: bodyStr
				          //body:    "METHOD=GetTransactionDetails&USER=tranhungnguyen-facilitator_api1.gmail.com&PWD=1398659527&SIGNATURE=AqUtS4TrmV15dm8N.zFu0wdPrh3nAStA777GtR3j0OQ9dpxLhySYCzmB&TRANSACTIONID=0UR47995C5012802F&VERSION=95.0"
				     }, function (err, res, body) {
				          var result = {};
				          var str = unescape(body);
				          str.split('&').forEach(function(x){
				               var arr = x.split('=');
				               arr[1] && (result[arr[0]] = arr[1]);
				          });
				          fee = parseFloat(result.FEEAMT);
				          amount = parseFloat(result.AMT);
				          //console.log("Current Balance: " + result.L_AMT0 +  " \nReturn: " + JSON.stringify(result));

				          // Get user from session
				var user = req.user;

				console.log(fee + '/' + amount);
				// create new top up
				var topup = new models.Topup();
				topup.amount = amount;
				topup.payment = 'paypal';
				topup.operationAmount = parseFloat(amount * 0.1);
				topup.charityAmount = parseFloat(amount * 0.02);
				topup.feeAmount = fee;
				var value = parseFloat(amount) - parseFloat(topup.operationAmount);
				topup.actualAmount = parseFloat(amount) - parseFloat(topup.operationAmount) - 
					parseFloat(topup.charityAmount) - parseFloat(topup.feeAmount);
				topup.transactionId = transactionId;
				console.log('actual amount: ' + topup.actualAmount + '/' + value);
				user.topups.push(topup);

				user.save(function (err) {

					if (err) {
						throw err;
					}
					console.log('Topup succeed.');
					//res.redirect('/profile');
					
				});
				     });

				
			}
		});
		
		res.render('execute', { 'payment': payment });

		//console.log("Execute: " + JSON.stringify(req.body.payment));
		//res.render('execute.ejs', {});
	});

	// PayPal URL redirect execute
	app.get('/cancel', function (req, res) {
		res.render('cancel.ejs', {});
	});

	// Facebook routes
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email'}));

	// Handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	app.get('/connect/local', function (req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash : true
	}));

	

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

	// handle the callback after facebook has authorize the user
	app.get('/connect/facebook/callback', passport.authorize('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	// used to unlink account, for social account, just	remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

	app.get('/unlink/local', function (req, res) {
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function (err) {
			res.redirect('/profile');
		});
	});

	// facebook
	app.get('/unlink/facebook', function (req, res) {
		var user = req.user;
		//user.facebook.token = undefined;

		console.log('Unlinking facebook ... ' + req.session.fbToken);
		// Remove facebook token in session as well as in database
		if (req.session.fbToken) {
			models.User.findOneAndUpdate({ 'facebook.id' : user.facebook.id }, {
				$pull : {
					'facebook.platforms' : { 'token': req.session.fbToken }
				}
			}, function (err, result) {
				if (err)
					throw err;
				console.log('Removed ' + result.facebook.id);
				// remove token in session
				req.session.fbToken = undefined;

				res.redirect('/profile');
			});
		}

		// user.save(function (err) {
		// 	res.redirect('/profile');
		// });
	});

	

	

	// register new business
	app.post('/api/v1/biz/new', function (req, res) {
		var biz = new Biz();
		biz.name = req.body.name;
		biz.address1 = req.body.address1;
		biz.address2 = req.body.address2;
		biz.city = req.body.city;
		biz.country = req.body.country;
		biz.phone = req.body.phone;
		biz.webAddress = req.body.webAddress;
		biz.description = req.body.description;
		biz.postalCode = req.body.postalCode;
		var loginToken = req.body.loginToken;

		// Find login token to ensure that user has logged in when making request.
		models.User.findOne({ 'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'UNAUTHORIZED'});
			}
			console.log("Register New Biz: " + biz.name + " / " + loginToken);
			biz.admins.push(user);
			// save new business to database
			biz.save(function (err) {
				if (err) {
					throw err;
				}
			});
			res.send({'status': 'OK'});
		});
	});

	// Find User By Login Token
	app.get('/api/v1/user/token/:tokenId', function (req, res) {
		var loginToken = req.params.tokenId;

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
			}
			
			res.send({'status': 'OK', 'results' : user});
		});
	});

	// PayPal Service
	app.post('/api/v1/payment/paypal/pay', function (req, res) {
		var amount = req.body.amount;

		var payment = {
			"intent": "sale",
			"payer": {
			},
			"transactions": [{
				"amount": {
					"currency": 'USD',
					"total": amount
				},
				"description": 'Photunate Account Topup.'
			}]
		};

		payment.payer.payment_method = 'paypal';
		payment.redirect_urls = {
			"return_url": "http://localhost:5000/execute",
			"cancel_url": "http://localhost:5000/cancel"
		};

		paypal.payment.create(payment, function (error, payment) {
			if (error) {
				console.log(error);
				res.send({ 'status': 'FAILED', 'error': error });
			} else {
				console.log("PayPal succeed: " + JSON.stringify(payment));
				req.session.paymentId = payment.id;
				res.send({ 'status': 'OK', 'payment': payment });
			}
		});
	});

	// PayPal credit card service
	app.post('/api/v1/payment/creditcard/pay', function (req, res) {

	});

	// Admin create new rate. This has to be created on web.
	app.post('/api/v1/admin/rate/new', function (req, res) {
		var loginToken = req.body.loginToken;

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
			}
			
			// Only admin is able to create new rate.
			if (user.userType === 'ADMIN') {
				console.log('Admin Create new rate');
				var operatingCost = req.body.operatingCost;
				var charityCost = req.body.charityCost;
				var isActive = req.body.isActive;

				var newRate = new Rate();
				newRate.operatingCost = operatingCost;
				newRate.charityCost = charityCost;
				newRate.isActive = isActive;

				console.log('Find other rates');

				// deactivate other rates
				Rate.findOneAndUpdate({ isActive: true}, { isActive: false}, function (err, rate) {
					if (err) {
						throw err;
					}
					console.log('deactivate other rates');
					newRate.save(function (err) {
						if (err) {
							throw err;
						}
						console.log('Save new rate');
					});

					res.send({'status': 'OK', 'results' : user});
				});
				
			}
			
		});
	});

	// Allow the authenticating users to follow the user specified in the username parameter
	// Authenticating user is specified in the login token parameter.
	app.post('/api/v1/user/follow', function (req, res) {
		var loginToken = req.body.loginToken;
		var username = req.body.username;

		models.User.findOne({'platforms.token' : loginToken}, function (err, loginUser) {
			if (err) {
				throw err;
			}

			if (!loginUser) {
				res.send({'status' : 'FAILED', 'error_message': 'You are not authenticated.'});
			}

			console.log('follow: authenticated user' + loginUser.local.username);

			// Find target user whom authenticating user want to follow
			models.User.findOne({'local.username' : username}, function (err, targetUser) {
				if (err) {
					throw err;
				}
				console.log('follow: target user found' + targetUser.local.username);
				if (!targetUser) {
					res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
				} else {
					// Need to check if authenticating user and target user are already following each other
					// to avoid duplicate entry in database.
					for (var i = 0; i < targetUser.followers.length; i++) {
						var objectId = targetUser.followers[i];

						if (objectId == loginUser.id) {
							console.log('Follow you are already following this user ');
							res.send({'status' : 'FAILED', 'error_message': 'User already followed.'});
							return;
						}
					}

					// Add target user to authenticating user's follower list
					loginUser.following.push(targetUser);
					loginUser.save(function (err) {
						if (err) {
							throw err;
						}
					});

					// Add authenticating user to target user's following list
					targetUser.followers.push(loginUser);
					targetUser.save(function (err) {
						if (err) {
							throw err;
						}
					});

					var result = {
						loginUser: loginUser.local.username,
						targetUser: targetUser.local.username
					};

					// return JSON object
					res.send({'status': 'OK', 'results' : result});
				}
			});
		});
	});
	
	// Allow the authenticating users to unfollow the user specified in the username parameter
	// Authenticating user is specified in the login token parameter.
	app.post('/api/v1/user/unfollow', function (req, res) {
		var loginToken = req.body.loginToken;
		var username = req.body.username;

		models.User.findOne({'platforms.token' : loginToken}, function (err, loginUser) {
			if (err) {
				throw err;
			}

			if (!loginUser) {
				res.send({'status' : 'FAILED', 'error_message': 'You are not authenticated.'});
				return;
			}

			// Find target user whom authenticating user want to follow
			models.User.findOne({'local.username' : username}, function (err, targetUser) {
				if (err) {
					throw err;
				}

				if (!targetUser) {
					res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
				} else {
					// Need to check if authenticating user and target user are already following each other
					// to avoid duplicate entry in database.
					

					for (var i = 0; i < loginUser.following.length; i++) {
						var objectId = loginUser.following[i];

						if (objectId == targetUser.id) {
							loginUser.following.splice(i, 1);
						}
					}

					// Add target user to authenticating user's follower list
					loginUser.save(function (err) {
						if (err) {
							throw err;
						}
					});

					// Add authenticating user to target user's following list
					for (var i = 0; i < targetUser.followers.length; i++) {
						var objectId = targetUser.followers[i];

						if (objectId == loginUser.id) {
							targetUser.followers.splice(i, 1);
						}
					}
					
					targetUser.save(function (err) {
						if (err) {
							throw err;
						}
					});

					var result = {
						loginUser: loginUser.local.username,
						targetUser: targetUser.local.username
					};

					// return JSON object
					res.send({'status': 'OK', 'results' : result});
				}
			});
		});
	});

	/*
	 * Find all post from a user with given username
	 */
	app.get('/api/v1/user/post/:username', function (req, res) {
		var username = req.params.username;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		console.log('Find post of ' + username);

		models.User.findOne({'local.username' : username}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Something went wrong. Please try again';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'User not found';
				res.send(result);
				return;
			} else {
				
				Post.find({'author': user._id}, null, {sort: {dateCreated: -1}}, function (err, posts) {
					if (err) {
						console.log(err);
						result.message = 'Something went wrong. Please try again';
						res.send(result);
						return;
					}

					if (!posts) {
						result.message = 'Invalid url title';
						res.send(result);
						return;
					}

					result.status = 'OK';
					result.data = posts;
					res.send(result);
				});
			}
		});
	});
	
	

	

	

	

	/*
	 * API get user by username
	 */
	app.get('/api/v1/user/:username', function (req, res) {
		var username = req.params.username;

		models.User.findOne({'local.username' : username}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
			} else {
				// remove some sensitive information before returning json
				var profilePicture;

				user.local.activationCode = undefined;
				user.local.passport = undefined;
				user.platforms = undefined;

				/* Get profile picture */
				Photo.findOne({'_id': user.profilePicture}, function (err, photo) {
					if (err) {
						throw err;
					}

					profilePicture = photo;

					var returned = {
						'_id': user.id,
						'local': {
							'lastName': user.local.lastName,
							'firstName': user.local.firstName,
							'username': user.local.username,
							'email': user.local.email
						},
						'educations': user.educations,
						'experiences': user.experiences,		
						'profilePicture': photo
					};

					console.log(returned);

					res.send({'status': 'OK', 'results' : returned});
				});
			}
		});
	});

	/*
	 * API get posts by username
	 */
	app.get('/api/v1/user/posts/:username', function (req, res) {
		var username = req.params.username;

		models.User.findOne({'local.username' : username}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
			} else {
				Post.find({authors: user.id}, function (err, posts) {
					console.log('Find posts: ' + JSON.stringify(posts));
				});
			}
		});		
	});

	app.post('/api/v1/user/crop', function (req, res) {
		var loginToken = req.body.loginToken;
		var imagePath = req.session.imageTempPath;

		/* Check if the temporary image path exists */
		if (!imagePath) {
			res.send({'status' : 'FAILED', 'error_message': 'No file uploaded.'});
		}

		/* Check if user is authorized to crop image */
		if (!loginToken) {
			res.send({'status' : 'FAILED', 'error_message': 'Invalid user.'});
		}

		/* Crop image and set image as profile picture */		
		var x = req.body.x;
		var y = req.body.y;
		var w = req.body.w;
		var h = req.body.h;

		var relativePath = '/public/img/profile_temp/';
        var lastIndex = __dirname.lastIndexOf('/');
        var appDir = __dirname.substring(0, lastIndex );

        var imgLocalUrl = appDir + relativePath + imagePath;

        models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
				return;
			}
			console.log('Login Token: ' + loginToken);
			console.log(user);

			gm(imgLocalUrl).crop(w, h, x, y).write(imgLocalUrl, function (err) {
				if (err) {
					res.send({'status' : 'FAILED', 'error_message': 'Unable to crop image: ' + err});
				} else {
					var result = {
						url: 'http://localhost:5000/img/profile_temp/' + imagePath
					}

					/* Save photo */
					var photo = new Photo();
					photo.filename = imagePath;
					photo.relativePath = imgLocalUrl;
					photo.url = result.url;
					photo.user = user;

					photo.save(function (err) {
						if (err) {
							console.log(err);
						}

						user.profilePicture = photo;
						console.log('Profile Photo: ' + user.profilePicture);

						user.save(function (err) {
							if (err) {
								console.log(err);	
							}
							
							console.log(user);
						});

						// set image as profile picture
						res.send({'status' : 'OK', 'results': result});
					});
					
				}
			});
			
		});		
	});

	/*
	 * This endpoint is to save uer profile picture. Note that unless user do cropping on his
	 * profile picture, it is still considered null photo.
	 * We will store this photo in a tempopary folder and return to client a JSON contained its path
	 * for end user cropping.
	 */
	app.post('/api/v1/user/photo/jquery-upload', function (req, res) {
		var loginToken = req.body.loginToken;
		console.log('Login Token: ' + loginToken);
		console.log(req.files);

		var originalFilename = req.files.file.originalFilename;
		var path = req.files.file.path;
		//var contentType = req.files.content-type;
		var size = req.files.file.size;

		/* Delete previous image saved in session */
		var prevImg = req.session.imageTempPath;

		if (prevImg) {
			fs.unlink(prevImg, function (err, data) {
				console.log('Removed previous image: ' + prevImg);
			});
		}

		var uuid1 = uuid.v1();

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
				return;
			}

			if (req.files.file.size == 0)
                res.send({'status' : 'FAILED', 'error_message': 'No file uploaded.'});
            else {
                var file = req.files.file;

                /* temp path */
                var tempPath = file.path;

                var relativePath = '/public/img/profile_temp/';
                var lastIndex = __dirname.lastIndexOf('/');
                var appDir = __dirname.substring(0, lastIndex );

                /* Path for resized image */
                var resizeNewPath = uuid1 + '_resized_'  + originalFilename;

                var imgLocalUrl = appDir + relativePath + resizeNewPath;

                /* resize image */
                gm(tempPath).resize(480).write(imgLocalUrl, function (err) {
                   	if (!err) {
                   		console.log('Image resized');
                   		// save file path to cookie for later cropping.
		                req.session.imageTempPath = resizeNewPath;

		                var result = {
                        	file: {
	                        	name: originalFilename,
	                        	size: size,
	                        	url: 'http://localhost:5000/img/profile_temp/' + resizeNewPath
							}
                        };

		                res.send({'status': 'OK', 'results' : result});

                   	} else {
                   		console.log(err);
                   		res.send({'status': 'FAILED', 'error_message' : 'File does not exist.'});
                    }
                });
            }
		});
	});

	/*
	 *	Remove education from user
	 */
	app.post('/api/v1/user/edu/remove', function (req, res) {
		var loginToken = req.body.loginToken;
		var eduId = req.body.eduId;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		// Find current user with login token
		models.User.findOneAndUpdate({'platforms.token' : loginToken}, {
			$pull: {
				'educations' : { '_id': eduId} 
			}
		}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Unable to remove education record. Please try again later';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'There is no user account affiliated with this token.';
				res.send(result);
				return;
			}
			result.status = 'OK';
			res.send(result);
		});
	});

	/*
	 *	Remove education from user
	 */
	app.post('/api/v1/user/exp/remove', function (req, res) {
		var loginToken = req.body.loginToken;
		var expId = req.body.expId;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		// Find current user with login token
		models.User.findOneAndUpdate({'platforms.token' : loginToken}, {
			$pull: {
				'experiences' : { '_id': expId} 
			}
		}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Unable to remove experience record. Please try again later';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'There is no user account affiliated with this token.';
				res.send(result);
				return;
			}
			result.status = 'OK';
			res.send(result);
		});
	});

	app.post('/api/v1/user/exp/add', function (req, res) {
		var loginToken = req.body.loginToken;
		var company = req.body.company;
		var title = req.body.title;
		var location = req.body.location;
		var description = req.body.description;
		var isWorking = req.body.isWorking;
		var dateStarted = {
			day: req.body.dateStarted.day,
			month: req.body.dateStarted.month,
			year: req.body.dateStarted.year
		};
		var dateEnded = {
			day: req.body.dateEnded.day,
			month: req.body.dateEnded.month,
			year: req.body.dateEnded.year
		};

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			var result = {
				status: 'FAILED',
				message: '',
				data: null
			};

			if (err) {
				console.log(err);
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'Invalid login token.';
				res.send(result);
				return;
			}

			var exp = new Experience();
			exp.company = company;
			exp.title = title;
			exp.location = location;
			exp.description = description;
			exp.isWorking = isWorking;
			exp.dateStarted.day = dateStarted.day;
			exp.dateStarted.month = dateStarted.month;
			exp.dateStarted.year = dateStarted.year;

			exp.dateEnded.day = dateEnded.day;
			exp.dateEnded.month = dateEnded.month;
			exp.dateEnded.year = dateEnded.year;
			exp.user = user;

			exp.save(function (err) {
				if (err) {
					console.log(err);
					result.message = 'Unable to add experience to your profile';
					result.data = err;
					res.send(result);
					return;
				}

				result.status = 'OK';
				result.data = exp;
				res.send(result);
			})
		});
	});

	/*
	 *	Add new education to user profile
	 */
	app.post('/api/v1/user/edu/add', function (req, res) {
		var loginToken = req.body.loginToken;
		var school = req.body.school;
		var degree = req.body.degree;
		var studyField = req.body.studyField;
		var dateStarted = {
			day: req.body.dateStarted.day,
			month: req.body.dateStarted.month,
			year: req.body.dateStarted.year
		};
		var dateEnded = {
			day: req.body.dateEnded.day,
			month: req.body.dateEnded.month,
			year: req.body.dateEnded.year
		};
		var activities = req.body.activities;
		var description = req.body.description;
		var educationLevel = req.body.educationLevel;

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			var result = {
				status: 'FAILED',
				message: '',
				data: null
			};

			if (err) {
				console.log(err);
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'Invalid login token.';
				res.send(result);
				return;
			}

			var edu = new models.Education();
			edu.school = school;
			edu.degree = degree;
			edu.studyField = studyField;
			edu.dateStarted.day = dateStarted.day;
			edu.dateStarted.month = dateStarted.month;
			edu.dateStarted.year = dateStarted.year;
			edu.dateEnded.day = dateEnded.day;
			edu.dateEnded.month = dateEnded.month;
			edu.dateEnded.year = dateEnded.year;
			edu.activities = activities;
			edu.description = description;
			edu.educationLevel = educationLevel;

			user.educations.push(edu);
			user.save(function (err) {
				if (err) {
					console.log(err);
					result.message = 'Unable to add education to your profile';
					result.data = err;
					res.send(result);
					return;
				}

				result.status = 'OK';
				result.data = edu;
				res.send(result);
			})
		});
	});

	/*
	 * Get list year started and year ended for education.
	 * 
	 */
	app.get('/api/v1/utils/edu/years', function (req, res) {
		var date = new Date();
		var year = date.getFullYear();
		var data = {
			yearStarted: [],
			yearEnded: []
		};

		/* Get year started */
		for (var i = 0; i < 80; i++) {
			data.yearStarted.push(year - i);
		}

		/* Get year ended */
		var yearUpper = year + 7;
		for (var i = 0; i < 80; i++) {
			data.yearEnded.push(yearUpper - i);
		}

		res.send({'status': 'OK', 'message': null, 'data' : data});
	});

	app.post('/api/v1/user/photo/upload', function (req, res) {
		var loginToken = req.body.loginToken;
		var isProfilePicture = false;

		if (req.body.isProfilePicture) {
			isProfilePicture = req.body.isProfilePicture;
		}

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
				return;
			}

			if (req.files.length == 0 || req.files.file.size == 0)
                res.send({'status' : 'FAILED', 'error_message': 'No file uploaded.'});
            else {
                var file = req.files.file;
                var relativePath = '/public/img/';

                fs.readFile(file.path, function (err, data) {
                    var newPath = __dirname + relativePath + file.name;
                    fs.writeFile(newPath, data, function (err) {
                        console.log('Uploaded: ' + newPath);

                        // remove temporary file
                        fs.unlink(file.path, function (err) {
                            if (err)
                                console.log(JSON.stringify(err));
                                
                        });

                        // save to database
                        var photo = new models.Photo();
                        photo.filename = file.name;
                        photo.relativePath = relativePath;
                        photo.caption = '';
                        photo.user = user;

                        photo.save(function (err) {
                        	if (err) {
                        		console.log('Error saving photo: ' + JSON.stringify(photo));
                        		return;
                        	}

                        	if (isProfilePicture) {
                        		user.profilePicture = photo;
                        	}

                        	res.send({'status': 'OK', 'results' : file});
                        });

                        
                    });
                });                
            }
		});
	});

	// Individual user page
	app.get('/:username', function (req, res) {

		// Get target username from url query
		var targetUsername = req.params.username;

		console.log('Username: ' + targetUsername);
		console.log(req.params);

		

		/* Get login token from session */
		var loginToken = null;
		if (req.session.loginToken) {
			loginToken = req.session.loginToken;
		}

		/* Render user page with target username and login token */
		res.render('user.ejs', {

					targetUsername: targetUsername, loginToken: loginToken
				});

		// models.User.findOne({'local.username' : username}, function (err, user) {
		// 	if (err) {
		// 		throw err;
		// 	}

		// 	if (!user) {
		// 		// User not found
		// 		res.render('user.ejs', {

		// 			loggedInUser: loggedInUser, targetUser: null, loginToken: loginToken
		// 		});

		// 	} else {
		// 		// User not found
		// 		res.render('user.ejs', {
		// 			loggedInUser: loggedInUser, 
		// 			targetUser: user,
		// 			loginToken: loginToken
		// 		});
		// 	}		
		// });

	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}

	// if they aren't redirect them to the home page
	res.redirect('/login');
}