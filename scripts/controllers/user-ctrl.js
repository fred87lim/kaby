
/*
 * Rate Controller 
 * Only applicable for admin
 */
PopInTownControllers.controller('UserCtrl', ['$scope', 'UserService', 'BizService', '$window', 'AdminService', 
	'$upload',
	function($scope, UserService, BizService, $window, AdminService, $upload) {

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

	$scope.init = function(username, loginToken) {

		/* Well, we just need target username and a login token */

		/* target user */
		$scope.username = username;

		$scope.loginToken = loginToken;

		console.log('Init: ' + username);

		

		/* Get target user data with given username */
		UserService.findUserByUsername($scope.username).success(function (data) {
			console.log(data.results.profilePicture.url);

			/* Redirect user to homepage if target user is not found */
			if (data.status != 'OK') {
				$window.location.href = '/';
			}

			$scope.targetUser = data.results;

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
				console.log('Is Myself: ' + $scope.isMyself);
			});
		});

		

		/* Check if logged in user is following target user */

		// asign login token to crop value
		$scope.cropValue.loginToken = loginToken;

		// Initialize socket io connection
		//$scope.socket = io.connect('http://localhost:5000');

		// Tell server that you are connecting to server through socket io
		//$scope.socket.emit('log in', {loginUsername: $scope.loginUsername});

		// $scope.socket.on('follow_noti', function (result) {
		// 	toastr.info('Receive notification: ' + JSON.stringify(result));
		// });

		/* Get target user */
		
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
