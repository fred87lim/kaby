var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource', function ($resource) {
	return $resource('/vendors/:phoneId.json', {}, {
		query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
	});
}]);

phonecatServices.factory('Auth', function ($http) {
	return {
		login: function (inputs) {
			return $http.post('/api/v1/login', inputs);
		},
		signup: function (inputs) {
			return $http.post('/api/v1/signup', inputs);
		},
		logout: function (inputs) {
			return $http.post('/api/v1/logout', inputs);
		}
	}
});

phonecatServices.factory('PayPalService', function ($http) {
	return {
		payWithPayPal: function (inputs) {
			return $http.post('/api/v1/payment/paypal/pay', inputs);
		},
		payWithCreditCard: function (inputs) {
			return $http.post('/api/v1/payment/creditcard/pay', inputs);
		}
	}
});


phonecatServices.factory('BizService', function ($http) {
	return {

		/*
		 * 
		 */
		register: function (inputs) {
			return $http.post('/api/v1/biz/new', inputs);
		}
	}
});

phonecatServices.factory('AdminService', function ($http) {
	return {
		createNewRate: function(inputs) {
			return $http.post('/api/v1/admin/rate/new', inputs);
		}
	}
});

phonecatServices.factory('UserService', function ($http) {
	return {

		/*
		 * Find User By Log In Token
		 */
		findUserByLoginToken: function (loginToken) {
			var url = '/api/v1/user/token/' + loginToken;
			return $http.get(url);
		},
		findUserByUsername: function (username) {
			var url = '/api/v1/user/' + username;
			return $http.get(url);
		},
		findPostsByUser: function (username) {
			var url = '/api/v1/user/post/' + username;
			return $http.get(url);
		},
		findPostsByUsernameAndTitle: function (username, urlTitle) {
			var url = '/api/v1/user/post/' + username + '/' + urlTitle;
			return $http.get(url);
		},
		getEduYears: function () {
			return $http.get('/api/v1/utils/edu/years')
		},
		createNewLike: function (data) {
			return $http.post('/api/v1/user/post/like', data);
		},
		createNewComment: function (data) {
			return $http.post('/api/v1/user/post/comment', data);
		},
		deleteComment: function (loginToken, commentId) {
			var url = '/api/v1/user/post/comment/' + commentId + '?loginToken=' + loginToken;
			return $http.delete(url);
		},
		unlike: function(loginToken, likeId) {
			var url = '/api/v1/user/post/like/' + likeId + '?loginToken=' + loginToken;
			return $http.delete(url);
		},
		createNewPost: function (data) {
			return $http.post('/api/v1/user/post/new', data);
		},
		addExperience: function (data) {
			return $http.post('/api/v1/user/exp/add', data);
		},
		removeExperience: function (data) {
			return $http.post('/api/v1/user/exp/remove', data);
		},
		addNewEducation: function (data) {
			return $http.post('/api/v1/user/edu/add', data);
		},
		removeEducation: function (data) {
			return $http.post('/api/v1/user/edu/remove', data);
		},
		follow: function (data) {
			return $http.post('/api/v1/user/follow', data);
		},
		unfollow: function (data) {
			return $http.post('/api/v1/user/unfollow', data);
		},
		cropProfilePicture: function (data) {
			return $http.post('/api/v1/user/crop', data);
		}
	};

	return $resource('/api/v1/user/token/:tokenId', {}, {
		query: {method: 'GET', params: {tokenId: 'phones'}, isArray: true}
	});
});


phonecatServices.factory('GoogleMapsService', function ($http) {
	return {
		parseLatitude: function(inputs) {			
			var query = 'https://maps.googleapis.com/maps/api/geocode/json?' + inputs;
			return $http.get(query);
		}
	}
});