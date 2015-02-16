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

var GlobalFunction = require('../../app/utils/global_function');

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

var UserRoute = function(app, passport) { 
	this.app = app;
	this.passport = passport;
};

/**
 * Find page that authenticated user is managing.
 * 
 * @param  {String} userId - Data submitted from web form.
 * @return [ActionResult]
 */
UserRoute.prototype.managePage = function (userId, pageId, callback) {

	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ $and: [ {'_id': pageId }, {'admins': user._id}]}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return callback(result);
			}

			require('crypto').randomBytes(48, function (ex, buf) {
            	var adminToken = buf.toString('hex');

            	var adminLogin = {
					admin: user,
					token: adminToken
				}

				page.adminLogins.push(adminLogin);
				page.save(function (err) {
					if (err) {
						console.log(err);
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = true;
					result.data = adminLogin;
					return callback(result);
				});
        	});
		});	
	});
}

/**
 * Find page that authenticated user is managing.
 * 
 * @param  {String} userId - Data submitted from web form.
 * @return [ActionResult]
 */
UserRoute.findManagingPage = function (userId, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	Page.findOne({ admins: userId}, function (err, page) {
		if (err) {
			return callback(err);
		}

		if (!page) {
			return callback(null);
		}

		// Find page data
		var findLogo = function (photoId, callbackParallel) {
			console.log('Find logo: ' + photoId);
			GlobalFunction.findProfilePicture(photoId, function (photo) {
				console.log(photo);
				callbackParallel(null, photo);
			});
		};

			// Find cover
			var findCover = function (photoId, callbackParallel) {
				GlobalFunction.findCoverPicture(photoId, function (cover) {
					callbackParallel(null, cover);
				});
			};

			// Find City
			var findCity = function (cityId, callbackParallel) {
				City.findById(cityId, function (err, city) {
					if (err) {
						callbackParallel(err);
					} else {
						callbackParallel(null, city);
					}
				});
			}

			// Find Country
			var findCountry = function (countryId, callbackParallel) {
				Country.findById(countryId, function (err, country) {
					if (err) {
						callbackParallel(err);
					} else {
						callbackParallel(null, country);
					}
				});
			}

			// async query
			// async
			async.parallel({
				logo: function (next) {
					findLogo(page.coverPhoto, next);
				},
				cover: function (next) {
					findCover(page.coverPhoto, next);
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
						address1: page.address1,
						address2: page.address2,
						city: city,
						country: country
					},
					logo: logo,
					cover: cover,
				}

				return callback(pageJson);
			});
		});
}

/**
 * Create new page.
 * 
 * @param  {String} username - Data submitted from web form.
 * @param  {User} user - authenticated user.
 * @return [ActionResult]
 */
UserRoute.prototype.findCompanyByUsername = function (username, userId, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	User.findById(userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		//console.log('Find page: ' + username);
		// Find company page
		Page.findOne({ username: username}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);	
			}

			//console.log('Username: ' + username);

			// Return page not found
			if (!page) {
				result.message = constants.ERROR9002;
				return callback(result);
			}

			// Find logo
			var findLogo = function (photoId, callbackParallel) {
				GlobalFunction.findProfilePicture(photoId, function (photo) {
					callbackParallel(null, photo);
				});
			};

			// Find cover
			var findCover = function (photoId, callbackParallel) {
				console.log('photo: ' + photoId);
				GlobalFunction.findCoverPicture(photoId, function (cover) {
					console.log(cover);
					callbackParallel(null, cover);
				});
			};

			// Find City
			var findCity = function (cityId, callbackParallel) {
				City.findById(cityId, function (err, city) {
					if (err) {
						callbackParallel(err);
					} else {
						callbackParallel(null, city);
					}
				});
			}

			// Find Country
			var findCountry = function (countryId, callbackParallel) {
				Country.findById(countryId, function (err, country) {
					if (err) {
						callbackParallel(err);
					} else {
						callbackParallel(null, country);
					}
				});
			}

			// async query
			// async
			async.parallel({
					logo: function (next) {
						findLogo(page.coverPhoto, next);
					},
					cover: function (next) {
						findCover(page.coverPhoto, next);
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
							address1: page.address1,
							address2: page.address2,
							city: city,
							country: country
						},
						logo: logo,
						cover: cover,
					}

					result.status = true;
					result.data = pageJson;

					return callback(result);
				});
			});
});
}

/**
 * Create new page.
 * 
 * @param  {Json} data - Data submitted from web form.
 * @param  {Function} callbacl - Callback function.
 * @return [ActionResult]
 */
UserRoute.prototype.createNewPage = function (data, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	// Find authenticated user
	User.findById(data.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		// Check if page's username has already been taken
		Page.findOne({username: data.username}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (page) {
				result.message = constants.ERROR9015;
				return callback(result);
			}

			// Find City
			City.findById(data.city, function (err, city) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				if (!city) {
					result.message = 'This city is not support yest';
					return callback(result);
				}

				// Find Country
				Country.findById(data.country, function (err, country) {
					if (err) {
						result.message = constants.ERROR2000;
						return callback(result);
					}

					if (!country) {
						result.message = 'This country is not support yest';
						return callback(result);
					}

					//console.log(data);

					// Create new page
					var page = new Page();
					page.name = data.companyName;
					page.username = data.username;
					page.address.address1 = data.address1;
					page.address.address2 = data.address2;
					page.address.city = city;
					page.address.country = country;
					page.address.postalCode = data.postalCode;
					page.address.phone = data.phone;
					page.pageType = data.pageType;
					page.website = data.url;
					page.about = data.about;
					page.yearFounded = data.yearFounded;
					page.admins.push(user);

					// Assign this new page to the authenticated user. We dont maintain list of
					// admin users in the page because not all users managing page. So it's better
					// to assign page to individual.
					//user.pageManaging = page;
					page.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return callback(result);
						}

						// return json to request
						result.status = true;
						result.data = page;

						return callback(result);
					});
				});
			});
		});
	});
};

/**
 * Get all replies of a particular comment.
 * 
 * @param  {String} commentId - Comment Id.
 * @param  {Function} callback - Callback function.
 * @return [{Replies}]
 */
UserRoute.findReplies = function (commentId, authenticatedUserId, callback) {
	var replies = [];

	Comment.find({parentId: commentId}, function (err, replies) {
		if (err) {
			console.log(err);
			return callback(replies);
		}

		// Find commenter for each replie
		var replyObject = {
			findReplies: function (reply, callbackMap) {

				// Find commenter
				var findCommenter = function (commenterId, callbackParallel) {
					User.findById(commenterId, function (err, commenter) {
						if (err) {
							callbackParallel(err);
						} else {

							// Find profile picuter of commenter
							Photo.findById(commenter.profilePicture, function (err, photo) {
								if (err) {
									callbackParallel(err);
								} else {
									var authorJson = {
										_id: commenter._id,
										username: commenter.local.username,
										firstName: commenter.local.firstName,
										lastName: commenter.local.lastName,
										profilePicture: null
									}

									if (photo) {
										authorJson.profilePicture = photo.url;
									}

									callbackParallel(null, authorJson);
								}
							});
						}
					});
				}

				// Find likes
				var findLikes = function (replyId, callbackParallel) {
					Like.find({parentId: replyId}, function (err, likes) {
						if (err) {
							callbackParallel(err);
						} else {
							callbackParallel(null, likes);
						}
					});
				}

				// Find if authenticated user likes this reply
				var findLiked = function (replyId, authenticatedUserId, callbackParallel) {
					if (authenticatedUserId) {
						Like.findOne({ $and: [{ parentId: replyId}, {liker: authenticatedUserId}]}, function (err, like) {
							if (err) {
								callbackParallel(err);
							} else {
								if (like) {
									callbackParallel(null, true);
								} else {
									callbackParallel(null, false);
								}
							}
						});
					} else {
						callbackParallel(null, false);
					}
				};

				// async parallel call
				// async
				async.parallel({
					comenter: function (next) {
						findCommenter(reply.commenter, next);
					},
					likes: function (next) {
						findLikes(reply._id, next);
					},
					liked: function (next) {
						findLiked(reply._id, authenticatedUserId, next);
					}
				}, function (err, results) {
					var commenter 		= results.comenter;
					var likes 	= results.likes;
					var liked   = results.liked;

					var replyJson = {
						_id: reply._id,
						content: 	_.unescape(reply.content),
						dateCreated: reply.dateCreated,
						author: commenter,
						likes: likes,
						liked: liked
					}
					callbackMap(null, replyJson);
				});
			}
		};

		// async map
		async.map(replies, replyObject.findReplies.bind(replyObject), function (err, callbackResult) {
			return callback(callbackResult);
		});
	});
};

/**
 * Get the first attachment of the specified type.
 * 
 * @param  {String} username - attachment type
 * @return [{User}]
 */
UserRoute.prototype.findArticle = function (username, slug, loginUser, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	User.findOne({ 'local.username': username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		//console.log(username + ' ' + slug);

		// Find all articles of username
		Article.find({ $and: [{ author: user._id }, { slug: slug}]  }, function (err, articles) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			var userArticles = [];
			for (var i = 0; i < articles.length; i++) {
				var userArticle = {
					_id: articles[i]._id,
					title: articles[i].title,
					slug: articles[i].slug,
					tags: articles[i].tags,
					content: _.unescape(articles[i].content),
					category: articles[i].category,
					privacy: articles[i].privacy,
					dateCreated: articles[i].dateCreated,
					loginUser: loginUser,
					author: {
						_id: user._id,
						username: user.local.username,
						firstName: user.local.firstName,
						lastName: user.local.lastName
					}
				}
				userArticles.push(userArticle);
			}

			// for each article, find tags, category, privacy...
			var articleObject = {
					findArticle: function (article, callbackMap) {

						// find article's tags
						var findTags = function (tags, callbackParallel) {
							Tag.find({ _id : { $in: tags }}, function (err, tags) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, tags);
								}
							});
						}

						// find article's category
						var findCategory = function (categoryId, callbackParallel) {
							Category.findById(categoryId, function (err, category) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, category);
								}
							});
						};

						// find article's privacy
						var findPrivacy = function (privacyId, callbackParallel) {
							PrivacySetting.findById(privacyId, function (err, privacy) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, privacy);
								}
							});
						};

						// Find likes
						var findLikes = function (articleId, callbackParallel) {
							Like.find({'parentId': articleId}, function (err, likes) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, likes);
								}
							});
						};

						// Find liked
						var findLiked = function (articleId, userId, callbackParallel) {
							if (userId) {
								Like.findOne({ $and: [{ parentId: articleId}, {liker: userId}]}, function (err, like) {
								if (err) {
									callbackParallel(err);
								} else {
									if (like) {
										callbackParallel(null, true);
									} else {
										callbackParallel(null, false);
									}
									
								}
							});
							} else {
								callbackParallel(null, false);
							}
							
						};

						// Find comments
						var findComments = function (articleId, userId, callbackParallel) {
							Comment.find({parentId: articleId}, function (err, comments) {
								if (err) {
									callbackParallel(err);
								} else {

									var commentArray = [];
									for (var i = 0; i < comments.length; i++) {
										var commentArrayJson = {
											_id: comments[i]._id,
											commenter: comments[i].commenter,
											dateCreated: comments[i].dateCreated,
											content: comments[i].content,
											loginUserId: userId
										}
										commentArray.push(commentArrayJson);
									}

									// Find comment data. For each comment we have to find number of likes, replies, commenter data
									var commentObject = {
										findCommentData : function(comment, commentCallbackMap) {

											// Find commenter data
											var findCommenter = function (commenterId, commentCallbackParallel) {
												User.findById(commenterId, function (err, commenter) {
													if (err) {
														commentCallbackParallel(err);
													} else {

														// Find profile picture
														Photo.findById(commenter.profilePicture, function (err, photo) {
															if (err) {
																commentCallbackMap(err);
															} else {
																var commenterJson = {
																	_id: commenter._id,
																	username: commenter.local.username,
																	firstName: commenter.local.firstName,
																	lastName: commenter.local.lastName,
																	profilePicture: photo.url
																}
																commentCallbackParallel(null, commenterJson);
															}
														});

														
													}
												});
											};

											var findCommentLikes = function (commentId, commentCallbackParallel) {
												Like.find({parentId: commentId}, function (err, commentLikes) {
													if (err) {
														commentCallbackParallel(err);
													} else {
														commentCallbackParallel(null, commentLikes);
													}
												});
											};

											var findCommentLiked = function (commentId, loginUserId, commentCallbackParallel) {
												Like.findOne({ $and: [{parentId: commentId}, {liker: loginUserId}]}, function (err, commentLiked) {
													if (err) {
														commentCallbackParallel(err);
													}

													if (commentLiked) {
														commentCallbackParallel(null, true);
													} else {
														commentCallbackParallel(null, false);
													}
												});
											};

											// var findReply = function (commentId, commentCallbackParallel) {
											// 	Comment.find({parentId: commentId}, function (err, replies) {
											// 		if (err) {
											// 			commentCallbackParallel(err);
											// 		} else {
											// 			// For each reply, find commenter
											// 			commentCallbackParallel(null, replies);
											// 		}
											// 	});
											// };

											var findReply = function (commentId, loginUserId, commentCallbackParallel) {
												UserRoute.findReplies(commentId, loginUserId, function (replies) {
													commentCallbackParallel(null, replies);
												})
											}

											// async
											async.parallel({
												commenter: function (next) {
													findCommenter(comment.commenter, next);
												},
												commentLikes: function (next) {
													findCommentLikes(comment._id, next);
												},
												commentLiked: function (next) {
													findCommentLiked(comment._id, comment.loginUserId, next);
												},
												findReplies: function (next) {
													findReply(comment._id, comment.loginUserId, next);
												}
											}, function (err, results) {
												var commenter 		= results.commenter;
												var commentLikes 	= results.commentLikes;
												var commentLiked 	= results.commentLiked;
												var replies 		= results.findReplies;

												if (!results.commentLikes) {
													commentLikes = [];
												}

												var commentJson = {
													_id: comment._id,
													dateCreated: comment.dateCreated,
													content: _.unescape(comment.content),
													commenter: commenter,
													commentLikes: commentLikes,
													commentLiked: commentLiked,
													replies: replies
												};

												commentCallbackMap(null, commentJson);
												//return callback(result);
											});
										}
									};

									async.map(commentArray, commentObject.findCommentData.bind(commentObject), function (err, commentCallbackResult) {
										//console.log(commentCallbackResult);
										callbackParallel(null, commentCallbackResult);
									});

									
								}
							});
						};

						var loginUserId = null;

						if (article.loginUser != null) {
							loginUserId = article.loginUser._id;
						}

						// async
						async.parallel({
							tags: function (next) {
								findTags(article.tags, next);
							},
							category: function (next) {
								findCategory(article.category, next);
							},
							privacy: function (next) {
								findPrivacy(article.privacy, next);
							},
							likes: function (next) {
								findLikes(article._id, next);
							},
							liked: function (next) {
								findLiked(article._id, loginUserId, next);
							},
							comments: function (next) {
								findComments(article._id, loginUserId, next);
							}
						}, function (err, results) {
							var tags 		= results.tags;
							var category 	= results.category;
							var privacy 	= results.privacy;
							var likes 		= results.likes;
							var liked 		= results.liked;
							var comments 	= results.comments;

							// check for privacy. Only return article to appropriate user
							// calculate date time different
							var now = new Date();
							var timeDiff = Math.abs(now.getTime() - article.dateCreated.getTime()) / 1000; // in second
							
							var art = {
								_id: 		article._id,
								title: 		article.title,
								content: 	_.unescape(article.content),
								slug: 		article.slug,
								tags: 		tags,
								category: 	category,
								privacy: 	privacy,
								likes:      likes,
								liked:      liked,
								comments: 	comments,
								dateCreated: article.dateCreated,
								author: {
									_id: 		article.author._id,
									username: 	article.author.username,
									firstName: 	article.author.firstName,
									lastName: 	article.author.lastName
								}
							}

							callbackMap(null, art);
							//return callback(result);
						});
					}
				}

				async.map(userArticles, articleObject.findArticle.bind(articleObject), function (err, callbackResult) {
					//console.log(callbackResult);
					// return all article
					result.status = true;
					result.data = callbackResult[0];
					return callback(result);
				});
		});
	});
};

/**
 * Get the first attachment of the specified type.
 * 
 * @param  {String} username - attachment type
 * @return [{User}]
 */
UserRoute.prototype.findPeopleSuggestions = function (username, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	User.findOne({ 'local.username': username }, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		// Exclude people in user's connection
		// Get user following
		Follow.find({ user: user._id}, function (err, follows) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			var followingUsers = [];
			followingUsers.push(user._id);

			for (var i = 0; i < follows.length; i++) {
				followingUsers.push(follows[i].following);
			}

			// exclude these people
			User.find({ _id: { $nin: followingUsers }}, function (err, users) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				var profileObject = {
					findProfilePhoto: function (userObject, callbackMap) {
						Photo.findById(userObject.profilePicture, function (err, photo) {
							if (err) {
								callbackMap(err);
							} else {
								var userObject1 = {
									_id: userObject._id,
									firstName: userObject.local.firstName,
									lastName: userObject.local.lastName,
									username: userObject.local.username,
									profilePicture: photo
								};
								callbackMap(null, userObject1);
							}
						});
					}
				}

				async.map(users, profileObject.findProfilePhoto.bind(profileObject), function (err, callbackResult) {
					// return all article
					result.status = true;
					result.data = callbackResult;
					return callback(result);
				});
			});
		});
	});
};

/**
 * Get the first attachment of the specified type.
 * 
 * @param  {String} username - attachment type
 * @return [{User}]
 */
UserRoute.prototype.findFollowing = function (username, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	User.findOne({ 'local.username': username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		// Find all following
		Follow.find({ user: user._id }, function (err, following) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			// A list of following will be returned. Find all following's information.
			// for each article, find tags, category, privacy...
			var articleObject = {
				findArticle: function (followingObject, callbackMap) {
					User.findById(followingObject.following, function (err, user) {
							if (err) {
								callbackMap(err);
							} else {
								// Find profile photo
								Photo.findById(user.profilePicture, function (err, photo) {
									if (err) {
										callbackMap(err);
									}

									var userObject = {
										_id: user._id,
										firstName: user.local.firstName,
										lastName: user.local.lastName,
										username: user.local.username,
										profilePicture: photo
									}

									callbackMap(null, userObject);
								});
							}
						});
				}
			}

			async.map(following, articleObject.findArticle.bind(articleObject), function (err, callbackResult) {
				// return all article
				result.status = true;
				result.data = callbackResult;
				return callback(result);
			});
		});
	});
}

/**
 * Get the first attachment of the specified type.
 * 
 * @param  {String} username - attachment type
 * @return [{User}]
 */
UserRoute.prototype.findFollowers = function (username, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	User.findOne({ 'local.username': username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		// Find all following
		Follow.find({ following: user._id }, function (err, followers) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			// A list of following will be returned. Find all following's information.
			var articleObject = {
				findArticle: function (followingObject, callbackMap) {
					User.findById(followingObject.user, function (err, user) {
							if (err) {
								callbackMap(err);
							} else {							

								// Find profile photo
								Photo.findById(user.profilePicture, function (err, photo) {
									if (err) {
										callbackMap(err);
									}

									var userObject = {
										_id: user._id,
										firstName: user.local.firstName,
										lastName: user.local.lastName,
										username: user.local.username,
										profilePicture: photo
									}

									callbackMap(null, userObject);
								});
							}
						});
				}
			}

			async.map(followers, articleObject.findArticle.bind(articleObject), function (err, callbackResult) {
				// return all article
				result.status = true;
				result.data = callbackResult;
				return callback(result);
			});
		});
	});
}

/**
 * Find settings by user
 *
 */
UserRoute.prototype.findSettings = function (userId, callback) {
	var result = {
		status: false,
		message: '',
		data: null,
		errors: []
	};

	// find privacy setting
	var findPrivacySettings = function (userId, callback) {
		PrivacySetting.find({}, function (err, settings) {
			if (err) {
				callback(err);
			} else {
				callback(null, settings);
			}
		});
	};

	// find categories
	var findCategories = function (user, callback) {
		Category.find({ $or: [ {slug: 'general'}, {user: userId} ]}, function (err, categories) {
			if (err) {
				callback(err);
			} else {
				callback(null, categories);
			}
		});
	};

	var settings = {
		privacies: null,
		categories: null
	}

	async.parallel({
		privacies: function (next) {
			findPrivacySettings(userId, next);
		},
		categories: function (next) {
			findCategories(userId, next);
		}
	}, function (err, results) {
		settings.privacies = results.privacies;
		settings.categories = results.categories;
					
		result.status = true;
		result.data = settings;
		return callback(result);	
	});
}

UserRoute.prototype.findTags = function (keyword, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	var re = new RegExp(keyword, 'i');

	Tag.find({ name: { $regex: re }	}, function (err, tags) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}
		result.status = true;
		result.data = tags;
		return callback(result);
	});
}

UserRoute.prototype.findCountries = function (keyword, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	var re = new RegExp(keyword, 'i');

	Country.find({ name: { $regex: re }	}, function (err, countries) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}
		result.status = true;
		result.data = countries;
		return callback(result);
	});
};

UserRoute.prototype.findCities = function (keyword, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	var re = new RegExp(keyword, 'i');

	City.find({ name: { $regex: re }	}, function (err, cities) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		// look up country of these cities
		var cityObject = {
			findCity: function (city, callbackMap) {
				Country.findById(city.country, function (err, country) {
					if (err) {
						callbackMap(err);
					} else {
						var cityJson = {
							_id: city._id,
							name: city.name,
							country: {
								_id: country._id,
								name: country.name,
							}
						};
						callbackMap(null, cityJson);
					}
				});
			}
		};

		async.map(cities, cityObject.findCity.bind(cityObject), function (err, callbackResult) {
			// return all article
			result.status = true;
			result.data = callbackResult;
			return callback(result);
		});
	});
};

UserRoute.prototype.addLanguage = function (language, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(language.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		var newlanguage = new Language();
		newlanguage.language = language.language;
		newlanguage.proficiency = language.proficiency;
		newlanguage.user = user;

		newlanguage.save(function (err) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			result.status = true;
			result.data = newlanguage;
			return callback(result);
		});
	});
};

UserRoute.prototype.addTag = function (tag, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(tag.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		var newTag = new Tag();
		newTag.name = tag.name;
		newTag.slug = tag.slug;
		newTag.save(function (err) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}
			result.status = true;
			result.data = newTag;
			return callback(result);
		});
	});
};


UserRoute.prototype.addCategory = function (category, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(category.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		var newCategory = new Category();
		newCategory.name = category.name;
		newCategory.slug = category.slug;
		newCategory.user = user;

		newCategory.save(function (err) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}
			result.status = true;
			result.data = newCategory;
			return callback(result);
		});
	});
};

UserRoute.prototype.test = function (req, res) {
	var result = {
		status: 'FAILED',
		message: 'Test Javascript class',
		data: null
	};
	var dummy = new Dummy();
	dummy.a = 20;

	dummy.save(function (err) {
		if (err) {
			result.message = 'Unable to save dummy to database'.
			res.send(result);
			return;
		}

		result.status = 'OK';
		result.message = 'Dummy was saved successfully.';
		result.data = dummy;
		res.send(result);
	});	
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


/*
 *	Find user by username
 *	Required:
 *		@username: String
 */
UserRoute.prototype.findUserByUsernameAPI = function(req, res) {
	var username = req.params.username;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'local.username' : username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
		} else {
			if (!user) {
				result.message = constants.ERROR9002;
			} else {
				var userInfo = {
					'_id': user.id,
					'local': {
						'lastName': user.local.lastName,
						'firstName': user.local.firstName,
						'username': user.local.username,
						'email': user.local.email
					},
					'educations': user.educations,
					'experiences': user.experiences,		
					'profilePicture': null
				};

				/* Get profile picture */
				Photo.findOne({'_id': user.profilePicture}, function (err, photo) {
					if (err) {

					}

					if (photo) {
						userInfo.profilePicture = photo;
					}					
				});
								
				result.status = 'OK';
				result.data = userInfo;
			}
		}
		res.send(result);			
	});
}


/**
 * Find user/company/school by username. Priority will be given to user first.
 * If user is not found, continue looking up username in company/school table.
 * 
 * @param  {String} username - Username that need to query.
 * @param  {Function} callbacl - Callback function.
 * @return [ActionResult]
 */
UserRoute.prototype.findByUsername = function (username, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findOne({'local.username' : username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);	
		} 
		if (!user) {
			//console.log('Find page: ' + username);
			// Find page
			Page.findOne({ username: username}, function (err, page) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);	
				}

				// Return page not found
				if (!page) {
					result.message = constants.ERROR9002;
					return callback(result);
				}

				// Find logo
				var findLogo = function (photoId, callbackParallel) {
					Photo.findById(photoId, function (err, logo) {
						if (err) {
							callbackParallel(err);
						} else {
							callbackParallel(null, logo);
						}
					});
				};

				// Find cover
				var findCover = function (photoId, callbackParallel) {
					Photo.findById(photoId, function (err, cover) {
						if (err) {
							callbackParallel(err);
						} else {
							callbackParallel(null, cover);
						}
					})
				};

				// Find City
				var findCity = function (cityId, callbackParallel) {
					City.findById(cityId, function (err, city) {
						if (err) {
							callbackParallel(err);
						} else {
							callbackParallel(null, city);
						}
					});
				}

				// Find Country
				var findCountry = function (countryId, callbackParallel) {
					Country.findById(countryId, function (err, country) {
						if (err) {
							callbackParallel(err);
						} else {
							callbackParallel(null, country);
						}
					});
				}


				// async query
				// async
				async.parallel({
					logo: function (next) {
						findLogo(page.coverPhoto, next);
					},
					cover: function (next) {
						findCover(page.coverPhoto, next);
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
							address1: page.address1,
							address2: page.address2,
							city: city,
							country: country
						}
					}

					result.status = true;
					result.data = pageJson;

					return callback(result);
				});
			});
		} else {
			//console.log('Find User');
			var userInfo = {
				'_id': user.id,
				'local': {
					'lastName': user.local.lastName,
						'firstName': user.local.firstName,
						'username': user.local.username,
						'email': user.local.email
					},
					birthday: {
						date: user.birthday.date,
						privacy: user.birthday.privacy
					},
					livesin: user.livesin,
					'educations': user.educations,
					'experiences': user.experiences,
					description : _.unescape(user.description),
					'languages': null,	
					'profilePicture': null,
					following: null,
					followers: null
				};

				// find education and experience with
				var findEducation = function (userId, callback) {
					Education.find({ user: userId}, function (err, educations) {
						if (err) {
							callback(err);
						} else {
							callback(null, educations);
						}
					})
				}

				// Find experience
				var findExperience = function (userId, callback) {
					Experience.find({ user: userId }, function (err, experiences) {
						if (err) {
							callback(err);
						} else {
							// Need to unescape   
							for (var i = 0; i < experiences.length; i++) {
								experiences[i].description = _.unescape(experiences[i].description);
							}
							callback(null, experiences);
						}
					});
				}

				// Find languages
				var findLanguages = function (userId, callback) {
					Language.find({ user: userId }, function (err, languages) {
						if (err) {
							callback(err);
						} else {
							callback(null, languages);
						}
					});
				};

				// Find profile photo
				var findProfilePhoto = function (profilePicture, callback) {
					/* Get profile picture */
					Photo.findById(profilePicture, function (err, photo) {
						
						if (err) {
							callback(err);
						} else {
							callback(null, photo);
						}			
					});
				};

				// Find following
				var findFollowing = function (userId, callback) {
					Follow.find({user: userId}, function (err, following) {
						if (err) {
							callback(err);
						} else {
							callback(null, following);
						}
					});
				};
				// Find followers
				var findFollowers = function (userId, callback) {
					Follow.find({following: userId}, function (err, followers) {
						if (err) {
							callback(err);
						} else {
							callback(null, followers);
						}
					});
				};

				async.parallel({
					educations: function (next) {
						findEducation(user._id, next);
					},
					experiences: function (next) {
						findExperience(user._id, next);
					},
					languages: function (next) {
						findLanguages(user._id, next);
					},
					profilePicture: function (next) {
						findProfilePhoto(user.profilePicture, next);
					},
					following: function (next) {
						findFollowing(user._id, next);
					},
					followers: function (next) {
						findFollowers(user._id, next);
					}
				}, function (err, results) {
					userInfo.educations = results.educations;
					userInfo.experiences = results.experiences;
					userInfo.followers = results.followers;
					userInfo.following = results.following;
					
					if (results.profilePicture != null) {
						userInfo.profilePicture = results.profilePicture.url;
					}
					
					userInfo.languages = results.languages;
					result.status = true;
					result.data = userInfo;
					return callback(result);
				});
			}
		
				
	});
}

/*
 *	Find user by username
 *	Required:
 *		@username: String
 */
UserRoute.prototype.findUserByUsername = function(username, callback) {

	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findOne({'local.username' : username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);	
		} else {
			if (!user) {
				result.message = constants.ERROR9002;
				return callback(result);	
			} else {
				var userInfo = {
					'_id': user.id,
					'local': {
						'lastName': user.local.lastName,
						'firstName': user.local.firstName,
						'username': user.local.username,
						'email': user.local.email
					},
					birthday: {
						date: user.birthday.date,
						privacy: user.birthday.privacy
					},
					livesin: user.livesin,
					'educations': user.educations,
					'experiences': user.experiences,
					description : _.unescape(user.description),
					'languages': null,	
					'profilePicture': null,
					following: null,
					followers: null,
					page:null
				};

				// find education and experience with
				var findEducation = function (userId, callback) {
					Education.find({ user: userId}, function (err, educations) {
						if (err) {
							callback(err);
						} else {
							callback(null, educations);
						}
					})
				}

				// Find experience
				var findExperience = function (userId, callback) {
					Experience.find({ user: userId }, function (err, experiences) {
						if (err) {
							callback(err);
						} else {
							// Need to unescape   
							for (var i = 0; i < experiences.length; i++) {
								experiences[i].description = _.unescape(experiences[i].description);
							}
							callback(null, experiences);
						}
					});
				}

				// Find languages
				var findLanguages = function (userId, callback) {
					Language.find({ user: userId }, function (err, languages) {
						if (err) {
							callback(err);
						} else {
							callback(null, languages);
						}
					});
				};

				// Find profile photo
				var findProfilePhoto = function (profilePicture, callback) {
					/* Get profile picture */
					Photo.findById(profilePicture, function (err, photo) {
						
						if (err) {
							callback(err);
						} else {
							callback(null, photo);
						}			
					});
				};

				// Find following
				var findFollowing = function (userId, callback) {
					Follow.find({user: userId}, function (err, following) {
						if (err) {
							callback(err);
						} else {
							callback(null, following);
						}
					});
				};
				// Find followers
				var findFollowers = function (userId, callback) {
					Follow.find({following: userId}, function (err, followers) {
						if (err) {
							callback(err);
						} else {
							callback(null, followers);
						}
					});
				};

				// Find page managing
				var findPageManaging = function (userId, callback) {
					UserRoute.findManagingPage(userId, function (pageResult) {
						callback(null, pageResult);
					});
				}

				async.parallel({
					educations: function (next) {
						findEducation(user._id, next);
					},
					experiences: function (next) {
						findExperience(user._id, next);
					},
					languages: function (next) {
						findLanguages(user._id, next);
					},
					profilePicture: function (next) {
						findProfilePhoto(user.profilePicture, next);
					},
					following: function (next) {
						findFollowing(user._id, next);
					},
					followers: function (next) {
						findFollowers(user._id, next);
					},
					page: function (next) {
						findPageManaging(user._id, next);
					}
				}, function (err, results) {
					userInfo.educations = results.educations;
					userInfo.experiences = results.experiences;
					userInfo.followers = results.followers;
					userInfo.following = results.following;
					userInfo.page = results.page;
					
					if (results.profilePicture != null) {
						userInfo.profilePicture = results.profilePicture.url;
					}
					
					userInfo.languages = results.languages;
					result.status = true;
					result.data = userInfo;
					return callback(result);	
				});
			}
		}
				
	});
}

/*
 *	Find user by username
 *	Required:
 *		@username: String
 */
UserRoute.prototype.findUserByEmail = function(req, res) {
	var email = req.params.email;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'local.email' : email}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
		} else {
			if (!user) {
				result.message = constants.ERROR9002;
			} else {
				var userInfo = {
					'_id': user.id,
					'local': {
						'lastName': user.local.lastName,
						'firstName': user.local.firstName,
						'username': user.local.username,
						'email': user.local.email
					},
					'educations': user.educations,
					'experiences': user.experiences,		
					'profilePicture': null
				};

				/* Get profile picture */
				Photo.findOne({'_id': user.profilePicture}, function (err, photo) {
					if (err) {

					}

					if (photo) {
						userInfo.profilePicture = photo;
					}

					
				});
				result.status = 'OK';
				result.data = userInfo;
			}
		}
		res.send(result);			
	});
}

/*
 *	Find user by username
 *	Required:
 *		@username: String
 */
UserRoute.prototype.terminateSession = function(userId, sessionId, callback) {

	var result = {
		status: false,
		message: null,
		data: null
	};

	User.findByIdAndUpdate(userId, {
			$pull: {
				'platforms' : { '_id': sessionId} 
			}
		}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
		} else {
			if (!user) {
				result.message = constants.ERROR9002;
			} else {
				result.status = true;
			}
		}
		return callback(result);
	});
}

/*
 * 		User login
 *		Required:
 *			@email
 *			@password
 *			@rememberme
 */
UserRoute.prototype.login = function (req, res, next) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			result.message = '';
		} else {
			if (!user) {
				result.message = info.message;
			} else {
				req.logIn(user, function (err) {
					if (err) {
						return next(err);
					}

					/* Check if web browser and remember me is ticked, then set cookie */
					// Code goes here

					var userInfo = {
						'_id': user.id,
						'local': {
							'lastName': user.local.lastName,
							'firstName': user.local.firstName,
							'username': user.local.username,
							'email': user.local.email
						},
						'loginToken': info.loginToken,
						'educations': user.educations,
						'experiences': user.experiences,		
						'profilePicture': null
					};

					result.status = 'OK';
					result.data = userInfo;
				});
			}
		}

		res.send(result);			
	})(req, res, next);
};

/*
 * 		User logout
 *		Required:
 *			@loginToken
 */
UserRoute.prototype.logout = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken = req.body.loginToken;

	// Find current user with login token
	User.findOneAndUpdate({'platforms.token' : loginToken}, {
		$pull: {
			'platforms' : { 'token': loginToken} 
		}
	}, function (err, user) {
		if (err) {
			result.message = constants.ERROR9010;
		} else {
			if (!user) {
				result.message = constants.ERROR9011;
			} else {
				req.logout();
				req.session.loginToken = undefined;
				result.status = 'OK';
			}
		}
		
		res.send(result);
	});
};

UserRoute.prototype.requestPasswordResetAPI = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var email = req.body.email;
	async.waterfall([
		function (done) {
			crypto.randomBytes(48, function (err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ 'local.email': email }, function (err, user) {
				if (err) {

				} else {
					if (!user) {
						result.message = constants.ERROR9009;
					} else {
						user.local.resetPasswordToken = token;
        				user.local.resetPasswordExpires = Date.now() + 3600000;

        				user.save(function (err) {
        					if (err) {
        					}
        					done(err, token, user);
        				});
					}
				}
			});
		},
		function (token, user, done) {
			var smtpTransport = nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "tranhungnguyen@gmail.com",
			        pass: "Hungnguyen"
			    }
			});

			var mailOptions = {
		        to: user.local.email,
		        from: 'tranhungnguyen@gmail.com',
		        subject: 'Node.js Password Reset',
		        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
		          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		    };

		    // fucking async call while i want it non-async call
		    smtpTransport.sendMail(mailOptions, function(err) {
		    	if (err) {
		    	}
		        result.status = 'OK';

		        /* Only expose reset password token on development or testing mode */
		        if (process.env.NODE_ENV != 'production') {
		        	result.data = {
		        		userId: user._id,
		        		resetToken: token
		        	}
		        }		        
		        done(err, 'done');
		    });
		}
	], function (err) {
			if (err) {
				console.log('Error');
				next(err);
			} else {
				console.log('Result');
				res.send(result);
			}
		});
};

UserRoute.prototype.requestPasswordReset = function (email, host, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	console.log('Request Password Reset: ' + host);

	async.waterfall([
		function (done) {
			crypto.randomBytes(48, function (err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ 'local.email': email }, function (err, user) {
				if (err) {

				} else {
					if (!user) {
						result.message = constants.ERROR9009;
					} else {
						user.local.resetPasswordToken = token;
        				user.local.resetPasswordExpires = Date.now() + 3600000;

        				user.save(function (err) {
        					if (err) {
        						console.log(err);
        					}
        					done(err, token, user);
        				});
					}
				}
			});
		},
		function (token, user, done) {
			var smtpTransport = nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "tranhungnguyen@gmail.com",
			        pass: "Hungnguyen"
			    }
			});

			var mailOptions = { // req.headers.host
		        to: user.local.email,
		        from: 'tranhungnguyen@gmail.com',
		        subject: 'Node.js Password Reset',
		        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		          'http://' + host + '/password_reset?uid=' + user._id + '&token=' + token + '\n\n' +
		          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		    };
		    //console.log('Sending reset password email... ' + user.local.email);

		    // fucking async call while i want it non-async call
		    smtpTransport.sendMail(mailOptions, function(err) {
		    	if (err) {
		    		console.log(err);
		    	}
		        result.status = true;

		        /* Only expose reset password token on development or testing mode */
		        if (process.env.NODE_ENV != 'production') {
		        	result.data = {
		        		userId: user._id,
		        		resetToken: token
		        	}
		        }		        
		        done(err, 'done');
		    });
		}
	], function (err) {
			if (err) {
				callback(result); 
			} else {
				callback(result); 
			}
		});
};

UserRoute.prototype.validatePasswordResetToken = function (userId, token, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findOne({ $and: [
			{'_id': userId}, 
			{'local.resetPasswordToken': token}, 
			{'local.resetPasswordExpires': { $gt: Date.now() }}]},
			
		function (err, user) {
			if (err) {
				result.message = constants.ERROR2000;
				callback(result);
			} 

			if (!user) {
				result.message = constants.ERROR9012;
				callback(result);
			} else {
				result.status = true;
				callback(result);
			}

			
	});
}

UserRoute.prototype.resetPassword = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var userId 				= req.body.userId;
	var resetToken 			= req.body.resetToken;
	var newPassword 		= req.body.password;
	var newPasswordConfirm 	= req.body.passwordConfirm;

	/* If passwords don't match */
	if (newPassword != newPasswordConfirm) {
		result.message = constants.ERROR9014;
		return res.send(result);
	}

	User.findOne({ $and: [
			{'_id': userId}, 
			{'local.resetPasswordToken': resetToken}, 
			{'local.resetPasswordExpires': { $gt: Date.now() }}]},
			
		function (err, user) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			} 

			if (!user) {
				result.message = constants.ERROR9012;
				return res.send(result);
			}

			/* Check if new password similar to current password */
			if (user.validPassword(newPassword)) {
				result.message = constants.ERROR9013;
				return res.send(result);
			}

			/* Reset new password */
			user.local.password = user.generateHash(newPassword);
			user.local.resetPasswordToken = undefined;
			user.local.resetPasswordExpires = undefined;

			user.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
	});
}

UserRoute.prototype.changePassword = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var userId 				= req.body.userId;
	var loginToken 			= req.body.loginToken;
	var newPassword 		= req.body.password;
	var newPasswordConfirm 	= req.body.passwordConfirm;

	/* If passwords don't match */
	if (newPassword != newPasswordConfirm) {
		result.message = constants.ERROR9014;
		return res.send(result);
	}

	User.findOne({ $and: [
			{'_id': userId}, 
			{'platforms.token': loginToken}]},
			
		function (err, user) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return res.send(result);
			} 

			if (!user) {
				result.message = constants.ERROR9015;
				return res.send(result);
			}

			/* Check if new password similar to current password */
			if (user.validPassword(newPassword)) {
				result.message = constants.ERROR9013;
				return res.send(result);
			}

			/* Reset new password */
			user.local.password = user.generateHash(newPassword);

			user.save(function (err) {
				if (err) {
					console.log(err);
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
	});
}

/*
 * CREATE NEW PAGE
 *
 */
// UserRoute.prototype.createNewPage = function (req, res) {
// 	var loginToken 	= req.body.login_token;
// 	var name 		= req.body.name;
// 	var username 	= req.body.username;
// 	var description = req.body.description;
// 	var website 	= req.body.website;
// 	var pageType 	= req.body.page_type;

// 	var result = {
// 		status: 'FAILED',
// 		message: '',
// 		data: null
// 	};

// 	User.findOne({'platforms.token' : loginToken}, function (err, user) {
// 		if (err) {
// 			result.message = constants.ERROR2000;
// 			return res.send(result);
// 		}

// 		if (!user) {
// 			result.message = constants.ERROR9015;
// 			return res.send(result);
// 		}

// 		var page = new Page();
// 		page.name = name;
// 		page.username = username;
// 		page.description = description;
// 		page.website = website;
// 		page.pageType = pageType;
// 		page.admins.push(user);

// 		page.save(function (err) {
// 			if (err) {
// 				result.message = constants.ERROR9015;
// 				return res.send(result);
// 			}

// 			result.status = 'OK';
// 			result.data = page;
// 			return res.send(result);
// 		});
// 	});
// }

/*
 *	ADD NEW EDUCATION
 *
 */
UserRoute.prototype.addEducation = function (req, res) {
	var loginToken 	= req.body.login_token;
	var schoolName = req.body.school_name;
	var schoolId = req.body.school_id;
	var degree = req.body.degree;
	var studyField = req.body.study_field;
	var dateStarted = req.body.date_started;
	var dateEnded = req.body.date_ended;
	var grade = req.body.grade;
	var activities = req.body.activities;
	var description = req.body.description;
	var educationLevel = req.body.education_level;
		
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find School Id */
		Page.findOne({'_id': schoolId}, function (err, schoolPage) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			var education = new Education();
			education.degree = degree;
			education.studyField = studyField;
			education.grade = grade;
			education.activities = activities;
			education.description = description;
			education.educationLevel = educationLevel;
			education.schoolStarted = dateStarted;
			education.schoolEnded = dateEnded;
			education.user = user;

			if (schoolPage) {
				education.school = schoolPage;
				education.schoolName = schoolPage.schoolName;
			} else {
				education.school = null;
				education.schoolName = schoolName;
			}

			education.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = education;
				return res.send(result);
			});
		});
		
	});
}

/*
 *	ADD NEW EDUCATION
 *
 */
UserRoute.prototype.addEducationV2 = function (edu, callback) {
		
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(edu.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		/* Find School Id */
		Page.findOne({'_id': edu.schoolId}, function (err, schoolPage) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			var education = new Education();
			education.degree = edu.degree;
			education.studyField = edu.studyField;
			education.grade = edu.grade;
			//education.activities = edu.activities;
			education.description = edu.description;
			education.educationLevel = edu.educationLevel;
			education.yearStarted = edu.yearStarted;
			education.yearEnded = edu.yearEnded;
			education.user = user;

			if (schoolPage) {
				education.school = schoolPage;
				education.schoolName = schoolPage.schoolName;
			} else {
				education.school = null;
				education.schoolName = edu.schoolName;
			}

			education.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				result.status = true;
				result.data = education;
				return callback(result);
			});
		});
		
	});
}

/*
 *	EDIT EDUCATION
 *
 */
UserRoute.prototype.editEducation = function (req, res) {
	var loginToken 	= req.body.login_token;
	var educationId = req.body.education_id;
	var schoolName = req.body.school_name;
	var schoolId = req.body.school_id;
	var degree = req.body.degree;
	var studyField = req.body.study_field;
	var dateStarted = req.body.date_started;
	var dateEnded = req.body.date_ended;
	var grade = req.body.grade;
	var activities = req.body.activities;
	var description = req.body.description;
	var educationLevel = req.body.education_level;
		
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}
		/* Find Education */
		Education.findOne({'_id': educationId}, function (err, education) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!education) {
				result.message = constants.ERROR9022;
				return res.send(result);
			}

			/* Find School Id */
			Page.findOne({'_id': schoolId}, function (err, schoolPage) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				
				education.degree = degree;
				education.studyField = studyField;
				education.grade = grade;
				education.activities = activities;
				education.description = description;
				education.educationLevel = educationLevel;
				education.schoolStarted = dateStarted;
				education.schoolEnded = dateEnded;

				if (schoolPage) {
					education.school = schoolPage;
					education.schoolName = schoolPage.schoolName;
				} else {
					education.school = null;
				}

				education.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = education;
					return res.send(result);
				});
			});
		});
	});
}


/*
 *	REMOVE EDUCATION
 *
 */
UserRoute.prototype.removeEducationV2 = function (educationId, callback) {		
	var result = {
		status: false,
		message: '',
		data: null
	};

	/* Find Education */
		Education.findOne({'_id': educationId}, function (err, education) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (!education) {
				result.message = constants.ERROR9022;
				return callback(result);
			}

			education.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				result.status = true;
				return callback(result);
			});
		});
}

/*
 *	REMOVE EDUCATION
 *
 */
UserRoute.prototype.removeEducation = function (req, res) {
	var loginToken 	= req.body.login_token;
	var educationId = req.body.education_id;
		
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}
		/* Find Education */
		Education.findOne({'_id': educationId}, function (err, education) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!education) {
				result.message = constants.ERROR9022;
				return res.send(result);
			}

			education.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
		});
	});
}

/*
 *	ADD NEW EDUCATION
 *
 */
UserRoute.prototype.addExperience = function (req, res) {
	var loginToken 	= req.body.login_token;
	var companyName = req.body.company_name;
	var companyId = req.body.company_id;
	var title = req.body.title;
	var location = req.body.location;
	var dateStarted = req.body.date_started;
	var dateEnded = req.body.date_ended;
	var isWorking = req.body.is_working;
	var description = req.body.description;
		
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find Company Id */
		Page.findOne({'_id': companyId}, function (err, companyPage) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			var experience = new Experience();
			experience.isWorking = isWorking;
			experience.location = location;
			experience.title = title;
			experience.description = description;
			experience.dateStarted = dateStarted;
			experience.dateEnded = dateEnded;
			experience.user = user;

			if (companyPage) {
				experience.company = companyPage;
				experience.companyName = companyPage.companyName;
			} else {
				experience.company = null;
				experience.companyName = companyName;
			}

			experience.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = experience;
				return res.send(result);
			});
		});
		
	});
}

/*
 *	ADD NEW EDUCATION
 *
 */
UserRoute.prototype.addExperienceV2 = function (exp, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(exp.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		/* Find Company Id */
		Page.findOne({'_id': exp.companyId}, function (err, companyPage) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			var experience 			= new Experience();
			experience.isWorking 	= exp.isStillHere;
			experience.location		= exp.location;
			experience.title 		= exp.title;
			experience.description 	= exp.description;
			experience.dateStarted 	= new Date(exp.dateStarted.year, exp.dateStarted.month);
			experience.dateEnded 	= new Date(exp.dateEnded.year, exp.dateEnded.month);;
			experience.user 		= user;

			if (companyPage) {
				experience.company = companyPage;
				experience.companyName = companyPage.companyName;
			} else {
				experience.company = null;
				experience.companyName = exp.companyName;
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
}

/*
 *	EDIT EXPERIENCE
 *
 */
UserRoute.prototype.editExperienceV2 = function (exp, callback) {
		
	var result = {
		status: false,
		messages: [],
		data: null
	};

	User.findById(exp.userId, function (err, user) {
		if (err) {
			result.messages.push(constants.ERROR2000);
			return callback(result);
		}

		if (!user) {
			result.messages.push(constants.ERROR9015);
			return callback(result);
		}

		/* Find Experience */
	Experience.findById(exp.experienceId, function (err, experience) {
		if (err) {
			result.messages.push(constants.ERROR2000);
			return callback(result);
		}

		if (!experience) {
			result.messages.push(constants.ERROR9022);
			return callback(result);
		}

		/* Find company page Id */
		Page.findOne({'_id': exp.companyId}, function (err, companyPage) {
			if (err) {
				console.log(err);
				result.messages.push(constants.ERROR2000);
				return callback(result);
			}

			experience.isWorking 	= exp.isStillHere;
			experience.location		= exp.location;
			experience.title 		= exp.title;
			experience.description 	= exp.description;
			experience.dateStarted 	= new Date(exp.dateStarted.year, exp.dateStarted.month);
			experience.dateEnded 	= new Date(exp.dateEnded.year, exp.dateEnded.month);;
			experience.user 		= user;

			// Check if date started > date ended
			var timeDiff = experience.dateEnded.getTime() - experience.dateStarted.getTime();

			if (timeDiff < 0) {
				result.messages.push(constants.ERROR9028);
				return callback(result);
			}

			if (companyPage) {
				experience.company = companyPage;
				experience.companyName = companyPage.companyName;
			} else {
				experience.company = null;
				experience.companyName = exp.companyName;
			}

			experience.save(function (err) {
				if (err) {
					result.messages.push(constants.ERROR2000);
					return callback(result);
				}

				result.status = true;
				result.data = experience;
				return callback(result);
			});
		});
	});
	});
}

UserRoute.prototype.editBasicInfo = function (info, callback) {
	var result = {
		status: false,
		messages: [],
		data: null
	};

	User.findById(info.userId, function (err, user) {
		if (err) {
			result.messages.push(constants.ERROR2000);
			return callback(result);
		}

		if (!user) {
			result.messages.push(constants.ERROR9015);
			return callback(result);
		}

		user.local.firstName = info.firstName;
		user.local.lastName = info.lastName;
		user.livesin = info.livesin;
		user.description = info.description;

		//console.log(info);

		if (info.birthday) {
			var date = info.birthday.date;

			// look up for privacy
			PrivacySetting.findById(info.birthday.privacy, function (err, privacy) {
				if (err) {
					result.messages.push(constants.ERROR2000);
					return callback(result);
				}

				if (privacy) {
					user.birthday.date = date;
					user.birthday.privacy = privacy;

					// save user
					user.save(function (err) {
						if (err) {
							result.messages.push(constants.ERROR2000);
							return callback(result);
						}

						info.birthday.privacy = privacy;
						result.status = true;
						result.data = info;
						return callback(result);
					});
				} else {
					user.birthday.date = null;
					user.birthday.privacy = null;
					// save user
					user.save(function (err) {
						if (err) {
							result.messages.push(constants.ERROR2000);
							return callback(result);
						}

						result.status = true;
						result.data = info;
						return callback(result);
					});
				}
			})
		} else {
			user.birthday.date = null;
					user.birthday.privacy = null;
					// save user
					user.save(function (err) {
						if (err) {
							result.messages.push(constants.ERROR2000);
							return callback(result);
						}

						result.status = true;
						result.data = info;
						return callback(result);
					});
		}
	
	});
}

/*
 *	EDIT EXPERIENCE
 *
 */
UserRoute.prototype.editExperience = function (req, res) {
	var loginToken 	= req.body.login_token;
	var experienceId = req.body.experience_id;
	var companyName = req.body.company_name;
	var companyId = req.body.company_id;
	var title = req.body.title;
	var location = req.body.location;
	var dateStarted = req.body.date_started;
	var dateEnded = req.body.date_ended;
	var isWorking = req.body.is_working;
	var description = req.body.description;
		
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}
		/* Find Education */
		Experience.findOne({'_id': experienceId}, function (err, experience) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!experience) {
				result.message = constants.ERROR9022;
				return res.send(result);
			}

			/* Find School Id */
			Page.findOne({'_id': companyId}, function (err, companyPage) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				
				experience.title = title;
				experience.location = location;
				experience.isWorking = isWorking;
				experience.description = description;
				experience.dateStarted = dateStarted;
				experience.dateEnded = dateEnded;

				if (companyPage) {
					experience.company = companyPage;
					experience.companyName = companyPage.companyName;
				} else {
					experience.company = null;
					experience.companyName = companyName;
				}

				experience.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = experience;
					return res.send(result);
				});
			});
		});
	});
}



/*
 *	REMOVE EDUCATION
 *
 */
UserRoute.prototype.removeExperience = function (req, res) {
	var loginToken 	= req.body.login_token;
	var experienceId = req.body.experience_id;
		
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}
		/* Find Education */
		Experience.findOne({'_id': experienceId}, function (err, experience) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!experience) {
				result.message = constants.ERROR9022;
				return res.send(result);
			}

			experience.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
		});
	});
}

/*
 *	REMOVE EDUCATION
 *
 */
UserRoute.prototype.removeExperienceV2 = function (expId, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	console.log(expId);

	/* Find Education */
		Experience.findOne({'_id': expId}, function (err, experience) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (!experience) {
				result.message = constants.ERROR9022;
				return callback(result);
			}

			experience.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				result.status = true;
				return callback(result);
			});
		});
}

UserRoute.prototype.followV2 = function (userId, targetUsername, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	// Find logged in user
	User.findById(userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		// Find target user
		User.findOne({'local.username' : targetUsername}, function (err, targetUser) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (!targetUser) {
				result.message = constants.ERROR9015;
				return callback(result);
			}

			Follow.findOne({ $and: [{'user': user._id}, {'following': targetUser._id}]}, function (err, follow) {
					if (err) {
						result.message = constants.ERROR2000;
						return callback(result);
					}

					if (follow) {
						result.message = constants.ERROR9016;
						return callback(result);
					}

					var follow = new Follow();
					follow.user = user;
					follow.following = targetUser;

					follow.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return callback(result);
						}

						result.status = true;
						result.data = {
							following: {
								_id: targetUser._id,
								username: targetUser.local.username,
								first_name: targetUser.local.firstName,
								last_name: targetUser.local.lastName
							}
						}
						return callback(result);
					})
				});

		});
	});
}

/*
 * FOLLOW A USER
 *
 */
UserRoute.prototype.follow = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var userId			= req.body.user_id;

	User.findOne({'platforms.token': loginToken},
		function (err, user) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			} 

			if (!user) {
				result.message = constants.ERROR9015;
				return res.send(result);
			}

			User.findOne({ '_id': userId}, function (err, target) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!target) {
					result.message = constants.ERROR9002;
					return res.send(result);
				}

				Follow.findOne({ $and: [{'user': user._id}, {'following': target._id}]}, function (err, follow) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					if (follow) {
						result.message = constants.ERROR9016;
						return res.send(result);
					}

					var follow = new Follow();
					follow.user = user;
					follow.following = target;

					follow.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return res.send(result);
						}

						result.status = 'OK';
						result.data = {
							user: {
								id: target._id,
								username: target.local.username,
								first_name: target.local.firstName,
								last_name: target.local.lastName
							}
						}
						return res.send(result);
					})
				});				
			});
	});
}

/*
 *	UNFOLLOW A USER
 *
 */
UserRoute.prototype.unfollow = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var userId			= req.body.user_id;

	User.findOne({'platforms.token': loginToken},
			
		function (err, user) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			} 

			if (!user) {
				result.message = constants.ERROR9015;
				return res.send(result);
			}

			User.findOne({ '_id': userId}, function (err, target) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!target) {
					result.message = constants.ERROR9002;
					return res.send(result);
				}

				Follow.findOne({ $and: [{'user': user._id}, {'following': target._id}]}, function (err, follow) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					if (!follow) {
						result.message = constants.ERROR9016;
						return res.send(result);
					}

					follow.remove(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return res.send(result);
						}

						result.status = 'OK';
						result.data = {
							user: {
								id: target._id,
								username: target.local.username,
								first_name: target.local.firstName,
								last_name: target.local.lastName
							}
						}
						return res.send(result);
						return res.send(result);
					})
				});
			});
	});
}

/*
 * FOLLOW A USER
 *
 */
UserRoute.prototype.requestConnect = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var targetId			= req.body.target_id;

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}
		User.findOne({ '_id': targetId}, function (err, target) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!target) {
				result.message = constants.ERROR9002;
				return res.send(result);
			}

			Connect.findOne({ $and: [{'user': user._id}, {'target': target._id}]}, function (err, connect) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (connect) {
					result.message = constants.ERROR9016;
					return res.send(result);
				}

				var connect = new Connect();
				connect.user = user;
				connect.target = target;

				connect.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = connect;
					return res.send(result);
				})
				
			});
		});
	});
}

/*
 * ACCEPT CONNECT REQUEST
 *
 */
UserRoute.prototype.acceptConnectRequest = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var requestId			= req.body.connect_id;

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Connect.findOne({ $and: [{'_id': requestId}, {'status': 'PENDING'}]}, function (err, connect) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!connect) {
				result.message = constants.ERROR9002;
				return res.send(result);
			}

			connect.status = 'ACCEPTED';
			connect.dateAccepted = new Date();

			connect.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = connect;
				return res.send(result);
			});
		});
	});
}

/*
 * ACCEPT CONNECT REQUEST
 *
 */
UserRoute.prototype.removeConnect = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var requestId			= req.body.connect_id;

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Connect.findOne({'_id': requestId}, function (err, connect) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!connect) {
				result.message = constants.ERROR9002;
				return res.send(result);
			}

			connect.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
		});
	});
}

/*
 * FOLLOW A USER
 *
 */
UserRoute.prototype.ignoreConnectRequest = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var requestId			= req.body.connect_id;

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Connect.findOne({ $and: [{'_id': requestId}, {'status': 'PENDING'}]}, function (err, connect) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!connect) {
				result.message = constants.ERROR9002;
				return res.send(result);
			}

			connect.status = 'IGNORED';
			connect.dateAccepted = new Date();

			connect.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = connect;
				return res.send(result);
			});
		});
	});
}

/*
 * FOLLOW A PAGE
 *
 */
UserRoute.prototype.followPage = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var pageId			= req.body.page_id;

	User.findOne({'platforms.token': loginToken}, function (err, user) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			} 

			if (!user) {
				result.message = constants.ERROR9015;
				return res.send(result);
			}

			Page.findOne({ '_id': pageId}, function (err, page) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!page) {
					result.message = constants.ERROR9020;
					return res.send(result);
				}

				for (var i = 0; i < user.pagesFollowing.length; i++) {
					var objectId = user.pagesFollowing[i];

					if (objectId == page.id) {
						result.message = constants.ERROR9016;
						return res.send(result);
					}
				}

					// Add target user to authenticating user's follower list
					user.pagesFollowing.push(page);
					user.save(function (err) {
						if (err) {
							console.log(err);
						}
					});

				result.status = 'OK';
				result.data = page;
				
				return res.send(result);
			});
	});
}

/*
 * UNFOLLOW A PAGE
 *
 */
UserRoute.prototype.unfollowPage = function (req, res) {
	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	var loginToken 			= req.body.login_token;
	var pageId			= req.body.page_id;

	User.findOne({'platforms.token': loginToken}, function (err, user) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			} 

			if (!user) {
				result.message = constants.ERROR9015;
				return res.send(result);
			}

			Page.findOne({ '_id': pageId}, function (err, page) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!page) {
					result.message = constants.ERROR9020;
					return res.send(result);
				}

				var isFollowing = false;
				for (var i = 0; i < user.pagesFollowing.length; i++) {
					var objectId = user.pagesFollowing[i];

					if (objectId == page.id) {
						user.pagesFollowing.splice(i, 1);
						isFollowing = true;
						break;
					}
				}

				if (isFollowing == true) {
					user.save(function (err) {
						if (err) {
							console.log(err);
						}
					});
				}

				result.status = 'OK';
				result.data = page;
				
				return res.send(result);
			});
	});
}

/*
 *	FIND PAGE BY USERNAME
 *	Required:
 *		@username: String
 */
UserRoute.prototype.findPageByUsername = function(req, res) {
	var username = req.params.username;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	Page.findOne({'username' : username}, function (err, page) {
		if (err) {
			console.log(err);
			result.message = constants.ERROR2000;
		} else {
			if (!page) {
				result.message = constants.ERROR9002;
			} else {
				
				result.status = 'OK';
				result.data = page;
			}
		}
		res.send(result);			
	});
}


//============================== ARTICLE ==============================

/*
 *
 */
UserRoute.prototype.findArticlesByUsername = function (username, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	// Find user by username to get user id
	User.findOne({ 'local.username': username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9029;
			return callback(result);
		}

		// determin relationship with username

		// Find all articles of username
		Article.find({ $and: [{ author: user._id }, { status: 'PUBLISHED'}]  }, function (err, articles) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			var userArticles = [];
			for (var i = 0; i < articles.length; i++) {
				var userArticle = {
					_id: articles[i]._id,
					title: articles[i].title,
					slug: articles[i].slug,
					tags: articles[i].tags,
					content: _.unescape(articles[i].content),
					category: articles[i].category,
					privacy: articles[i].privacy,
					dateCreated: articles[i].dateCreated,
					author: {
						_id: user._id,
						username: user.local.username,
						firstName: user.local.firstName,
						lastName: user.local.lastName
					}
				}
				userArticles.push(userArticle);
			}

			// for each article, find tags, category, privacy...
			var articleObject = {
					findArticle: function (article, callbackMap) {

						// find article's tags
						var findTags = function (tags, callbackParallel) {
							Tag.find({ _id : { $in: tags }}, function (err, tags) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, tags);
								}
							});
						}

						// find article's category
						var findCategory = function (categoryId, callbackParallel) {
							Category.findById(categoryId, function (err, category) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, category);
								}
							});
						};

						// find article's privacy
						var findPrivacy = function (privacyId, callbackParallel) {
							PrivacySetting.findById(privacyId, function (err, privacy) {
								if (err) {
									callbackParallel(err);
								} else {
									callbackParallel(null, privacy);
								}			
							});
						};

						// async
						async.parallel({
							tags: function (next) {
								findTags(article.tags, next);
							},
							category: function (next) {
								findCategory(article.category, next);
							},
							privacy: function (next) {
								findPrivacy(article.privacy, next);
							}
						}, function (err, results) {
							var tags 		= results.tags;
							var category 	= results.category;
							var privacy 	= results.privacy;

							// check for privacy. Only return article to appropriate user
							// calculate date time different
							var now = new Date();
							var timeDiff = Math.abs(now.getTime() - article.dateCreated.getTime()) / 1000; // in second
							
							var art = {
								_id: 		article._id,
								title: 		article.title,
								content: 	_.unescape(article.content),
								slug: 		article.slug,
								tags: 		tags,
								category: 	category,
								privacy: 	privacy,
								dateCreated: article.dateCreated,
								author: {
									_id: 		article.author._id,
									username: 	article.author.username,
									firstName: 	article.author.firstName,
									lastName: 	article.author.lastName
								}
							}

							callbackMap(null, art);
							//return callback(result);
						});
					}
				}

				async.map(userArticles, articleObject.findArticle.bind(articleObject), function (err, callbackResult) {
					
					// return all article
					result.status = true;
					result.data = callbackResult;
					return callback(result);
				});
		});
	});
};

/*
 * Find article by usernam and slug
 *
 */
UserRoute.prototype.findArticleBySlug = function (username, slug, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	// Find user by username to get user id
	User.findOne({ 'local.username': username}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9029;
			return callback(result);
		}

		// Find article by user id and article slug
		Article.findOne({ $and: [ { slug: slug }, { author: user._id }]}, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			// find article's tags
			var findTags = function (tags, callback) {
				Tag.find({ _id : { $in: tags }}, function (err, tags) {
					if (err) {
						callback(err);
					} else {
						callback(null, tags);
					}
				});
			}

			// find article's category
			var findCategory = function (categoryId, callback) {
				Category.findById(categoryId, function (err, category) {
					if (err) {
						callback(err);
					} else {
						callback(null, category);
					}
				});
			};

			// find article's privacy
			var findPrivacy = function (privacyId, callback) {
				PrivacySetting.findById(privacyId, function (err, privacy) {
					if (err) {
						callback(err);
					} else {
						callback(null, privacy);
					}			
				});
			};

			// async
			async.parallel({
				tags: function (next) {
					findTags(article.tags, next);
				},
				category: function (next) {
					findCategory(article.category, next);
				},
				privacy: function (next) {
					findPrivacy(article.privacy, next);
				}
			}, function (err, results) {
				var tags 		= results.tags;
				var category 	= results.category;
				var privacy 	= results.privacy;

				// check for privacy. Only return article to appropriate user
				var art = {
					_id: article._id,
					title: article.title,
					content: _.unescape(article.content),
					slug: article.slug,
					tags: tags,
					category: category,
					privacy: privacy,
					user: {
						_id: user._id,
						username: user.local.username,
						firstName: user.local.firstName,
						lastName: user.local.lastName
					}
				}

				result.status = true;
				result.data = art;
				return callback(result);
			});
		});
	});
};

UserRoute.prototype.unlikeArticle = function (userId, articleId, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		Article.findById(articleId, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}
			if (!article) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			/* Check if user has already like this article */
			Like.findOne({ $and: [{parentId: article._id}, {liker: user._id}]}, function (err, like) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				if (like) {
					// remove like
					like.remove(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return callback(result);
						}

						result.status = true;
						result.data = like;

						return callback(result);
					});
				} else {
					result.message = constants.ERROR2000;
					return callback(result);
				}
			});
		});
	});
}

/*
 * LIKE COMMENT
 *
 */
UserRoute.prototype.likeComment = function (userId, commentId, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(userId, function (err, user) {
		if (err) {
			console.log(err);
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		Comment.findById(commentId, function (err, comment) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return callback(result);
			}
			if (!comment) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			/* Check if user has already like this article */
			Like.findOne({$and: [{parentId: comment._id}, {liker: user._id}]}, function (err, like) {
				if (err) {
					console.log(err);
					result.message = constants.ERROR2000;
					return callback(result);
				}

				if (like) {
					// already like
					result.message = 'You have liked this comment';
					return callback(result);
				} else {
					// add like
					var like 		= new Like();
					like.parentType = 'COMMENT';
					like.liker 		= user;
					like.parentId 	= comment._id;

					like.save(function (err) {
						if (err) {
							console.log(err);
							result.message = constants.ERROR2000;
							return callback(result);
						}

						result.status = true;
						result.data = like;

						return callback(result);
					});
				}
			});
		});
	});
};

/*
 * UNLIKE COMMENT
 *
 */
UserRoute.prototype.unlikeComment = function (userId, commentId, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(userId, function (err, user) {
		if (err) {
			console.log(err);
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		Comment.findById(commentId, function (err, comment) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return callback(result);
			}
			if (!comment) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			/* Check if user has already like this article */
			Like.findOne({$and: [{parentId: comment._id}, {liker: user._id}]}, function (err, like) {
				if (err) {
					console.log(err);
					result.message = constants.ERROR2000;
					return callback(result);
				}

				if (!like) {
					// already like
					result.message = 'Like does not exist';
					return callback(result);
				} else {

					like.remove(function (err) {
						if (err) {
							console.log(err);
							result.message = constants.ERROR2000;
							return callback(result);
						}

						result.status = true;
						result.data = like;

						return callback(result);
					});
				}
			});
		});
	});
};

/*
 * REPLY COMMENT
 *
 */
UserRoute.prototype.replyComment = function (userId, commentId, content, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	console.log(commentId);

	// Find authenticated user
	User.findById(userId, function (err, user) {
		if (err) {
			console.log(err);
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		// Find target comment
		Comment.findById(commentId, function (err, comment) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return callback(result);
			}

			// Target comment not found
			if (!comment) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			// Construct a reply which is actually another comment of the target comment
			var comment = new Comment();
			comment.content = _.escape(content);
			comment.parentType = 'COMMENT';
			comment.commenter = user;
			comment.parentId = commentId;
			comment.privacy = 'PUBLIC';

			comment.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				result.status = true;
				result.data = comment;

				return callback(result);
			});
		});
	});
};

/*
 * LIKE OR UNLIKE AN ARTICLE
 *
 */
UserRoute.prototype.likeUnlikeArticle = function (userId, articleId, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	User.findById(userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		Article.findById(articleId, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}
			if (!article) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			/* Check if user has already like this article */
			Like.findOne({$and: [{parentId: article._id}, {liker: user._id}]}, function (err, like) {
				if (err) {
					result.message = constants.ERROR2000;
					return callback(result);
				}

				if (like) {
					// already like
					result.message = constants.ERROR2000;
					return callback(result);
				} else {
					// add like
					var like 		= new Like();
					like.parentType = 'ARTICLE';
					like.liker 		= user;
					like.parentId 	= article._id;

					like.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return callback(result);
						}

						result.status = true;
						result.data = like;

						return callback(result);
					});
				}
			});
		});
	});
};

/*
 *	POST COMMENT TO AN ARTICLE
 *
 */
UserRoute.prototype.commentArticleV2 = function (userId, articleId, content, callback) {

	var result = {
		status: false,
		message: '',
		data: null
	};
	User.findById(userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return callback(result);
		}

		Article.findById(articleId, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return callback(result);
			}

			/* Add comment */
			var comment = new Comment();
			comment.content = _.escape(content);
			comment.parentType = 'ARTICLE';
			comment.commenter = user;
			comment.parentId = article._id;
			comment.privacy = 'PUBLIC';

			comment.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = comment;

				return callback(result);
			});
		});
	});
};


/*
 *	POST NEW ARTICLE.
 *
 */
UserRoute.prototype.newArticle = function (data, callback) {
	var result = {
		status: false,
		message: '',
		data: null
	};

	console.log(data);

	User.findById(data.userId, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return callback(result);
		}

		if (!user) {
			result.message = constants.ERROR9029;
			return callback(result);
		}

		// title slug and user are set to be unique
		Article.findOne({ $and: [ { slug: data.slug }, { author: data.userId}]}, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return callback(result);
			}

			// return error if the slug has already been in use
			if (article) {
				console.log(article);
				result.message = constants.ERROR9030;
				return callback(result);
			}

			// Find tags in database
			var findTags = function (tags, callback) {
				Tag.find({ _id : { $in: tags }}, function (err, tags) {
					if (err) {
						callback(err);
					} else {
						callback(null, tags);
					}
				});
			}

			// Find languages
			var findCategory = function (categoryId, callback) {
				Category.findById(categoryId, function (err, category) {
					if (err) {
						callback(err);
					} else {
						callback(null, category);
					}
				});
			};

			// Find privacy
			var findPrivacy = function (privacyId, callback) {
				PrivacySetting.findById(privacyId, function (err, privacy) {
					if (err) {
						callback(err);
					} else {
						callback(null, privacy);
					}			
				});
			};

			async.parallel({
				tags: function (next) {
					findTags(data.tags, next);
				},
				category: function (next) {
					findCategory(data.category, next);
				},
				privacy: function (next) {
					findPrivacy(data.privacy, next);
				}
			}, function (err, results) {
				var tags 		= results.tags;
				var category 	= results.category;
				var privacy 	= results.privacy;

				// Initialize new article
				var newArticle 		= new Article();
				newArticle.title 	= data.title;
				newArticle.content 	= data.content;
				newArticle.slug 	= data.slug;
				newArticle.status 	= 'PUBLISHED';
				newArticle.tags 	= tags;
				newArticle.category = category;
				newArticle.privacy 	= privacy;
				newArticle.author	= user;

				// Save new article to database
				newArticle.save(function (err) {
					if (err) {

					}

					// Pass data to call back function
					result.status = true;
					result.data = newArticle;
					return callback(result);
				});
			});
		});

		
	});
};

/*
 *	POST NEW ARTICLE.
 *
 */
UserRoute.prototype.postNewArticle = function (req, res) {
	var loginToken 	= req.body.login_token;
	var title 		= req.body.title;
	var content 	= req.body.content;
	var url 		= req.body.url;
	var slug	 	= req.body.url_title;
	var status 		= 'PUBLISHED';
	var tags 		= req.body.tags;

	/* new tag list */
	var tagList = [];

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Need to convert article title to url-friendly article */
		if (slug == null || slug == '') {
			slug = _s.clean(title);
			slug = _s.titleize(slug);
			slug = slug.replace(/[^a-zA-Z0-9]/g, '-');
			slug = slug.replace(/-{2,}/g, '-');
		}

		var newPost = new Article();
		newPost.title = title;
		newPost.content = content;
		newPost.url = url;
		newPost.status = status;
		newPost.urlTitle = slug;
		newPost.author = user;

		var callbackFunctions = [];

		for (var i = 0; i < tags.length; i++) {
			var tagName = _s.clean(tags[i]);
			tagName = _s.titleize(tagName);

			if (tagList.indexOf(tagName) == -1) {
				tagList.push(tagName);
			}
		}

		for (var i = 0; i < tagList.length; i++) {
			var tagName = _s.titleize(tagList[i]);
			
			(function (tagName) {
				var assignTag = function (callback) {
					var sluggedTag = tagName.trim();					
					sluggedTag = sluggedTag.replace(/[^a-zA-Z0-9]/g, '-');
					sluggedTag = sluggedTag.replace(/-{2,}/g, '-');

					Tag.findOne({ 'slug': sluggedTag}, function (err, tag) {
						if (err) { }

						if (!tag) {
							/* Create new tag */
							var tag = new Tag();
							tag.name = tag;
							tag.slug = sluggedTag;

							tag.save(function (err) {
								if (err) { }

								newPost.tags.push(tag);
								callback();
							})
						} else {
							newPost.tags.push(tag);
							callback();
						}
					});
				};
				callbackFunctions.push(assignTag);
			})(tagName);
		}

		async.parallel(callbackFunctions, function (err, result) {
			newPost.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				var result = {
					status: 'FAILED',
					message: '',
					data: null
				};

				result.status = 'OK';
				result.data = newPost;
				return res.send(result);
			});
		});		
	});
}

/*
 * EDIT ARTICLE
 *
 */
UserRoute.prototype.editArticle = function (req, res) {
	var loginToken 	= req.body.login_token;
	var articleId 	= req.body.article_id;

	var title 		= req.body.title;
	var content 	= req.body.content;
	var url 		= req.body.url;
	var urlTitle 	= req.body.url_title;
	var tags 		= req.body.tags;
	/* new tag list */
	var tagList = [];

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Article.findOne({ '_id': articleId }, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			/* Need to convert article title to url-friendly article */
			if (urlTitle == null || urlTitle == '') {
				slug = _s.clean(title);
				slug = _s.titleize(slug);
				slug = slug.replace(/[^a-zA-Z0-9]/g, '-');
				slug = slug.replace(/-{2,}/g, '-');
			}

			article.title = title;
			article.content = content;
			article.url = url;
			article.status = 'PUBLISHED';
			article.urlTitle = urlTitle;
			article.author = user;

			var callbackFunctions = [];

			for (var i = 0; i < tags.length; i++) {
				var tagName = _s.clean(tags[i]);
				tagName = _s.titleize(tagName);

				if (tagList.indexOf(tagName) == -1) {
					tagList.push(tagName);
				}
			}

			/* clear tag array */
			article.tags = [];
			for (var i = 0; i < tagList.length; i++) {
				var tagName = _s.titleize(tagList[i]);
				
				(function (tagName) {
					var assignTag = function (callback) {
						var sluggedTag = tagName.trim();					
						sluggedTag = sluggedTag.replace(/[^a-zA-Z0-9]/g, '-');
						sluggedTag = sluggedTag.replace(/-{2,}/g, '-');

						Tag.findOne({ 'slug': sluggedTag}, function (err, tag) {
							if (err) { }

							if (!tag) {
								/* Create new tag */
								var tag = new Tag();
								tag.name = tag;
								tag.slug = sluggedTag;

								tag.save(function (err) {
									if (err) { }

									article.tags.push(tag);
									callback();
								})
							} else {
								article.tags.push(tag);
								callback();
							}
						});
					};
					callbackFunctions.push(assignTag);
				})(tagName);
			}

			async.parallel(callbackFunctions, function (err, result) {
				article.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					var result = {
						status: 'FAILED',
						message: '',
						data: null
					};

					result.status = 'OK';
					result.data = article;
					return res.send(result);
				});
			});
		});
	});
};

/*
 * DELETE ARTICLE
 *
 */
UserRoute.prototype.deleteArticle = function (req, res) {
	var loginToken 	= req.body.login_token;
	var articleId 	= req.body.article_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Article.findOne({ '_id': articleId }, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			/* Remember to delete all article's comment, like, etc... */
			Comment.remove({'parentId' : articleId}, function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}
			});

			Like.remove({'parentId' : articleId}, function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}
			});

			/* Remove actual article */
			article.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
		});
	});
};

/*
 *	POST COMMENT TO AN ARTICLE
 *
 */
UserRoute.prototype.commentArticle = function (req, res) {
	var loginToken 	= req.body.login_token;
	var parentId 	= req.body.article_id;
	var content 	= req.body.comment_content;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};
	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Article.findOne({ '_id': parentId }, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			/* Add comment */
			var comment = new Comment();
			comment.content = content;
			comment.parentType = 'ARTICLE';
			comment.commenter = user;
			comment.parentId = article._id;
			comment.privacy = 'PUBLIC';

			comment.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = comment;

				res.send(result);
			});
		});
	});
};

/*
 *	EDIT COMMENT
 *
 */
UserRoute.prototype.editComment = function (req, res) {
	var loginToken 	= req.body.login_token;
	var commentId 	= req.body.comment_id;
	var content 	= req.body.comment_content;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};
	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Comment.findOne({ '_id': commentId }, function (err, comment) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!comment) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			/* Edit comment */
			comment.content = content;
			comment.privacy = 'PUBLIC';
			comment.isEdited = true;

			comment.save(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = comment;

				res.send(result);
			});
		});
	});
}

/*
 *	DELETE COMMENT
 *
 */
UserRoute.prototype.deleteComment = function (req, res) {
	var loginToken 	= req.body.login_token;
	var commentId 	= req.body.comment_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};
	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Comment.findOne({ '_id': commentId }, function (err, comment) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!comment) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			comment.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';

				res.send(result);
			});
		});
	});
}

/*
 * LIKE AN ARTICLE
 *
 */
UserRoute.prototype.like = function (req, res) {
	var loginToken 		= req.body.login_token;
	var parentId 		= req.body.article_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Article.findOne({ '_id': parentId }, function (err, article) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return res.send(result);
			}
			if (!article) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			/* Check if user has already like this article */
			Like.findOne({'parentId': article._id}, function (err, like) {
				if (err) {
					console.log(err);
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (like) {
					result.message = constants.ERROR9018;
					return res.send(result);
				}

				/* Add comment */
				var like 		= new Like();
				like.parentType = 'ARTICLE';
				like.liker 		= user;
				like.parentId 	= article._id;

				like.save(function (err) {
					if (err) {
						console.log(err);
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = like;

					res.send(result);
				});
			});
		});
	});
};

/*
 * UNLIKE ARTICLE
 *
 */
UserRoute.prototype.unlike = function (req, res) {
	var likeId 		= req.body.like_id;
	var loginToken 	= req.body.login_token;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find the comment for deletion with given commenter and comment id */
		Like.findOne({ $and: [{'_id': likeId}, {'liker': user._id}]}, function (err, like) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!like) {
				result.message = constants.ERROR9019;
				return res.send(result);
			}

			like.remove(function (err) {
				if (err) {
					console.log(err);
				}

				result.status = 'OK';
				return res.send(result);
			})
		});
	});
};

/*
 *	CREATE READING LIST
 *
 */
UserRoute.prototype.createReadingList = function (req, res) {
	var loginToken 	= req.body.login_token;
	var listName 	= req.body.list_name;
	var privacy		= req.body.privacy;
	var description = req.body.description;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		var sluggedName = _s.clean(listName);
		sluggedName = _s.titleize(sluggedName);
		sluggedName = sluggedName.replace(/[^a-zA-Z0-9]/g, '-');
		sluggedName = sluggedName.replace(/-{2,}/g, '-');

		ReadingList.findOne({'slug': sluggedName}, function (err, readingList) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (readingList) {
				result.message = constants.ERROR9021;
				return res.send(result);
			}

			var readingList = new ReadingList();
			readingList.name = listName;
			readingList.owner = user;
			readingList.privacy = privacy;
			readingList.slug = sluggedName;
			readingList.description = description;

			readingList.save(function (err) {
				if (err) {
					console.log(err);
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = readingList;
				return res.send(result);
			})
		});		
	});
}

/*
 *	CREATE READING LIST
 *
 */
UserRoute.prototype.editReadingList = function (req, res) {
	var loginToken 	= req.body.login_token;
	var listId		= req.body.list_id;
	var listName 	= req.body.list_name;
	var privacy		= req.body.privacy;
	var description = req.body.description;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		ReadingList.findOne({'_id' : listId} , function (err, readingList) {
			if (err) {
				console.log(err);
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!readingList) {
				result.message = constants.ERROR9022;
				return res.send(result);
			}

			var sluggedName = _s.clean(listName);
			sluggedName = _s.titleize(sluggedName);
			sluggedName = sluggedName.replace(/[^a-zA-Z0-9]/g, '-');
			sluggedName = sluggedName.replace(/-{2,}/g, '-');

			readingList.name = listName;
			readingList.privacy = privacy;
			readingList.slug = sluggedName;
			readingList.description = description;

			readingList.save(function (err) {
				if (err) {
					console.log(err);
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = readingList;
				return res.send(result);
			});
		})
		
	});
}

/*
 *	ADD ARTICLE TO READING LIST
 *
 */
UserRoute.prototype.addToReadingList = function (req, res) {
	var loginToken 	= req.body.login_token;
	var articleId 	= req.body.article_id;
	var listId		= req.body.list_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Article.findOne({ '_id': articleId }, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			ReadingList.findOne({'_id': listId}, function (err, readingList) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!readingList) {
					result.message = constants.ERROR9022;
					return res.send(result);
				}

				/* Add article to reading list */
				var articleToAdd = {
					article: article
				}
				readingList.articles.push(articleToAdd);
				readingList.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = readingList;
					return res.send(result);
				});
			});		
		});
	});
}

/*
 * REMOVE ARTICLE FROM READING LIST
 *
 */
UserRoute.prototype.removeArticleFromReadingList = function (req, res) {
	var loginToken 	= req.body.login_token;
	var articleId 	= req.body.article_id;
	var listId		= req.body.list_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token' : loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Article.findOne({ '_id': articleId }, function (err, article) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!article) {
				result.message = constants.ERROR9017;
				return res.send(result);
			}

			ReadingList.findOneAndUpdate({'_id': listId}, {
				$pull: {
					'articles' : { 'article': article._id} 
				}
			}, function (err, readingList) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!readingList) {
					result.message = constants.ERROR9022;
					return res.send(result);
				}

				result.status = 'OK';
				result.data = readingList;
				return res.send(result);
			});		
		});
	});
}

//============================== END OF ARTICLE ==============================

/*
 * POST NEW JOB
 *
 */
UserRoute.prototype.postJob = function (req, res) {
	var loginToken 	= req.body.login_token;
	var adminToken 	= req.body.admin_token;
	var pageId 	= req.body.page_id;
	var title = req.body.title;
	var description = req.body.description;
	var requirements = req.body.requirements;
	var industries = req.body.industries;
	var salary = {
		min: req.body.salary_min,
		max: req.body.salary_max,
		currency: req.body.salary_currency
	};
	var experience = {
		min: req.body.experience_min,
		max: req.body.experience_max
	};
	var perks = req.body.perks;
	var quantity = req.body.quantity;
	var location = req.body.location;
	var dateExpire = req.body.date_expire;
	var reviewers = req.body.reviewers;

	console.log(reviewers);

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		Page.findOne({ $and: [{'_id': pageId}, { 'adminLogins.token' : adminToken }]}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			var job = new Job();
			job.title = title;
			job.description = description;
			job.requirements = requirements;
			job.industries = industries;
			job.salary = salary;
			job.experience = experience;
			job.perks = perks;
			job.quantity = quantity;
			job.location = location;
			job.dateExpire = dateExpire;
			job.owner = page._id;
			job.user = user._id;

			// Use async to find all reviewers
			var reviewerObject = {
					findReviewer: function (reviewerId, callback) {
						/* Find applications by job id */
						var jobSummary = {
							_id: job._id,
							title: job.title,
							status: job.status,
							numberOfApplicants: 0
						}

						User.find({'_id': reviewerId}, function (err, reviewer) {
							if (err) {
								result.message = constants.ERROR2000;
								return res.send(result);
							}

							if (!reviewer) {

							}

							
							callback(null, reviewer);
						});
						
					}
				}

				async.map(reviewers, reviewerObject.findReviewer.bind(reviewerObject), function (err, callbackResult) {
					//console.log(callbackResult);
					for (var  i = 0; i < callbackResult.length; i++) {
						//console.log(callbackResult[i]);
						job.reviewers.push(callbackResult[i][0]);
					}

					job.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return res.send(result);
						}

						result.status = 'OK';
						result.data = job;
						return res.send(result);
					});
				});


			
		});
	});
}

/*
 * APPLY JOB
 *
 */
UserRoute.prototype.applyJob = function (req, res) {
	var loginToken 	= req.body.login_token;
	var jobId 	= req.body.job_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Check if the application has closed also */
		Job.findOne({ '_id': jobId}, function (err, job) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!job) {
				result.message = constants.ERROR9023;
				return res.send(result);
			}

			Application.findOne({ $and: [{'user': user._id}, {'job': job._id}]}, function (err, application) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (application) {
					result.message = constants.ERROR9024;
					return res.send(result);
				}

				var application = new Application();
				application.job = job;
				application.user = user;

				application.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = application;
					return res.send(result);
				});
			});			
		});
	});
};

/*
 * UNAPPLY JOB
 *
 */
UserRoute.prototype.unapplyJob = function (req, res) {
	var loginToken 		= req.body.login_token;
	var applicationId 	= req.body.application_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}
		console.log('Application: ' + applicationId);
		/* Check if the application has closed also */
		Application.findOne({ '_id': applicationId}, function (err, application) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!application) {
				result.message = constants.ERROR9024;
				return res.send(result);
			}

			application.remove(function (err) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				result.status = 'OK';
				return res.send(result);
			});
		});
	});
};

/*
 * Registered user needs to log in as administrator before he/she can do any activities on page.
 * This method will return with a admin token.
 */
UserRoute.prototype.loginAsAdmin = function (req, res) {
	var loginToken 	= req.body.login_token;
	var pageId 		= req.body.page_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ $and: [ {'_id': pageId }, {'admins': user._id}]}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			require('crypto').randomBytes(48, function (ex, buf) {
            	var adminToken = buf.toString('hex');

            	var adminLogin = {
					admin: user,
					token: adminToken
				}

				page.adminLogins.push(adminLogin);
				page.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					result.data = adminLogin;
					return res.send(result);
				});
        	});
		});	
	});
}

UserRoute.prototype.findApplicationByJobId = function (req, res) {
	var loginToken 	= req.query.login_token;
	var jobId 		= req.params.job_id;
	var adminToken 	= req.query.admin_token;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		} 

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ 'adminLogins.token': adminToken}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			

			/* Find all applications by job id */
			// Application.find({'job': jobId}, function (err, applications) {
			// 	if (err) {
			// 		result.message = constants.ERROR2000;
			// 		return res.send(result);
			// 	}

			// 	if (!applications) {
			// 		result.message = constants.ERROR9000;
			// 		return res.send(result);
			// 	}

			// 	var callbackFunctions = [];
			// 	var users = [];

			// 	var findUserProfile = function (userId) {
			// 		console.log('User Id: ' + userId);
			// 		User.findOne({'_id': userId}, function (err, applicant) {
			// 			if (err) {
			// 				result.message = constants.ERROR2000;
			// 				return null;
			// 			}

			// 			if (!applicant) {
			// 				return null;
			// 			}
			// 			console.log(applicant.local.username);
			// 			return applicant;
			// 		});
			// 	}

			// 	console.log('=====================')

			// 	/* Do all join and mapping here */
			// 	for (var i = 0; i < applications.length; i++) {
			// 		var application = applications[i];
			// 		var applicantId = application.user;
			// 		//console.log(application);
			// 		//var applicant = findUserProfile(application.user);
			// 		//console.log(applicant);

			// 		(function (applicantId) {
			// 			var assignTag = function (callback) {
			// 				var functions = [];
			// 				var user = {
			// 					username: '',
			// 					school: []
			// 				}
			// 				var findUser = function () {
			// 					User.findOne({ '_id': applicantId}, function (err, applicant) {
			// 						if (err) { }

			// 						if (applicant) {
			// 							console.log('Name: ' + applicant.local.username);
			// 							user.username = applicant.local.username;
			// 							users.push(applicant.local.username);
			// 							//callback();
			// 						}
			// 					});
			// 				}

			// 				var findEducation = function() {
			// 					Education.find({'user': applicantId}, function (err, educations) {
			// 						if (err) { }

			// 						if (educations) {
			// 							for (var i = 0; i < educations.length; i++) {
			// 								var education = educations[i];
			// 								console.log('Education: ' + education.schoolName);
			// 								user.school.push(education.schoolName);
			// 							}
			// 							console.log(user);
			// 							callback();
			// 						}
			// 					})
			// 				}

			// 				functions.push(findUser, findEducation);

			// 				async.parallel(functions, function (err, results) {
			// 					console.log('Finish Async');
			// 					callback();
			// 				});

			// 				// User.findOne({ '_id': applicantId}, function (err, applicant) {
			// 				// 	if (err) { }

			// 				// 	if (!applicant) {
			// 				// 		callback();
			// 				// 	} else {
			// 				// 		console.log(applicant.local.username);
			// 				// 		users.push(applicant.local.username);
			// 				// 		callback();
			// 				// 	}
			// 				// });
			// 			};
			// 			callbackFunctions.push(assignTag);
			// 		})(applicantId);
			// 	}

			// 	async.parallel(callbackFunctions, function (err, results) {
			// 		result.status = 'OK';

			// 		console.log(result);
			// 		return res.send(result);
			// 	});		
				
			// });

			var o = {};
			o.map = function () {
				var output = {id: this._id, user: this.user, date: this.dateCreated};
				emit(this._id, output);
			};

			o.reduce = function (k, vals) {
				var output = {id: null, user: null, date: null};
				// vals.forEach(function (v) {
				// 	if (output.id == null) {
				// 		output.id = v._id;
				// 	}

				// 	if (output.user == null) {
				// 		output.user = v.user;
				// 	}

				// 	if (output.date == null) {
				// 		output.date = v.date;
				// 	}
				// })
				return output;
			};

			o.query = { job: jobId};
			o.out = { replace: 'createdCollectionNameForResults' }
			
			Application.mapReduce(o, function (err, model, stats) {
				console.log('map reduce took %d ms', stats.processtime);

				 model.find().exec(function (err, docs) {
				    console.log(docs);

				    result.status = 'OK';
					result.data = docs;
					return res.send(result);
				  });
				
			});


		});	
	});
}

/*
 *	FIND ARTICLE BY URL-FRIENDLY TITLE
 *
 */

//=================================== JOB BOARD ===================================
/*
 * Find all job posting by employer (company) id
 * Each job posting will have basic information like: status, 
 */
UserRoute.prototype.findJobListingByEmployeeId = function (req, res) {
	var loginToken 	= req.body.login_token;
	var adminToken 	= req.body.admin_token;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ 'adminLogins.token': adminToken}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			Job.find({'owner': page._id}, function (err, jobs) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!jobs) {
					result.message = constants.ERROR9025;
					return res.send(result);
				}

				var jobIds = [];
				for (var i = 0; i < jobs.length; i++) {
					jobIds.push(jobs[i]._id);
				}

				var jobObject = {
					findJob: function (job, callback) {
						/* Find applications by job id */
						var jobSummary = {
							_id: job._id,
							title: job.title,
							status: job.status,
							numberOfApplicants: 0
						}

						Application.find({'job': job._id}, function (err, applications) {
							if (err) {
								result.message = constants.ERROR2000;
								return res.send(result);
							}

							if (!applications) {

							}
							jobSummary.numberOfApplicants = applications.length;
							callback(null, jobSummary);
						});
						
					}
				}

				async.map(jobs, jobObject.findJob.bind(jobObject), function (err, callbackResult) {
					result.status = 'OK';
					result.data = callbackResult;
					return res.send(result);
				});
			});

		});
	});
}

//=================================== JOB BOARD ===================================
/*
 * Find all job posting by employer (company) id
 * Each job posting will have basic information like: status, 
 */
UserRoute.prototype.shortlistApplicant = function (req, res) {
	var loginToken 	= req.body.login_token;
	var adminToken 	= req.body.admin_token;
	var applicationId = req.body.applicationid;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ 'adminLogins.token': adminToken}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			Application.findOne({ $and: [{'_id' : applicationId}, {'status': 'APPLIED'}] }, function (err, application) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!application) {
					result.message = constants.ERROR9026;
					return res.send(result);
				}

				application.status = 'SHORTLISTED';
				application.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					return res.send(result);
				});
			});
		});
	});
}

//=================================== JOB BOARD ===================================
/*
 * Find all job posting by employer (company) id
 * Each job posting will have basic information like: status, 
 */
UserRoute.prototype.employApplicant = function (req, res) {
	var loginToken 	= req.body.login_token;
	var adminToken 	= req.body.admin_token;
	var applicationId = req.body.applicationid;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ 'adminLogins.token': adminToken}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			Application.findOne({ $and: [{'_id' : applicationId}, { 'status': 'SHORTLISTED'}]}, function (err, application) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!application) {
					result.message = constants.ERROR9026;
					return res.send(result);
				}

				application.status = 'EMPLOYED';
				application.save(function (err) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					result.status = 'OK';
					return res.send(result);
				});
			});
		});
	});
}

//=================================== ADD REVIEWER TO JOB LISTING ===================================
/*
 * EVERY JOB HAS A PANEL OF REVIEWERS. THESE REVIEWERS WILL BE ABLE TO SHORTLIST, COMMENT ON AN APPLICANT.
 * 
 */
UserRoute.prototype.addReviewerToJobListing = function (req, res) {
	var loginToken 	= req.body.login_token;
	var adminToken 	= req.body.admin_token;
	var jobId 		= req.body.job_id;
	var reviewerId 	= req.body.reviewer_id;

	var result = {
		status: 'FAILED',
		message: '',
		data: null
	};

	User.findOne({'platforms.token': loginToken}, function (err, user) {
		if (err) {
			result.message = constants.ERROR2000;
			return res.send(result);
		}

		if (!user) {
			result.message = constants.ERROR9015;
			return res.send(result);
		}

		/* Find page with Id and admin user id */
		Page.findOne({ 'adminLogins.token': adminToken}, function (err, page) {
			if (err) {
				result.message = constants.ERROR2000;
				return res.send(result);
			}

			if (!page) {
				result.message = constants.ERROR9020;
				return res.send(result);
			}

			// Find job Id
			Job.findOne({'_id': jobId}, function (err, job) {
				if (err) {
					result.message = constants.ERROR2000;
					return res.send(result);
				}

				if (!job) {
					result.message = constants.ERROR9026;
					return res.send(result);
				}

				if (job.status == 'CLOSED') {
					result.message = constants.ERROR9027;
					return res.send(result);
				}

				// Find reviewer id
				User.findOne({'_id': reviewerId}, function (err, reviewer) {
					if (err) {
						result.message = constants.ERROR2000;
						return res.send(result);
					}

					if (!reviewer) {
						result.message = constants.ERROR9002;
						return res.send(result);
					}

					job.reviewers.push(reviewer);
					job.save(function (err) {
						if (err) {
							result.message = constants.ERROR2000;
							return res.send(result);
						}

						result.status = 'OK';
						result.data = job;
						return res.send(result);
					});
				});
			});
		});
	});
}

module.exports = UserRoute;