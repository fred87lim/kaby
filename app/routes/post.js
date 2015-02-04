var models       		= require('../../app/models/user');
var Biz				= require('../../app/models/biz');
var Rate				= require('../../app/models/rate');
var Experience				= require('../../app/models/experience');
var Post				= require('../../app/models/article');
var Photo 				= require('../../app/models/photo');
var Comment				= require('../../app/models/comment');
var Like				= require('../../app/models/like');

var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;

var request = require('request');
var uuid = require('node-uuid');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: false });

var paypal = require('paypal-rest-sdk');

module.exports = function (app, passport) {

	/*
	 * Find a particular post from a user with given username and url title
	 */
	app.get('/api/v1/user/post/:username/:urlTitle', function (req, res) {
		var username = req.params.username;
		var urlTitle = req.params.urlTitle;

		var tempComments = null;

		var result = {
			status: 'FAILED',
			message: '',
			data: {
				post: null,
				comments: [],
				likes: []
			}
		};

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
				// remove some sensitive information before returning json
				var profilePicture;

				user.local.activationCode = undefined;
				user.local.passport = undefined;
				user.platforms = undefined;

				/* Get profile picture */
				Post.findOne({ $and :[{'urlTitle': urlTitle}, {'author': user._id}]}, function (err, post) {
					if (err) {
						console.log(err);
						result.message = 'Something went wrong. Please try again';
						res.send(result);
						return;
					}

					if (!post) {
						result.message = 'Invalid url title';
						res.send(result);
						return;
					}

					/* Get likes, comments, shares */
					var findComments = function (callback) {
						Comment.find({ $and: [{'parentType': 'POST'}, {'parentId': post._id}]}, function (err, comments) {
						if (err) {
							console.log(err);
						}
						
						var articleComments = [];

						if (comments) {
							/* For each comment we need to get the commenter's information */
							var findComments = [];

							for (var i = 0; i < comments.length; i++) {
								var commenterId = comments[i].commenter;
								
								var comment = {
									id: comments[i]._id,
									commenter: comments[i].commenter,
									content: comments[i].content,
									dateCreated: comments[i].dateCreated,
									commenterName: '',
									commenterUsername: '',
									parentId: comments[i].parentId
								}
								articleComments.push(comment);
							}
						}

						var findCommenter = function (comment, callback) {
									models.User.findOne({'_id': comment.commenter}, function (err, commentUser) {
										if (err) {
											console.log(err);
										}

										if (commentUser) {
											var name = commentUser.local.firstName + ' ' + commentUser.local.lastName;
											comment.commenterName = name;
											comment.commenterUsername = commentUser.local.username;
											result.data.comments.push(comment);
											//console.log(articleComments);


										}

										callback();
									});
								};
						
						async.each(articleComments, findCommenter, function (err) {
							if (err) {
								console.log(err);
							}

							console.log('===========');
							 	console.log(result.data.comments);
							callback(null, articleComments);
						});

						
					});
					};

					var findLikes = function (callback) {
						Like.find({ $and: [{'parentType': 'POST'}, {'parentId': post._id}]}, function (err, likes) {
						if (err) {
							console.log(err);
						}

						var articleLikes = [];

						if (likes) {
							//result.data.likes = likes;

							/* Find liker info here */
							var findLikerAsync = [];

							for (var i = 0; i < likes.length; i++) {
								var like = {
									id: likes[i]._id,
									liker: likes[i].liker,
									likerName: '',
									likerUsername: '',
									dateCreated: likes[i].dateCreated
								};

								articleLikes.push(like);
							}

							var findLiker = function (like, callback) {
									models.User.findOne({'_id': like.liker}, function (err, likeUser) {
										if (err) {
											console.log(err);
										}

										if (likeUser) {
											var name = likeUser.local.firstName + ' ' + likeUser.local.lastName;
											like.likerName = name;
											like.likerUsername = likeUser.local.username;
											result.data.likes.push(like);
											//console.log(articleComments);
											
										}

										callback();
									});
								};

							async.each(articleLikes, findLiker, function (err) {
							if (err) {
								console.log(err);
							}
							callback(null, articleLikes);
						})

						}

						// async.parallel(findLikerAsync, function (err, r) {
						// 	 	if (err) {
						// 	 		console.log(err);
						// 	 	}
						// 	 	result.data.likes = articleLikes;
						// 		callback(null, likes);
						// 	});

						
					});
					};

					var calls = [findComments, findLikes];

					async.parallel(calls, function(err, r) {
					    /* this code will run after all calls finished the job or
					       when any of the calls passes an error */
					    //console.log('End call');
					    //console.log(r);
					    if (err)
					        return console.log(err);
					    result.status = 'OK';
						result.data.post = post;

						/* Assume we have all data here. Now it's time to look up commenter name and thumbnail */
						// var findCommenter = function (comment, callback) {
						// 			models.User.findOne({'_id': comment.commenter}, function (err, user) {
						// 				if (err) {
						// 					console.log(err);
						// 				}

						// 				if (user) {
						// 					var name = user.local.firstName + ' ' + user.local.lastName;
						// 					comment.commenterName = name;
						// 					comment.commenterUsername = user.local.username;
						// 					//articleComments.push(comment);
						// 					console.log(comment);
						// 					result.data.comments.push(comment);

						// 				}

						// 				callback();
						// 			});
						// 		};

						//console.log('Comment');
						

						// async.each(tempComments, findCommenter, function (err) {
						// 	console.log('All commentor found');
						// 	res.send(result);
						// });
						res.send(result);
						//console.log(result.data.comments);

						//console.log(result);
						
					});

					
				});
			}
		});
	});

	/*
	 *	Add new post
	 * 	Require:
	 * 		@loginToken:
	 * 		@title:
	 *		@content:
	 *		@url:
	 *		@urlTitle
	 *		@	
	 */
	app.post('/api/v1/user/post/new', function (req, res) {
		var loginToken = req.body.loginToken;

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.send({'status' : 'FAILED', 'error_message': 'User not found.'});
			}

			var title = req.body.title;
			var content = req.body.content;
			var url = req.body.url;
			var urlTitle = req.body.urlTitle;
			var status = 'PUBLISHED';

			var newPost = new Post();
			newPost.title = title;
			newPost.content = content;
			newPost.url = url;
			newPost.status = status;
			newPost.urlTitle = urlTitle;
			newPost.author = user;

			newPost.save(function (err) {
				if (err) {
					throw err;
				}

				console.log('Create new post: ' + JSON.stringify(newPost));
				res.send({'status': 'OK', 'results' : newPost});
			})
		});
	});

	/*
	 *	Delete a comment from an article
	 *	Required:
	 *		@loginToken
	 *		@commentId
	 */
	app.delete('/api/v1/user/post/comment/:commentId', function (req, res) {
		var commentId = req.params.commentId;
		var loginToken = req.query.loginToken;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Something goes wrong';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'You must be logged in to comment';
				res.send(result);
				return;
			}

			/* Find the comment for deletion with given commenter and comment id */
			Comment.findOne({ $and: [{'_id': commentId}, {'commenter': user._id}]}, function (err, comment) {
				if (err) {
					console.log(err);
				}

				if (!comment) {
					result.message = 'Comment not found';
					res.send(result);
					return;
				}

				if (comment) {
					comment.remove(function (err) {
						if (err) {
							console.log(err);
						}

						result.status = 'OK';
						result.message = 'Comment has been deleted';
						res.send(result);
						return;
					});
				}
			});
		});
	});

	/*
	 * 		Add comment to a post
	 *		Required:
	 *			@loginToken:
	 *			@postId:
	 *			@content:
	 */
	app.post('/api/v1/user/post/comment', function (req, res) {
		var loginToken 	= req.body.loginToken;
		var parentId 		= req.body.parentId;
		var content 	= req.body.commentContent;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		/* Find logged in user */
		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Something goes wrong';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'You must be logged in to comment';
				res.send(result);
				return;
			}

			console.log('Find post id: ' + parentId);

			/* Find given post */
			Post.findOne({ '_id': parentId }, function (err, post) {
				if (err) {
					console.log(err);
					result.message = 'Something goes wrong';
					res.send(result);
					return;
				}

				if (!post) {
					result.message = 'Invalid post.';
					res.send(result);
					return;
				}

				console.log('Add new comment');

				/* Add comment */
				var comment = new Comment();
				comment.content = content;
				comment.parentType = 'POST';
				comment.commenter = user;
				comment.parentId = post._id;

				comment.save(function (err) {
					if (err) {
						console.log(err);
					}

					result.status = 'OK';
					result.data = comment;

					res.send(result);
				});
			});
		});
	});

	/*
	 *	Unlike an article
	 *	Required:
	 *		@loginToken
	 * 		@likeId
	 */
	app.delete('/api/v1/user/post/like/:likeId', function (req, res) {
		var likeId = req.params.likeId;
		var loginToken = req.query.loginToken;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Something goes wrong';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'You must be logged in to comment';
				res.send(result);
				return;
			}

			/* Find the comment for deletion with given commenter and comment id */
			Like.findOne({ $and: [{'_id': likeId}, {'liker': user._id}]}, function (err, like) {
				if (err) {
					console.log(err);
				}

				if (!like) {
					result.message = 'Like not found';
					res.send(result);
					return;
				}

				if (like) {
					like.remove(function (err) {
						if (err) {
							console.log(err);
						}

						result.status = 'OK';
						result.message = 'You have unliked this article successfully.';
						res.send(result);
						return;
					});
				}
			});
		});
	});

	/*
	 *		Like a post
	 *		Required:
	 *			@loginToken:
	 *			@postId:
	 *			@
	 */
	app.post('/api/v1/user/post/like', function (req, res) {
		var loginToken 	= req.body.loginToken;
		var parentId 		= req.body.parentId;

		var result = {
			status: 'FAILED',
			message: '',
			data: null
		};

		/* Find logged in user */
		models.User.findOne({'platforms.token' : loginToken}, function (err, user) {
			if (err) {
				console.log(err);
				result.message = 'Something goes wrong';
				res.send(result);
				return;
			}

			if (!user) {
				result.message = 'You must be logged in to comment';
				res.send(result);
				return;
			}

			/* Find given post */
			Post.findOne({ '_id': parentId }, function (err, post) {
				if (err) {
					console.log(err);
					result.message = 'Something goes wrong';
					res.send(result);
					return;
				}

				if (!post) {
					result.message = 'Invalid post.';
					res.send(result);
					return;
				}

				/* Check if user has already like this post */
				Like.findOne({'parentId': post._id}, function (err, like) {
					if (err) {
						console.log(err);
						result.message = 'Something goes wrong';
						res.send(result);
						return;
					}

					if (like) {
						result.message = 'You have already liked this post.';
						res.send(result);
						return;
					}

					/* Add comment */
					var like = new Like();
					like.parentType = 'POST';
					like.liker = user;
					like.parentId = post._id;

					like.save(function (err) {
						if (err) {
							console.log(err);
						}

						result.status = 'OK';
						result.data = like;

						res.send(result);
					});
				});				
			});
		});
	});


};