/*
 * Settings Controler
 */
PopInTownControllers.controller('SettingsCtrl', ['$scope', '$window', 'UserService', '$resource',
	function ($scope, $window, UserService, $resource) {

	$scope.currentTab = 'general';
	$scope.user = { };
	$scope.image = 'img/singapore.png';

	$scope.countries = 
		[
			{
				'countryCode' : 'sg',
				'countryName' : 'Singapore',
				'url'		  : 'img/singapore.png',

			},
			{
				'countryCode' : 'vn',
				'countryName' : 'Viet Nam',
				'url'		  : 'img/vietnam.png',

			}
		]
	;

	$scope.choice = $scope.countries[0].countryName;

	$scope.init = function () {
		var token = $window.sessionStorage.token;
		toastr.info(token);

		var User = $resource('/api/v1/user/token/:tokenId', {tokenId : '@tokenId'});
		var user = User.get({tokenId : token}, function (data) {

			if (data.status == 'OK') {
				$scope.user = data.results;
			} else {
				toastr.error(JSON.stringify(data));
			}
			
		});

		// Get user from database with login token.
		// UserService.findUserByLoginToken({'loginToken' : token}).success(function (data) {
		// 	toastr.info(JSON.stringify(data));
		// 	if (data.status == 'FAILED') {
		// 		toastr.error(data.error_message);
		// 	} else {
		// 		toastr.info(JSON.stringify(data));
		// 	}
		// });
	}	
}]);