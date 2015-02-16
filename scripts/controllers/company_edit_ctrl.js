var phonecatApp = angular.module('phonecatApp', ['ngRoute', 'ngResource', 'PopInTownControllers', 'phonecatServices', 
	'ngSanitize', 'phonecatFilters', 'ui.bootstrap','angularFileUpload'],
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
	});

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
          		//console.log(Jcrop);

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

phonecatApp.directive('compile', ['$compile', function ($compile) {
  return function (scope, element, attr) {
    scope.$watch(
      function (scope) {
      // watch the 'compile' expression for changes
      return scope.$eval(attr.compile);
      },
      function (value) {
        // when the 'compile' expression changes
              // assign it into the current DOM
              element.html(value);

              // compile the new DOM and link it to the current
              // scope.
              // NOTE: we only compile .childNodes so that
              // we don't get into infinite loop compiling ourselves
              $compile(element.contents())(scope);
            });
  };
}]);

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

phonecatServices.factory('ProfileService', function ($http) {
	return {
		findCompany: function (username) {
            return $http.get('/ajax/company/' + username);
        },
        saveCompanyEdit: function (inputs) {
            return $http.put('/ajax/company/edit', inputs);
        }
	}
});

PopInTownControllers.controller('MainCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload', '$http',
	function ($scope, $location, $window, ProfileService, $sce, $upload, $http) {

	$scope.data = null;

	$scope.expModalTitle = '';
	$scope.eduModalTitle = '';
	$scope.languageModalTitle = '';

	// To keep track modal dialog whether it is new experience or experience edit
	$scope.isNewExperience = false;
	$scope.isNewEducation = false;
	$scope.imgUrl = '';
	$scope.bounds = null;
	$scope.boundx = null;
	$scope.boundy = null;

	$scope.expEdit = {
		id: null,
		companyName: null,
		title: null,
		isStillHere: false,
		dateStarted: {
			month: null,
			year: null
		},
		dateEnded: {
			month: null,
			year: null
		},
		location: null,
		description: null,
		errorMessages: []
	};

	$scope.infoEdit = {
		id: null,
		firstName: null,
		lastName: null,
		email: null,
		birthday: {
			date: null,
			privacy: null
		},
		livesin: null,
		description: null,
		errorMessages: []
	}

	$scope.eduEdit = {
		id: null,
		schoolName: null,
		schoolId: null,
		title: null,
		degree: null,
		studyField: null,
		grade: null,
		yearStarted: null,
		yearEnded: null,
		educationLevel: null,
		schoolStarted: {
			month: null,
			year: null
		},
		schoolEnded: {
			month: null,
			year: null
		},
		activities: null,
		description: null,
		errorMessages: []
	}

	$scope.languageEdit = {
		language: null,
		proficiency: null
	}

	$scope.birthdayEdit = {
		day: null,
		month: null,
		year: null,
		privacy: null,
	}

	$scope.expDateStarted = {
		month: null,
		year: null
	};
	$scope.expDateEnded = {
		month: null,
		year: null
	};
	$scope.eduDateStarted = {
		month: null,
		year: null
	};
	$scope.eduDateEnded = {
		month: null,
		year: null
	};
	$scope.educationLevel = null;

	// Used to store crop dimesion
	$scope.cropValue = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		loginToken: ''
	}

	$scope.company = null;

	$scope.companyEdit = {
		name : null,
		username : null,
		address1 : null,
		address2 : null,
		city : null,
		country : null,
		industry : null,
		phone :null,
		website :null,
		yearFounded : null,
		about :null,
		cityTypeAhead: null,
		countryTypeAhead: null
	}

	/*
	 * Init when the page is load
	 */
	$scope.init = function (username) {
		// Find company information by username
		$scope.findCompany(username);
	};

	$scope.findCompany = function (username) {
		ProfileService.findCompany(username).success(function (result) {
			console.log(result);
			if (result.status) {
				$scope.company = result.data;
				$scope.companyEdit._id = $scope.company._id;
				$scope.companyEdit.name = $scope.company.name;
				$scope.companyEdit.username = $scope.company.username;
				$scope.companyEdit.address1 = $scope.company.address.address1;
				$scope.companyEdit.address2 = $scope.company.address.address2;
				$scope.companyEdit.city = $scope.company.address.city.name;
				$scope.companyEdit.country = $scope.company.address.country.name;
				$scope.companyEdit.industry = $scope.company.industry;
				$scope.companyEdit.phone = $scope.company.address.phone;
				$scope.companyEdit.website = $scope.company.website;
				$scope.companyEdit.yearFounded = $scope.company.yearFounded;
				$scope.companyEdit.about = $scope.company.about;
				$scope.companyEdit.postalCode = $scope.company.address.postalCode;
				$scope.companyEdit.cityTypeAhead = $scope.company.address.city;
				$scope.companyEdit.countryTypeAhead = $scope.company.address.country;
			} else {	
				// handler error
			}
		});
	};

	$scope.saveBasicInfo = function () {

		var data = {
			companyId : $scope.companyEdit._id,
            companyName:    $scope.companyEdit.name,
            username:       $scope.companyEdit.username,
            address1:       $scope.companyEdit.address1,
            address2:       $scope.companyEdit.address2,
            phone:          $scope.companyEdit.phone,
            url:            $scope.companyEdit.website,
            city:           $scope.companyEdit.cityTypeAhead._id,
            postalCode:     $scope.companyEdit.postalCode,
            yearFounded:    $scope.companyEdit.yearFounded,
            latitude:       $scope.companyEdit.latitude,
            longitude:      $scope.companyEdit.longitude,
            about:          $scope.companyEdit.about,
            country:        $scope.companyEdit.countryTypeAhead._id
        };

        console.log(data);

		ProfileService.saveCompanyEdit(data).success(function (result) {
			console.log(result);
			if (result.status) {
				$scope.company = result.data;
				$scope.companyEdit._id = $scope.company._id;
				$scope.companyEdit.name = $scope.company.name;
				$scope.companyEdit.username = $scope.company.username;
				$scope.companyEdit.address1 = $scope.company.address.address1;
				$scope.companyEdit.address2 = $scope.company.address.address2;
				$scope.companyEdit.city = $scope.company.address.city.name;
				$scope.companyEdit.country = $scope.company.address.country.name;
				$scope.companyEdit.industry = $scope.company.industry;
				$scope.companyEdit.phone = $scope.company.address.phone;
				$scope.companyEdit.website = $scope.company.website;
				$scope.companyEdit.yearFounded = $scope.company.yearFounded;
				$scope.companyEdit.about = $scope.company.about;
				$scope.companyEdit.postalCode = $scope.company.address.postalCode;
				$scope.companyEdit.cityTypeAhead = $scope.company.address.city;
				$scope.companyEdit.countryTypeAhead = $scope.company.address.country;
				$('#infoEditModal').modal('toggle');
			} else {	
				// handler error
			}
		});
	}

	$scope.onTypeaheadSelect = function ($item, $model, $label) {

    	//console.log($scope.tagsSelected);
    	console.log($model);
    	$scope.companyEdit.city = $model.name;
        $scope.companyEdit.country = $model.country.name;
        $scope.companyEdit.cityTypeAhead = $model;
        $scope.companyEdit.countryTypeAhead = $model.contry;
        
	};

	$scope.getTags = function(val) {
		console.log('get countries');
    	return $http.get('/api/v2/cities', { params: { k: val }
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
	
	$scope.trustedHtml = function (plainText) {
		var value = plainText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&quot;/g, '"');
		
            return $sce.trustAsHtml(value);
    }

	$scope.showProfilePicModal = function () {
		$('#profilePicModal').modal('toggle');
	}

	$scope.showUserEditModal = function () {
		// Refresh company information
		$scope.companyEdit.name = $scope.company.name;
		$scope.companyEdit.username = $scope.company.username;
		$scope.companyEdit.address1 = $scope.company.address.address1;
		$scope.companyEdit.address2 = $scope.company.address.address2;
		$scope.companyEdit.city = $scope.company.address.city.name;
		$scope.companyEdit.country = $scope.company.address.country.name;
		$scope.companyEdit.industry = $scope.company.industry;
		$scope.companyEdit.phone = $scope.company.address.phone;
		$scope.companyEdit.website = $scope.company.website;
		$scope.companyEdit.yearFounded = $scope.company.yearFounded;
		$scope.companyEdit.about = $scope.company.about;
		$scope.companyEdit.postalCode = $scope.company.address.postalCode;

		$('#infoEditModal').modal('toggle');
	};

	/*
	 * Find user by username. Used to get user and check username availibility
	 */
	$scope.terminateSession = function (session_id) {		
		ProfileService.terminateSession(session_id).success(function (data) {
			console.log(data);
			if (data.status) {
				var content = angular.element("#session-" + session_id).remove();
			} else {
				
			}
		});
	};

	/*
	 * Initialize controller when first loading page
	 */
	$scope.initMCE = function (){
		tinymce.init({
			mode : "specific_textareas",
        	editor_selector : "mceEditor",
        	menubar:false,
        	statusbar : false,
        	auto_focus: "exp-editor",
        	content_css : "mce-content.css",
			toolbar: ["bold italic underline  bullist numlist"]
		});
	};

	/*
	 * Initialize controller when first loading page
	 */
	$scope.initMceEdu = function (){
		tinymce.init({
			mode : "specific_textareas",
        	editor_selector : "mceEditorEdu",
        	menubar:false,
        	statusbar : false,
        	auto_focus: "exp-editor",
        	content_css : "mce-content.css",
			toolbar: ["bold italic underline  bullist numlist"]
		});
	};

	$scope.initMceBasicInfo = function (){
		tinymce.init({
			mode : "specific_textareas",
        	editor_selector : "mceEditorEdu",
        	menubar:false,
        	statusbar : false,
        	auto_focus: "info-editor",
        	content_css : "mce-content.css",
			toolbar: ["bold italic underline  bullist numlist"]
		});
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
