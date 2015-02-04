
/*
 * Rate Controller 
 * Only applicable for admin
 */
PopInTownControllers.controller('UserProfileCtrl', ['$scope', 'UserService', 'BizService', '$window', 'AdminService', 
	'$upload', '$routeParams', '$compile', '$sce',
	function($scope, UserService, BizService, $window, AdminService, $upload, $routeParams, $compile, $sce) {

	$scope.username = '';
	$scope.loginUsername = '';
	$scope.isFollowing = false;

	/* If logged in user is viewing his own profile */
	$scope.isMyself = false;

	$scope.xVal = 0;

	$scope.cropValue = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		loginToken: ''
	}

	$scope.profilePicture = '';

	$scope.cropapi = '';

	//$scope.imgUrl = 'http://localhost:5000/img/profile_temp/6f7c9f50-f0b2-11e3-860d-27cab1d1e1ef_247373_10150286368692316_778977315_9191359_3680885_n.jpg';
	$scope.imgUrl = '';

	/* The user to retrieve with username */
	$scope.targetUser = null;

	/* Logged in user retrieved with login token */
	$scope.loggedinUser = null;

	/* Tab controller */
	$scope.tab = 'home';

	$scope.exp = {
		loginToken: '',
		message: null,
		company: '',
		title: '',
		location: '',
		description: '',
		isWorking: false,
		dateStarted: {
			day: '',
			month: '',
			year: ''
		},
		dateEnded: {
			day: '',
			month: '',
			year: ''
		}
	};

	/* Education data model */
	$scope.edu = {
		loginToken: '',
		school: '',
		degree: '',
		major: '',
		grade: '',
		studyField: '',
		activities: '',
		description: '',
		dateStarted: {
			day: '',
			month: '',
			year: ''
		},
		dateEnded: {
			day: '',
			month: '',
			year: ''
		},
		educationLevel: 'Undergraduate',
		message: null
	};

	/* posts by user */
	$scope.posts = null;

	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                'November', 'December'];

	$scope.eduYears = null;

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

	var data = {
          article : '<p><strong>Hello World</strong></p><div ui-ace="{onLoad : aceLoaded, mode: \'javascript\',theme:\'monokai\'}" style="height:200px">var test = 1;var test = function() {    return 1;}</div>'
      }
      $scope.data = data;

    $scope.codeHighlight = "<pre class='code-highlight'>\n[code language='javascript' theme='monokai' size='16' ]\n\n[/code]\n</pre>";

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

	$scope.highlightTest = '<div ui-ace style="height:200px">Test</div>';
	$scope.bindHtmlTest = '<h1>Bind HTML Test</h1>';
	$scope.compiledTest =  $sce.trustAsHtml('<div ui-ace="{theme:"twilight"}" style="height:200px">Anohther Test</div>');

	$scope.init = function(username, loginToken) {

		/* Well, we just need target username and a login token */

		/* target user */
		$scope.username = $routeParams.username;

		$scope.loginToken = $scope.$parent.loginToken;
		$scope.edu.loginToken = $scope.$parent.loginToken;
		$scope.exp.loginToken = $scope.$parent.loginToken;

		/* Get target user data with given username */
		UserService.findUserByUsername($scope.username).success(function (data) {

			/* Redirect user to homepage if target user is not found */
			if (data.status != 'OK') {
				$window.location.href = '/';
			}

			$scope.targetUser = data.results;
			console.log($scope.targetUser + '/' + username);
			/* User not logged in */
			if (!$scope.loginToken) {

			}

			/* Get logged in user data */
			UserService.findUserByLoginToken($scope.loginToken).success(function (data) {
				$scope.loggedinUser = data.results;

				if (data.status != 'OK') {

				}

				/* Check if logged in user is visiting his own profile */
				if ($scope.loggedinUser != null && $scope.loggedinUser._id == $scope.targetUser._id) {
					$scope.isMyself = true;
				}
				console.log('Is Myself: ' + $scope.isMyself + '/' + $scope.loginToken);
			});

			/* Get posts by user */
			$scope.findPostByUsername($scope.username);

		});

		/* Check if logged in user is following target user */

		// asign login token to crop value
		$scope.cropValue.loginToken = $scope.loginToken;
		
	};

	$scope.init();

	/* Add education to user profile */
	$scope.addEducation = function () {
		UserService.addNewEducation($scope.edu).success(function (result) {
			if (result.status == 'OK') {
				console.log(result);

				/* hide education add dialog */
				$scope.hideAddEduDialog();
			} else {
				console.log(result);
			}
		});
	};

	/* Add education to user profile */
	$scope.addExperience = function () {
		UserService.addExperience($scope.exp).success(function (result) {
			if (result.status == 'OK') {
				console.log(result);

				/* hide education add dialog */
				$scope.hideAddExpDialog();
			} else {
				console.log(result);
			}
		});
	};

	/*
	 * Remove education from user
	 */
	$scope.removeExperience = function (expId) {
		UserService.removeExperience({loginToken: $scope.loginToken, expId: expId}).success(function (result) {
			if (result.status == 'OK') {
				console.log(result);
			} else {
				console.log(result);
			}
		});
	};

	/*
	 * Remove education from user
	 */
	$scope.removeEducation = function (eduId) {
		UserService.removeEducation({loginToken: $scope.loginToken, eduId: eduId}).success(function (result) {
			if (result.status == 'OK') {
				console.log(result);
			} else {
				console.log(result);
			}
		});
	};

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

	/*
	 *	Show user profile dialog
	 */
	$scope.showUserProfileDialog = function() {
		$('#profilePicModal').modal('show');
	};

	$scope.hideUserProfileDialog = function() {
		$('#profilePicModal').modal('hide');
	};

	// Connect to a another user
	$scope.connect = function () {
		
	};

	$scope.unfollow = function () {
		$scope.isFollowing = false;

		if (!$scope.loginToken) {
			return;
		}

		UserService.unfollow({ 
			loginToken: $scope.loginToken, username: $scope.username 
		}).success(function (data) {

			if (data.status !== 'OK') {
				toastr.error('Something wrong ' + JSON.stringify(data));
			} else {
				//var socket = io.connect('http://localhost:5000');

				//socket.emit('follow_noti', {follower: );

				$scope.isFollowing = false;
			}
		});
	};

	// Follow a user
	$scope.follow = function () {		

		if (!$scope.loginToken) {
			return;
		}

		// Send follow request to server. When we successfully follow a user, send notification to server
		// to 
		UserService.follow({ 
			loginToken: $scope.loginToken, username: $scope.username 
		}).success(function (data) {

			if (data.status !== 'OK') {
				toastr.error('Something wrong ' + JSON.stringify(data));
			} else {
				//var socket = io.connect('http://localhost:5000');

				//$scope.socket.emit('follow_noti', {loginUser: data.results.loginUser, targetUser: data.results.targetUser});

				$scope.isFollowing = true;
			}
		});
	};

	
	/*
	 * crop image
	 */
	$scope.cropImage = function() {
		console.log($scope.cropValue.x + '/' + $scope.cropValue.y + '/' + $scope.cropValue.w + '/' + $scope.cropValue.h);
		UserService.cropProfilePicture($scope.cropValue).success(function (data) {
			
			/* exit photo dialog modal and set profile picture */
			$('#profilePicModal').modal('hide');
		}); 
	}

	$scope.selected = function (cords) {
        $scope.cropped = true;
        var rx = 200 / cords.w;
        var ry = 200 / cords.h;

        $scope.cropValue.x = cords.x;
        $scope.cropValue.y = cords.y;
        $scope.cropValue.w = cords.w;
        $scope.cropValue.h = cords.h;

        if (boundx && boundy) {
	        $('#preview-pane .preview-container img').css({
	            width: Math.round(rx * boundx) + 'px',
	            height: Math.round(ry * boundy) + 'px',
	            marginLeft: '-' + Math.round(rx * cords.x) + 'px',
	            marginTop: '-' + Math.round(ry * cords.y) + 'px'
	        });
        }
        
    };

    $scope.changed = function (cords) {
        $scope.cropped = true;
        var rx = 200 / cords.w;
        var ry = 200 / cords.h;

        $scope.cropValue.x = cords.x;
        $scope.cropValue.y = cords.y;
        $scope.cropValue.w = cords.w;
        $scope.cropValue.h = cords.h;

        if (boundx && boundy) {
	        $('#preview-pane .preview-container img').css({
	            width: Math.round(rx * boundx) + 'px',
	            height: Math.round(ry * boundy) + 'px',
	            marginLeft: '-' + Math.round(rx * cords.x) + 'px',
	            marginTop: '-' + Math.round(ry * cords.y) + 'px'
	        });
        }
        
    };

    /*
     * Show popup dialog for education add
     */
    $scope.showAddEduDialog = function () {

    	/* Get edu years */
    	if (!$scope.eduYears) {
    		UserService.getEduYears().success(function (result) {

				if (result.status !== 'OK') {
					toastr.error('Something wrong ' + JSON.stringify(result));
				} else {
					console.log(result);
					$scope.eduYears = result.data;
				}
			});
    	}

    	$('#addEduModal').modal('show');
    };

    /*
     * Show popup dialog for education add
     */
    $scope.showAddExpDialog = function () {

    	/* Get edu years */
    	if (!$scope.eduYears) {
    		UserService.getEduYears().success(function (result) {

				if (result.status !== 'OK') {
					toastr.error('Something wrong ' + JSON.stringify(result));
				} else {
					$scope.eduYears = result.data;
				}
			});
    	}

    	$('#addExpModal').modal('show');
    };

    $scope.hideAddExpDialog = function () {

    	$('#addExpModal').modal('hide');
    };

    $scope.hideAddEduDialog = function () {

    	$('#addEduModal').modal('hide');
    };

	$scope.onFileSelect = function($files) {
    	//$files: an array of files selected, each file has name, size, and type.
	    for (var i = 0; i < $files.length; i++) {
	      var file = $files[i];
	      $scope.upload = $upload.upload({
	        url: '/api/v1/user/photo/jquery-upload', //upload.php script, node.js route, or servlet url
	        // method: 'POST' or 'PUT',
	        // headers: {'header-key': 'header-value'},
	        // withCredentials: true,
	        data: {loginToken: $scope.loginToken},
	        file: file, // or list of files: $files for html5 only
	        /* set the file formData name ('Content-Desposition'). Default is 'file' */
	        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
	        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
	        //formDataAppender: function(formData, key, val){}
	      }).progress(function(evt) {
	        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	      }).success(function(data, status, headers, config) {
	        // file is uploaded successfully
	        $scope.imgUrl = data.results.file.url;
	        //$scope.cropapi.setImage($scope.imgUrl);
	        console.log(data.results.file.url);
	      });
	      //.error(...)
	      //.then(success, error, progress); 
	      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
	    }
	    /* alternative way of uploading, send the file binary with the file's content-type.
	       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
	       It could also be used to monitor the progress of a normal http post/put request with large data*/
	    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
	  };
}]);
