
/*
 * New Business Controller 
 */
PopInTownControllers.controller('TransactionsCtrl', ['$scope', '$window', 'UserService', '$resource', 
	function($scope, $window, UserService, $resource) {

	/*
	 * Initialize controller when first loading page
	 */
	$scope.init = function (){
		// If user is not logged in, redirect to homepage
		if (!$window.sessionStorage.token) {
			$window.location.href = '/';
		}

		// Get user from database with login token.
		var token = $window.sessionStorage.token;

		var User = $resource('/api/v1/user/token/:tokenId', {tokenId : '@tokenId'});
		var user = User.get({tokenId : token}, function (data) {

			if (data.status == 'OK') {
				$scope.user = data.results;
				toastr.info(JSON.stringify($scope.user));
			} else {
				toastr.error(JSON.stringify(data));
			}
			
		});

	};
}]);