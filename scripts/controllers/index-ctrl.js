PopInTownControllers.controller('IndexCtrl', ['$scope', '$window', 'UserService', '$resource', 'PayPalService',
	function ($scope, $window, UserService, $resource, PayPalService) {

	$scope.actionTab = 'status';
	
	$scope.topup = {
		message: '',
		amount: 0,
		cardNumber: '',
		cardName: '',
		expiry: '',
		cvv: '',
		currency: 'USD' // must be defined in server side. Here only for display
	};

	$scope.topupPayPal = function() {
		PayPalService.payWithPayPal($scope.topup).success( function (data) {
			if (data.status != 'OK') {
				toastr.error("PayPal failed: " + JSON.stringify(data));
			} else {
				
				if (data.payment.payer.payment_method === 'paypal') {
					toastr.info(data.payment.payer.payment_method);
					for (var i = 0; i < data.payment.links.length; i++) {
						var link = data.payment.links[i];
						if (link.method === 'REDIRECT') {
							toastr.success("PayPal completed: " + JSON.stringify(data));
							$window.location.href = link.href;
						}
					}
				}
				
			}
		});
	};

	$scope.init = function () {
		var token = $window.sessionStorage.token;
		var username = $window.sessionStorage.username;

		// toastr.info(token + '/' + username);
		// if (token && username) {
		// 	var socket = io.connect('http://localhost:5000');
		// 	socket.on('news', function (result) {
		// 		toastr.info(JSON.stringify(result));
		// 	});
		// }
	};

	$scope.topupCreditCard = function(value) {

	};

	/*
	 *	Set amount when user choose topup 
	 */
	$scope.setAmount = function(amount) {
		$scope.topup.amount = amount;
	}

}]);