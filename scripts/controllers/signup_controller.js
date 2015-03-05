var phonecatApp = angular.module('phonecatApp', ['ngRoute', 'ngResource', 'PopInTownControllers', 'phonecatServices', 
	'ngSanitize', 'angularFileUpload', 'ui.bootstrap'],
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
	});

var PopInTownControllers = angular.module('PopInTownControllers', [ ]);

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

var bountestds = {};

phonecatApp.directive('imgCropped', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: { src: '@', selected: '&', changed: '&'},
        link: function (scope, element, attr) {
            var myImg;
            var clear = function () {
            if (myImg) {
                myImg.next().remove();
                myImg.remove();
                myImg = undefined;
            }
        };

        scope.$watch('src', function (nv) {
            clear();
            if (nv) {
                element.after('<img />');
                myImg = element.next();
                myImg.attr('src', nv);
                console.log(myImg);

                $(myImg).Jcrop({
                    trackDocument: true,
                    onSelect: function (x) {
                        scope.$apply(function () {
                            scope.selected({ cords: x });
                        });
                    },
                    onChange: function (x) {
                        scope.$apply(function () {
                            scope.changed({cords: x});
                        });
                    },
                    aspectRatio: 1,
                    setSelect: [0, 0, 200, 200]
                    }, function () {
                         // Use the API to get the real image size 
                         var bounds = this.getBounds();
                         boundx = bounds[0];
                         boundy = bounds[1];

                         if (boundx && boundy) {
                            console.log('Bounds: ' + boundx + '/' + boundy);
                            
                            
                            bountestds.x = boundx;
                            bountestds.y = boundy;
                            
                         }
             
            });
        }
       });
       scope.$on('$destroy', clear);
        }
    };
});


phonecatApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.
    when('/get_to_know', {
        templateUrl: '/partials/signup_wizard_get_to_know.html',
        controller: 'GetToKnowCtrl'
    }).
    when('/profile_picture', {
        templateUrl: '/partials/signup_wizard_profile_picture.html'
    }).
    when('/basic_info', {
        templateUrl: '/partials/signup_wizard_basic_info.html'
    }).
    when('/experience', {
        templateUrl: '/partials/signup_wizard_experience.html'
    }).
    when('/education', {
        templateUrl: '/partials/signup_wizard_education.html'
    }).
    when('/honors_awards', {
        templateUrl: 'partials/signup_wizard_honors_awards.html'
    }).
	otherwise({
			redirectTo: '/'
	});

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
}]);

phonecatServices.factory('ProfileService', function ($http) {
	return {
        checkEmailAvailable: function (email) {
            return $http.get('/ajax/user/email_available/' + email);
        },
        checkUsernameAvailable: function (username) {
            return $http.get('/ajax/user/username_available/' + username);
        },
        findPrivacySettings: function () {
            return $http.get('/ajax/settings/privacies');
        }
	}
});

PopInTownControllers.controller('MainCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload', 
	'$filter', '$http', '$interval',  '$compile',
	function ($scope, $location, $window, ProfileService, $sce, $upload, $filter, $http, $interval, $compile) {

    // angular model
    $scope.signup = {
        email: {
            value: null,
            status: null
        },
        username: {
            value: null,
            status: null
        },
        firstName: {
            value: null,
            status: null
        },
        lastName: {
            value: null,
            status: null
        },
        password: {
            value: null,
            status: null
        },
        status: false // false - sign up not successful, true - signup successfull
    };

    $scope.datetime = {
        days: [],
        months: [],
        years: []
    };

    $scope.birthday = {
        day: null,
        month: null,
        year: null,
        privacy: null
    }

    $scope.experience = {
        start: {
            month: null,
            year: null
        },
        end: {
            month: null,
            year: null
        },
        isStillHere: false,
        company: null,
        title: null
    }

    $scope.privacySettings = null;

    $scope.user = {
        purpose: null,
        city: null,
        about: null,
        birthday: null
    };

	/*
	 * Initialize when the page is load
	 */
	$scope.init = function () {

        // Initialize datetime
        for (var i = 1; i <= 31; i++) {
            $scope.datetime.days.push(i);
        }

        $scope.datetime.months.push('Jan');
        $scope.datetime.months.push('Feb');
        $scope.datetime.months.push('Mar');
        $scope.datetime.months.push('Apr');
        $scope.datetime.months.push('May');
        $scope.datetime.months.push('Jun');
        $scope.datetime.months.push('Jul');
        $scope.datetime.months.push('Aug');
        $scope.datetime.months.push('Sep');
        $scope.datetime.months.push('Oct');
        $scope.datetime.months.push('Nov');
        $scope.datetime.months.push('Dec');

        console.log($scope.datetime.months);

        // Initialize datetime
        for (var j = 2015; j >= 2015 - 100; j--) {
            $scope.datetime.years.push(j);
        }

        $scope.findPrivacySettings();

        //$scope.signup.status = true;
	};

    $scope.createNewAccount = function () {
        console.log('sign up');
        $scope.signup.status = true;
        $location.path('/get_to_know');
    }

    $scope.checkEmailAvailable = function () {
        ProfileService.checkEmailAvailable($scope.signup.email.value).success(function (result) {
            $scope.signup.email.status = result;
        });
    };

    $scope.checkUsernameAvailable = function () {
        ProfileService.checkUsernameAvailable($scope.signup.username.value).success(function (result) {
            $scope.signup.username.status = result.data.isAvailable;
        });
    };

    $scope.selectPurpose = function (option) {
        if (option == 1) {
            $scope.user.purpose = 'STUDENT';
        } else if (option == 2) {
            $scope.user.purpose = 'JOB_SEEKER';
        } else if (option == 3) {
            $scope.user.purpose = 'EMPLOYED_AVAILABLE';
        } else if (option == 4) {
            $scope.user.purpose = 'EMPLOYED_HAPPY';
        }

        console.log($scope.user.purpose);
        $location.path('/profile_picture');
    };

    $scope.saveProfilePicture = function() {

        $location.path('/basic_info');
    }

    $scope.saveBasicInfo = function () {
        $scope.user.birthday = $scope.birthday;
        console.log($scope.user);
        $location.path('/experience');
    }

    $scope.saveExperience = function () {
        console.log($scope.experience);
        $location.path('/education');
    }

    $scope.saveEducation = function () {
        $location.path('/honors_awards');
    }

    $scope.saveHonorsAwards = function () {
        $window.location.replace($location.protocol() + '://' + $window.location.host);
    }

    $scope.selectDay = function (day) {
        $scope.birthday.day = day;
    }

    $scope.selectMonth = function (month) {
        $scope.birthday.month = month;
    }

    $scope.selectYear = function (year) {
        $scope.birthday.year = year;
    }

    $scope.selectExpStartMonth = function (month) {
        $scope.experience.start.month = month;
    }

    $scope.selectExpStartYear = function (year) {
        $scope.experience.start.year = year;
    }

    $scope.selectExpEndMonth = function (month) {
        $scope.experience.end.month = month;
    }

    $scope.selectExpEndYear = function (year) {
        $scope.experience.end.year = year;
    }

    $scope.findPrivacySettings = function () {
        ProfileService.findPrivacySettings().success(function (result) {
            
            if (result.status) {
                $scope.privacySettings = result.data;
                $scope.birthday.privacy = $scope.privacySettings[0];
            }
        });
    }

    $scope.selectPrivacy = function (privacy) {
        $scope.birthday.privacy = privacy;
    };

    $scope.getCities = function(val) {
        return $http.get('/api/v2/cities', {
            params: { k: val }
        }).then(function(response){
            var cities= [];

        for (var i = 0; i < response.data.data.length; i++) {
          // loop through current selected response.data.data
          cities.push(response.data.data[i]);         
        }

        return cities;
        });
    };

    $scope.findJobTitlesByKeyWord = function (val) {
        return $http.get('/ajax/settings/job_titles', {
            params: { k: val }
        }).then(function(response){
            var titles= [];

        for (var i = 0; i < response.data.data.length; i++) {
          // loop through current selected response.data.data
          titles.push(response.data.data[i]);         
        }

        return titles;
        });
    }

    $scope.onTypeaheadSelectJobTitle = function ($item, $model, $label) {
        $scope.experience.title = $model;
    };

    $scope.onTypeaheadSelect = function ($item, $model, $label) {
        $scope.user.city = $model;
    };

    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        
        //for (var i = 0; i < $files.length; i++) {
          var file = $files[0];
          console.log(file);
          $scope.upload = $upload.upload({
            url: '/profile_picture', //upload.php script, node.js route, or servlet url
            // method: 'POST' or 'PUT',
            // headers: {'header-key': 'header-value'},
            // withCredentials: true,
            data: {},
            file: file, // or list of files: $files for html5 only
            /* set the file formData name ('Content-Desposition'). Default is 'file' */
            //fileFormDataName: myFile, //or a list of names for multiple files (html5).
            /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
            //formDataAppender: function(formData, key, val){}
          }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(result, status, headers, config) {
            // file is uploaded successfully
            console.log(result);
            console.log(result.data.file.url);
            $scope.imgUrl = result.data.file.url;
            //$scope.cropapi.setImage($scope.imgUrl);
            
          });
          //.error(...)
          //.then(success, error, progress); 
          //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
        //}
        /* alternative way of uploading, send the file binary with the file's content-type.
           Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
           It could also be used to monitor the progress of a normal http post/put request with large data*/
        // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
    };

    // Crop image
    $scope.cropProfilePicture = function() {
        console.log($scope.cropValue.x + '/' + $scope.cropValue.y + '/' + $scope.cropValue.w + '/' + $scope.cropValue.h);
        ProfileService.cropProfilePicture($scope.cropValue).success(function (result) {

            if (result.status) {
                console.log(result);

                $scope.data.target_user.profilePicture = result.data.url;
                console.log($scope.data.target_user.profilePicture);
                $scope.data.user.profilePicture = result.data.url;
                /* exit photo dialog modal and set profile picture */
                $('#profilePicModal').modal('hide');
            }
            
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
        if (bountestds.x && bountestds.y) {
            $('#preview-pane .preview-container img').css({
                width: Math.round(rx * bountestds.x) + 'px',
                height: Math.round(ry * bountestds.y) + 'px',
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

        if (bountestds.x && bountestds.y) {
            $('#preview-pane .preview-container img').css({
                width: Math.round(rx * bountestds.x) + 'px',
                height: Math.round(ry * bountestds.y) + 'px',
                marginLeft: '-' + Math.round(rx * cords.x) + 'px',
                marginTop: '-' + Math.round(ry * cords.y) + 'px'
            });
        }
        
    };
}]);

PopInTownControllers.controller('GetToKnowCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload', 
    '$filter', '$http', '$interval',  '$compile',
    function ($scope, $location, $window, ProfileService, $sce, $upload, $filter, $http, $interval, $compile) {

    /*
     * Initialize when the page is load
     */
    $scope.init = function () {
        if ($scope.signup.status == false) {
            $location.path('/');
        }
    };

    
}]);