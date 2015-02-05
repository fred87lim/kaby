var phonecatApp = angular.module('phonecatApp', ['ngRoute', 'ngResource', 'PopInTownControllers', 'phonecatServices', 
	'ngSanitize', 'angularFileUpload', 'ui.bootstrap', 'google-maps'],
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
	});

var PopInTownControllers = angular.module('PopInTownControllers', [ ]);

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

angular.module('phonecatFilters', []).filter('unescapeHTML', function (text) {
	if (text) {
    return text.
        replace(/&amp;/g, '&').
        replace(/&lt;/g, '<').
        replace(/&gt;/g, '>').
        replace(/&#39;/g, '\'').
        replace(/&quot;/g, '"');
  }
  return '';
});

phonecatApp.filter('titlecase', function() {
    return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    };
});

phonecatApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.
    when('/company', {
        templateUrl: '/partials/new-biz.html',
        controller: 'NewCompanyCtrl'
    }).
    when('/logo', {
        templateUrl: '/partials/page_logo.html',
        controller: 'PageLogoCtrl'
    }).
		otherwise({
			redirectTo: '/'
		});

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
}]);

phonecatServices.factory('ProfileService', function ($http) {
	return {
		replyComment: function (inputs) {
			return $http.post('/ajax/comment/reply', inputs);
		},
        createNewPage: function (inputs) {
            return $http.post('/ajax/page/new', inputs);
        }
	}
});

PopInTownControllers.controller('MainCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload', 
	'$filter', '$http', '$interval',  '$compile',
	function ($scope, $location, $window, ProfileService, $sce, $upload, $filter, $http, $interval, $compile) {

	$scope.biz = {
        username: null,
        name: null,
        address1: null,
        address2: null,
        phone: null,
        url: null,
        city: null,
        postalCode: null,
        yearFounded: null,
        latitude: null,
        longitude: null,
        about: null,
        loginToken: '',
        country: null,
        type: null,
    };

	/*
	 * Init when the page is load
	 */
	$scope.init = function (username, articleSlug) {
		
	};

	

	$scope.stripHTML = function (html) {
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText ;
	};

	$scope.customSelected = undefined;
	$scope.tagsSelected = [];
	$scope.asyncSelected = undefined;

  	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  	// Any function returning a promise object can be used to load values asynchronously
  	$scope.getLocation = function(val) {
    	return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
      		params: {
        	address: val,
        	sensor: false
      	}
    }).then(function(response) {
      	return response.data.results.map(function(item){
        	return item.formatted_address;
      	});
    	});
  	};

  	$scope.removeTag = function (tag) {
  		var index = $scope.article.tags.indexOf(tag);
  		if (index > -1) {
		    $scope.article.tags.splice(index, 1);
		}
  	}

  	$scope.newTag = {
  		name: null,
  		slug: null,
  		errors: []
  	}

  	$scope.selectedCategory = {};
  	$scope.newCategory = {
  		name: null,
  		slug: null
  	}

    $scope.registerNewBiz = function () {
        var data = {
            companyName:           $scope.biz.name,
            username:       $scope.biz.username,
            address1:       $scope.biz.address1,
            address2:       $scope.biz.address2,
            phone:          $scope.biz.phone,
            url:            $scope.biz.url,
            city:           $scope.biz.city._id,
            postalCode:     $scope.biz.postalCode,
            yearFounded:    $scope.biz.yearFounded,
            latitude:       $scope.biz.latitude,
            longitude:      $scope.biz.longitude,
            about:          $scope.biz.about,
            country:        $scope.biz.city.country._id,
            pageType:           $scope.biz.type,
        };

        console.log(data);

        ProfileService.createNewPage(data).success(function (result) {
            if (result.status) {
                console.log(result);
            } else {

            }
        });
        
    };

  	$scope.onTypeaheadSelect = function ($item, $model, $label) {

    	//console.log($scope.tagsSelected);
    	$scope.biz.city = $model;
        $scope.biz.country = $scope.biz.city.country.name;
        console.log($model);
	};

	$scope.showAddNewCategory = function () {
		$('#newCategoryModal').modal('toggle');
	}

	$scope.showSchedulePost = function () { 
		$('#scheduleModal').modal('toggle');
	}

	$scope.today = function() {
    	$scope.dt = new Date();
  	};
  	$scope.today();

  	$scope.clear = function () {
    	$scope.dt = null;
  	};


  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};
  	$scope.toggleMin();

  	$scope.open = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	$scope.opened = true;
  	};

  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};

  	$scope.formats = ['dd MMM yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  	$scope.format = $scope.formats[0];

  	$scope.hstep = 1;
  	$scope.mstep = 15;

  	$scope.options = {
    	hstep: [1, 2, 3],
    	mstep: [1, 5, 10, 15, 25, 30]
  	};

  	$scope.ismeridian = false;
  	$scope.toggleMode = function() {
    	$scope.ismeridian = ! $scope.ismeridian;
  	};

  	$scope.update = function() {
    	var d = new Date();
    	d.setHours( 14 );
    	d.setMinutes( 0 );
    	$scope.mytime = d;
  	};

  	$scope.changed = function () {
    	console.log('Time changed to: ' + $scope.mytime);
  	};

  	$scope.clear = function() {
    	$scope.mytime = null;
  	};

	$scope.addNewTag = function () {
		ProfileService.addNewTag({
    		name: $scope.newTag.name, 
    		slug: $scope.newTag.slug
    	}).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			// new tag saved succesfully
    			$scope.article.tags.push(result.data);
    			$('#newTagModal').modal('toggle');
    		} else {
    			// display error
    			$scope.newTag.errors.push(result.message);
    		}
    	});

	};

	$scope.addNewCategory = function () {
		var trimmedVal = $scope.newCategory.name.trim();
			trimmedVal = trimmedVal.replace(/[^a-zA-Z0-9]/g, '-');
			trimmedVal = trimmedVal.replace(/-{2,}/g, '-');
			trimmedVal = trimmedVal.replace(/^-/g, '');
			trimmedVal = trimmedVal.replace(/-$/g, '');
			trimmedVal = $filter('lowercase')(trimmedVal);

		ProfileService.addNewCategory({
    		name: $filter('titlecase')($scope.newCategory.name), 
    		slug: trimmedVal
    	}).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			// new tag saved succesfully
    			//$scope.tagsSelected.push(result.data);
    			$scope.settings.categories.push(result.data);
    			$scope.selectedCategory = result.data;
    			$scope.article.category = result.data;
    			$('#newCategoryModal').modal('toggle');
    		} else {
    			// display error
    			//$scope.newTag.errors.push(result.message);
    		}
    	});

	};

	// Any function returning a promise object can be used to load values asynchronously
  	$scope.getTags = function(val) {
    	return $http.get('/api/v2/cities', {
      		params: { k: val }
    	}).then(function(response){
    		var tags= [];

        var indice = [];
        
        // loop through all returned tags
        for (var i = 0; i < response.data.data.length; i++) {
          // loop through current selected response.data.data
          tags.push(response.data.data[i]);         
        }
        console.log(tags);
        return tags;
    	});
  	};

  	$scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];
}]);

PopInTownControllers.controller('PageLogoCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload', 
    '$filter', '$http', '$interval',  '$compile',
    function ($scope, $location, $window, ProfileService, $sce, $upload, $filter, $http, $interval, $compile) {

    /*
     * Init when the page is load
     */
    $scope.init = function () {
        console.log('Logo');
    };
}]);

