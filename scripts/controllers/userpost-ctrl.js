
/*
 * Rate Controller 
 * Only applicable for admin
 */
PopInTownControllers.controller('UserPostCtrl', ['$scope', 'UserService', 'BizService', '$window', 'AdminService', 
	'$upload', '$routeParams', '$compile', '$sce',
	function($scope, UserService, BizService, $window, AdminService, $upload, $routeParams, $compile, $sce) {

	$scope.username = '';
	$scope.urlTitle = '';
	
	/* If logged in user is viewing his own profile */
	$scope.isMyself = false;

	$scope.article = null;

	/* The user to retrieve with username */
	$scope.targetUser = null;

	/* Logged in user retrieved with login token */
	$scope.loggedinUser = null;

	$scope.showUnlike = false;

	$scope.loginLikeId = null;

	/* posts by user */
	$scope.post = null;

	$scope.aceLoaded = function(_editor){
	    // Editor part
	    var _session = _editor.getSession();
	    var _renderer = _editor.renderer;

	    console.log('ACE loaded');

	    // Options
	    _editor.setReadOnly(true);
	    _editor.setOptions({
	    	maxLines: 15
	    });
	    // _session.setUndoManager(new ace.UndoManager());
	    // _renderer.setShowGutter(false);

	    // Events
	    // _editor.on("changeSession", function(){ ... });
	    // _session.on("change", function(){ ... });
	  };

    $scope.convertContentToContentACE = function (content) {
    	var codeTagRegex = /(\[code [^\]]*\])/;
    	var closingCodeTagRegex = /\[\/code\]/;
    	var languageRegex = /language='(\w+)/;
    	var themeRegex = /theme='(\w+)/;

    	var codeTag = content.match(codeTagRegex);
    	if (codeTag) {
    		codeTag = codeTag[1];
			var language = codeTag.match(languageRegex);
			/* Set default if null */
			if (!language) {
				language = 'javascript';
			} else {
				language = language[1];
			}

    		var theme = codeTag.match(themeRegex);

    		if (!theme) {
    			theme = 'monokai';
    		} else {
    			theme = theme[1];
    		}

    		var openingAceTag = '<div ui-ace="{onLoad: aceLoaded, mode:\'' + language + '\', theme:\'' + 
    			theme + '\'}">';
    		var closingAceTag = '</div>';

    		var replaced = content.replace(codeTagRegex, openingAceTag);
    		replaced = replaced.replace(closingCodeTagRegex, closingAceTag);
    		return replaced;
    	}
    	return content;    	
    };

	$scope.init = function() {

		/* Well, we just need target username and a login token */

		/* target user */
		$scope.username = $routeParams.username;

		$scope.urlTitle = $routeParams.urlTitle;

		$scope.loginToken = $scope.$parent.loginToken;

		$scope.newComment.loginToken = $scope.loginToken;
		$scope.like.loginToken = $scope.loginToken;

		/* Find post by post url title and username */
		UserService.findPostsByUsernameAndTitle($scope.username, $scope.urlTitle).success(function (result) {
			if (result.status == 'OK') {
				console.log(result.data);
				$scope.post = result.data.post;
				$scope.article = result.data;
				var replacedContent = $scope.convertContentToContentACE($scope.article.post.content);
				$scope.article.post.content = replacedContent;

				$scope.newComment.parentId = $scope.article.post._id;
				$scope.like.parentId = $scope.article.post._id;

				/* Check if login user like this article so that we can show unlike */
				if ($scope.$parent.loginUser) {
					for (var i = 0; i < $scope.article.likes.length; i++) {
						var like = $scope.article.likes[i];
						if ($scope.$parent.loginUser._id == like.liker) {
							$scope.showUnlike = true;
							$scope.loginLikeId = like.id;
							break;
						}
					}
				}
			} else {

			}
		});
		
	};

	$scope.newComment = {
		loginToken: '',
		commentContent: '',
		parentId: '',
	}

	$scope.like = {
		loginToken: '',
		parentId: ''
	}

	$scope.deleteComment = function (commentId) {
		var loginToken = $scope.$parent.loginToken;
		UserService.deleteComment(loginToken, commentId).success(function (result) {
			if (result.status == 'OK') {
				console.log(result);
			} else {
				console.log(result);
			}
		});
	}

	$scope.createNewComment = function () {
		UserService.createNewComment($scope.newComment).success(function (result) {
			if (result.status == 'OK') {
				console.log(result.data);
			} else {
				console.log(result);
			}
		});
	};

	$scope.createNewLike = function () {
		UserService.createNewLike($scope.like).success(function (result) {
			if (result.status == 'OK') {
				console.log(result.data);
				$scope.showUnlike = true;
				$scope.loginLikeId = result.data._id;
			} else {
				console.log(result);
			}
		});
	};

	$scope.unlike = function (likeId) {
		var loginToken = $scope.$parent.loginToken;
		UserService.unlike(loginToken, likeId).success(function (result) {
			if (result.status == 'OK') {
				console.log(result);
				$scope.showUnlike = false;
			} else {
				console.log(result);
			}
		});
	}

	$scope.init();

	$scope.findPostByUsername = function (username) {
		UserService.findPostsByUser(username).success(function (result) {
			if (result.status == 'OK') {
				$scope.posts = result.data;
				for (var i = 0; i < $scope.posts.length; i++) {
					var post = $scope.posts[i];
					var replacedContent = $scope.convertContentToContentACE(post.content);
					post.content = replacedContent;
					console.log(replacedContent);
				}				
			} else {
				console.log(result);
			}
		});
	}
}]);
