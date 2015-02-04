
/*
 * Rate Controller 
 * Only applicable for admin
 */
PopInTownControllers.controller('RateCtrl', ['$scope', 'GoogleMapsService', 'BizService', '$window', 'AdminService', 
	function($scope, GoogleMapsService, BizService, $window, AdminService) {

	$scope.rate = {
		operatingCost: 10.00,
		charityCost: 2.00,
		isActive: true,
		loginToken: $window.sessionStorage.token
	};

	$scope.init = function() {
		// If user is not logged in, redirect to homepage 
		if (!$window.sessionStorage.token) {
			$window.location.href = '/';
		}

		// If user is not an admin, redirect to homepage
		var userType = $window.sessionStorage.userType;
		toastr.info('user type: ' + userType);

		if (!userType || userType != 'ADMIN') {
			$window.location.href = '/';
		}
	};

	$scope.createNewRate = function () {
		// create new rate
		AdminService.createNewRate($scope.rate).success(function (data) {
			toastr.info(JSON.stringify(data));
		});
	};
}]);