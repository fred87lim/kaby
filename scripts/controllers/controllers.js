var PopInTownControllers = angular.module('PopInTownControllers', ['google-maps', ]);

PopInTownControllers.controller('MainCtrl', ['$scope', 'UserService', 'Auth' , '$location', '$window',
	function ($scope, UserService, Auth, $location, $window) {
	$scope.credential = {
		email: '',
		password: ''
	};

	$scope.signup = {
		message: '',
		username: '',
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	}

	$scope.login = {
		email: '',
		password: '',
		rememberme: true,
		message: null
	}

	$scope.loginUser = null;

	$scope.loginUserId = null;

	$scope.email = '';
	$scope.password = '';
	$scope.rememberme = true;

	$scope.loginToken = '';

	$scope.isMyself = false;

	$scope.isLoggedIn = false;

	/*
	 * Init when the page is load
	 */
	$scope.init = function (loginToken) {
		$scope.loginToken = loginToken;

		if ($window.sessionStorage.loginUserId) {
			console.log('LoginUserId: ' + $window.sessionStorage.loginUserId);
		}
		if (loginToken != 'null') {
			console.log(typeof loginToken);
			console.log(loginToken);
			$scope.isLoggedIn = true;
		} else {
			$scope.isLoggedIn = false;
		}

		/* Get user info with given login token */
		if ($scope.loginToken) {
			UserService.findUserByLoginToken($scope.loginToken).success (function (data) {
				if (data.status = 'OK') {
					$scope.loginUser = data.results;
				} else {

				}
			});
		}
	};

	/*
	 * Find user by username. Used to get user and check username availibility
	 */
	$scope.checkUsername = function () {
		UserService.findUserByUsername($scope.signup.username).success(function (data) {
			if (data.status === 'OK') {
				toastr.info(JSON.stringify(data));
			} else {
				$scope.signup.message = data.error_message;
				toastr.error(JSON.stringify(data));
			}
		});
	};

	$scope.testSocket = function () {
		var msg = 'send from user'
		// var socket = io.connect('http://localhost:5000');
		// 		  socket.on('news', function (result) {
		// 		    console.log('Received from server:' + JSON.stringify(result));
		// 		    //socket.emit('join', { my: 'result' });

		// 		    //$window.location.href = '/';
		// 		  });
	};

	$scope.signupUser = function () {
		Auth.signup({
				username: $scope.signup.username,
				firstName: $scope.signup.firstName,
				lastName: $scope.signup.lastName,
				email: $scope.signup.email,
				password: $scope.signup.password}
			).success( function (data) {
			if (data.error) {
				toastr.error(data.error);
			} else {
				toastr.success('You have been registered.' + JSON.stringify(data) + " " + data.email);
			}
		});
	};

	/*
	 * Log user in
	 *
	 * @email: user's email
	 * @password: user's password
	 * @rememberme: If user wants auto login for next visit. If flagged false, user's login session will
	 * 				expire when he/she closes the browser.
	 *
	 * If user logs in successfully, close the login dialog and refresh the current page.
	 * If user logs in unseccessfully, show the error message on login dialog.
	 */
	$scope.loginUser = function () {
		Auth.login({
			email: $scope.login.email, 
			password: $scope.login.password, 
			rememberme: $scope.login.rememberme}
		).success(function (result) {
			console.log(result);
			if (result.status == 'OK') {
				$('#loginModal').modal('hide');
				// Store login token in session for later authorization.
				$window.sessionStorage.token = result.data.loginToken;
		       	$window.sessionStorage.userType = result.data.user.userType;
		       	$window.sessionStorage.username = result.data.user.local.username;
		       	$window.sessionStorage.loginUserId = result.data.user._id;

		       	/* login user id */
		       	$scope.loginUserId = result.data.user._id;

		       	$scope.login.message = null;
		       	$window.location.href = '/';
		       	//$location.path($location.path());
		     } else {
		       	$scope.login.message = result.message;
		     }
		    }).error( function (data, status, headers, config) {
		    	delete $window.sessionStorage.token;
		    	delete $window.sessionStorage.userType;
		    	delete $window.sessionStorage.username;
		    });
	};

	/*
	 * Show Login Dialog when user clicks on navbar's login link.
	 * Reset login message in case there is previous login message error.
	 */
	$scope.showLoginDialog = function () {

		/* Reset login message */
		$scope.login.message = null;

		/* Show login dialog */
		$('#loginModal').modal('show');
	}

	/*
	 * Log user out
	 */
	$scope.logout = function () {
		Auth.logout({
			loginToken: $window.sessionStorage.token
		}).success(function (data) {
			if (data.error_message) {
				toastr.info(data.error_message);
			} else {

				// delete login token in session
				delete $window.sessionStorage.token;
				delete $window.sessionStorage.userType;
		    	delete $window.sessionStorage.username;
				$window.location.href = '/';
			}
		});
	}

	$scope.$on("USER_LOGGEDIN", function () {
		toastr.info("MainCtrl user logged in");
	});
}]);



PopInTownControllers.controller('PhoneListCtrl', ['$scope', 'Phone', function ($scope, Phone) {
	$scope.phones = Phone.query();

  	$scope.orderProp = 'age';
}]);

phonecatApp.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', function ($scope, $routeParams, Phone) {
	$scope.phone = Phone.get({ phoneId: $routeParams.phoneId}, function (phone) {
		$scope.mainImageUrl = phone.images[0];
	});
	
	$scope.setImage = function (imageUrl) {
		toastr.info("Logging In User");
		$scope.mainImageUrl = imageUrl;
	};
}]);