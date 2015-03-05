
/*
 * New Business Controller // Child controller
 */
PopInTownControllers.controller('NewCompanyCtrl', ['$scope', '$window', 
	function($scope, $window) {

	$scope.countries = [
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
		];

	$scope.googleMapsInput = {
		address: '',
		sensor: 'true',
		key: 'AIzaSyDFmK2IXbwelBhKxWSTuGfh18r6XSGk7uc'
	};

	//?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true&key=AIzaSyDFmK2IXbwelBhKxWSTuGfh18r6XSGk7uc

	$scope.map = {
		control: {},
        version: "uknown",
	    center: {
	        latitude: 45,
	        longitude: -73
	    },
	    zoom: 3,
	    options: {
	    	streetViewControl: false,
            panControl: false,
            maxZoom: 20,
            minZoom: 3		
	    },
	    dragging: false,
	    bounds: {},
	    dynamicMarkers: [],
	    markers: [
	    	{
	    		latitude: 33,
                    longitude: -77,
                    showWindow: false,
                    title: ''
	    	}
	    ]
	};

	/*
	 * Initialize controller when first loading page
	 */
	$scope.init = function (){
		// If user is not logged in, redirect to homepage 
		$scope.$parent.biz.type = 'COMPANY';
		$scope.$parent.pageType = 'COMPANY';
		console.log($scope.$parent.biz.type);
		
	};

	/*
	 * This function is to update google map when user registers new business
	 * https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true&key=AIzaSyDFmK2IXbwelBhKxWSTuGfh18r6XSGk7uc
	 */
	// $scope.updateGoogleMap = function() {

	// 	$scope.googleMapsInput.address = $scope.biz.address1;
	// 	//str.replace(/\n/g, '<br />');
	// 	var query = 'address=' + $scope.googleMapsInput.address.replace(/\s/g, '+') + "&sensor=true&key=" + $scope.googleMapsInput.key
	// 	GoogleMapsService.parseLatitude(query).success( function (data) {

	// 		if (data.error_message) {
	// 			toastr.error(data.error_message);
	// 		} else {
	// 			var lat = data.results[0].geometry.location.lat;
	// 			var lng = data.results[0].geometry.location.lng;
	// 			$scope.map.center.latitude = lat;
	// 			$scope.map.center.longitude = lng;
	// 			$scope.map.zoom = 19;
	// 			$scope.map.markers[0].latitude = lat;
	// 			$scope.map.markers[0].longitude = lng;
	// 			$scope.map.markers[0].title = $scope.biz.name;
	// 		}
	// 	});
	// };

	// $scope.registerNewBiz = function () {
	// 	$scope.biz.loginToken = $window.sessionStorage.token;
	// 	BizService.register($scope.biz).success(function (data) {
	// 		if (data.error_message) {

	// 		} else {
	// 			toastr.success("register biz: " + JSON.stringify(data))
	// 		}
	// 	});
	// };
}]);