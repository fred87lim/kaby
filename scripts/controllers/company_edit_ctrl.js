var phonecatApp = angular.module('phonecatApp', ['ngRoute', 'ngResource', 'PopInTownControllers', 'phonecatServices', 
	'ngSanitize', 'phonecatFilters', 'angularFileUpload'],
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
        }
	}
});

PopInTownControllers.controller('MainCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload',
	function ($scope, $location, $window, ProfileService, $sce, $upload) {

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
		about :null
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
			} else {	
				// handler error
			}
		});
	};

	
	$scope.trustedHtml = function (plainText) {
		var value = plainText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&quot;/g, '"');
		
            return $sce.trustAsHtml(value);
    }

    $scope.deleteEducation = function () {
    	if ($scope.eduEdit.id) {
    		ProfileService.deleteEducation($scope.eduEdit.id).success(function (data) {
				if (data.status) {
					// remove this id from the list
					var index = -1;
					for (var i = 0; i < $scope.data.target_user.educations.length; i++) {
						if ($scope.data.target_user.educations[i]._id == $scope.eduEdit.id) {
							index = i;
							break;
						}
					}

					if (index != -1) {
						$scope.data.target_user.educations.splice(index, 1);
						$('#eduEditModal').modal('hide');
					}
				} else {
					
				}
			});
    	}
    };

    $scope.addEdu = function () {
		$scope.eduEdit.yearStarted = $scope.eduDateStarted.name;
		$scope.eduEdit.yearEnded = $scope.eduDateEnded.name;
		$scope.eduEdit.educationLevel = $scope.educationLevel.name;

		ProfileService.addEducation({
    		school_name: 		$scope.eduEdit.schoolName, 
    		school_id: 			$scope.eduEdit.schoolId,
    		degree: 			$scope.eduEdit.degree,
    		study_field: 		$scope.eduEdit.studyField,
    		education_level: 	$scope.eduEdit.educationLevel,
    		year_started: 		$scope.eduEdit.yearStarted,
    		year_ended: 		$scope.eduEdit.yearEnded,
    		grade: 				$scope.eduEdit.grade,
    		description: 		$scope.eduEdit.description
    	}).success(function (result) {
    		if (result.status) {
    			$scope.data.target_user.educations.push(result.data);
    			$('#eduEditModal').modal('toggle');
    		}
    	});

    };

    $scope.deleteExp = function () {
    	if ($scope.expEdit.id) {
    		ProfileService.deleteExperience($scope.expEdit.id).success(function (data) {
    			console.log(data);
				if (data.status) {
					// remove this id from the list
					var index = -1;
					for (var i = 0; i < $scope.data.target_user.experiences.length; i++) {
						if ($scope.data.target_user.experiences[i]._id == $scope.expEdit.id) {
							index = i;
							break;
						}
					}

					if (index != -1) {
						$scope.data.target_user.experiences.splice(index, 1);
						$('#expEditModal').modal('hide');
					}
				} else {
					
				}
			});
    	}
    };

    $scope.addLanguage = function () {
    	ProfileService.addLanguage({
    		language: $scope.languageEdit.language, 
    		proficiency: $scope.languageEdit.proficiency.name
    	}).success(function (result) {
    		if (result.status) {
    			$scope.data.target_user.languages.push(result.data);
    			$('#languageEditModal').modal('toggle');
    		}
    	});
    }

    $scope.addExp = function () {
    	// get content from tiny mce editor.
    	$scope.expEdit.description = tinyMCE.activeEditor.getContent();

    	$scope.expEdit.dateStarted.month = $scope.expDateStarted.month.value;
		$scope.expEdit.dateStarted.year = $scope.expDateStarted.year.value;
		$scope.expEdit.dateEnded.month = $scope.expDateEnded.month.value;
		$scope.expEdit.dateEnded.year = $scope.expDateEnded.year.value;

		ProfileService.addExperience({
    		companyName: 		$scope.expEdit.companyName, 
    		companyId: 			$scope.expEdit.companyId,
    		title: 				$scope.expEdit.title,
    		isStillHere: 		$scope.expEdit.isStillHere,
    		location: 			$scope.expEdit.location,
    		dateStarted: 		$scope.expEdit.dateStarted,
    		dateEnded: 			$scope.expEdit.dateEnded,
    		description: 		$scope.expEdit.description
    	}).success(function (result) {
    		if (result.status) {
    			$scope.data.target_user.experiences.push(result.data);
    			$('#expEditModal').modal('hide');
    		}
    	});
    };

	$scope.saveExp = function () {
		$scope.expEdit.description = tinyMCE.activeEditor.getContent();

		$scope.expEdit.dateStarted.month = $scope.expDateStarted.month.value;
		$scope.expEdit.dateStarted.year = $scope.expDateStarted.year.value;
		$scope.expEdit.dateEnded.month = $scope.expDateEnded.month.value;
		$scope.expEdit.dateEnded.year = $scope.expDateEnded.year.value;

		ProfileService.editExperience({
                experienceId: 	$scope.expEdit.id,
                companyName: 	$scope.expEdit.companyName,
                companyId: 		$scope.expEdit.companyId,
                title: 			$scope.expEdit.title,
                location: 		$scope.expEdit.location,
                isStillHere: 	$scope.expEdit.isStillHere,
                dateStarted: 	$scope.expEdit.dateStarted,
    			dateEnded: 		$scope.expEdit.dateEnded,
                description: 	$scope.expEdit.description
        }).success(function (result) {
        	console.log(result);
			if (result.status) {
				// edit successfully. Now need to update experience model with latest data.
				var counter = 0;
				angular.forEach($scope.data.target_user.experiences, function (value, key) {
					if (value._id === $scope.expEdit.id) {
						value.companyName = $scope.expEdit.companyName;
						value.title = $scope.expEdit.title;
						value.location = $scope.expEdit.location;
                		value.isWorking = $scope.expEdit.isStillHere;
                		value.description = result.data.description;
                		value.dateStarted = result.data.dateStarted;
                		value.dateEnded = result.data.dateEnded;

                		$('#expEditModal').modal('hide')
					}
				});
			} else {
				for (var i = 0; i < result.messages.length; i++) {
					$scope.expEdit.errorMessages.push(result.messages[i]);
				}
				
			}
		});
	}

	$scope.showProfilePicModal = function () {
		$('#profilePicModal').modal('toggle');
	}

	$scope.showEduAddModal = function () {
		$scope.isNewEducation = true;
		$scope.eduModalTitle = 'Add New Education';
		$scope.eduEdit.companyName 			= null;
		$scope.eduEdit.id 					= null;
		$scope.eduEdit.degree 				= null;
		$scope.eduEdit.studyField 			= null;
		$scope.eduEdit.schoolStarted.month 	= null;
		$scope.eduEdit.schoolStarted.year 	= null;
		$scope.eduEdit.description 			= null;
		$scope.eduEdit.activities 			= null;
		$scope.eduEdit.schoolEnded.month 	= null;
		$scope.eduEdit.schoolEnded.year 	= null;
		$('#eduEditModal').modal('toggle');
		tinyMCE.activeEditor.setContent('');
	}

	$scope.showExpAddModal = function () {
		$scope.isNewExperience = true;
		$scope.expModalTitle = 'Add New Experience';
		$scope.expEdit.id 					= null;
		$scope.expEdit.title 				= null;
		$scope.expEdit.companyName			= null;
		$scope.expEdit.isStillHere 			= false;
		$scope.expEdit.dateStarted.month 	= null;
		$scope.expEdit.dateStarted.year 	= null;
		$scope.expEdit.description 			= null;
		$scope.expEdit.location 			= null;
		$scope.expEdit.dateEnded.month 	= null;
		$scope.expEdit.dateEnded.year 	= null;
		$scope.expDateStarted.month = $scope.data.months[0];
		$scope.expDateEnded.month  = $scope.data.months[0];
		$scope.expDateStarted.year = $scope.data.years[0];
		$scope.expDateEnded.year  = $scope.data.years[0];
		$('#expEditModal').modal('toggle');
		tinyMCE.activeEditor.setContent('');
	}

	$scope.showLanguageAddModal = function () {
		$scope.languageModalTitle = 'Add New Language';
		$scope.languageEdit.language = null;
		$scope.languageEdit.proficiency = null;
		$('#languageEditModal').modal('toggle');
	}

	$scope.showUserEditModal = function () {
		

		$('#infoEditModal').modal('toggle');
	};

	// save basic information
	$scope.saveBasicInfo = function () {
		$scope.infoEdit.description = tinyMCE.activeEditor.getContent();

		$scope.infoEdit.errorMessages = [];
		// If any field of birthday is null, birthday is null
		if ($scope.birthdayEdit.month != null && $scope.birthdayEdit.year != null && 
			$scope.birthdayEdit.day != null && $scope.birthdayEdit.privacy != null) {
			var day = $scope.birthdayEdit.day.value;
			var month = $scope.birthdayEdit.month.value;
			var year = $scope.birthdayEdit.year.value;
			var privacy = $scope.birthdayEdit.privacy._id;

			var date = new Date(year, month, day);
			console.log(date.getDate() + '/' + date.getMonth());
			console.log(Number(day) + '/' + Number(month));
			// validate date
			if (date.getDate() == Number(day) && (date.getMonth()) == Number(month)) {
				$scope.infoEdit.birthday.date = date;
				$scope.infoEdit.birthday.privacy = privacy;
			} else {
				$scope.infoEdit.errorMessages.push('It does not seem a valid date. Please try again.');
				return;
			}
			
		} else if ($scope.birthdayEdit.month == null && $scope.birthdayEdit.year == null && 
			$scope.birthdayEdit.day == null && $scope.birthdayEdit.privacy == null) {
			// user does not want to declare his birthday
			$scope.infoEdit.birthday.date = null;
			$scope.infoEdit.birthday.privacy = null;
		} else {

			$scope.infoEdit.errorMessages.push('Please complete your birthday.');
			return;
		}
		console.log($scope.birthdayEdit);
		console.log($scope.infoEdit);

		ProfileService.editBasicInfo({
			firstName: $scope.infoEdit.firstName,
			lastName : $scope.infoEdit.lastName,
			livesin	: $scope.infoEdit.livesin,
			description: $scope.infoEdit.description,
			birthday: $scope.infoEdit.birthday
		}).success(function (result) {
			console.log(result);
			if (result.status) {
				$scope.data.target_user.local.firstName = result.data.firstName;
				$scope.data.target_user.local.lastName = result.data.lastName;
				$scope.data.target_user.livesin = result.data.livesin;
				$scope.data.target_user.description = result.data.description;
				$scope.data.target_user.birthday.date = result.data.birthday.date;
				$scope.data.target_user.birthday.privacy = result.data.birthday.privacy;
				$('#infoEditModal').modal('hide');
			}
		});
		
	}

	$scope.showEduEditPanel = function (exp) {
		$scope.isNewEducation = false;
		// convert to json object
		var json = exp;//eval("(" + exp + ")");
		$scope.eduModalTitle = 'Edit Education';
		//$scope.eduDateStarted.month = $scope.data.months[json.schoolStarted.month];
		//$scope.eduDateStarted.month = $scope.data.years[json.schoolStarted.month];

		// update with new data
		$scope.eduEdit.schoolName 			= json.schoolName;
		$scope.eduEdit.id 					= json._id;
		$scope.eduEdit.degree 				= json.degree;
		$scope.eduEdit.studyField 			= json.studyField;
		$scope.eduEdit.yearStarted 			= json.yearStarted;
		$scope.eduEdit.yearStarted 			= json.yearEnded;
		$scope.eduEdit.description 			= json.description;
		$scope.eduEdit.activities 			= json.activities;

		if (!$scope.eduEdit.description) {
			$scope.eduEdit.description = "";
		}

		// display modal
		$('#eduEditModal').modal('toggle');
		var value = $scope.eduEdit.description.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&quot;/g, '"');
		tinyMCE.get('edu-editor').setContent(value);
	}

	$scope.showExpEditPanel = function (exp) {
		$scope.isNewExperience = false;
		$scope.expModalTitle = 'Edit Experience';
		var json = exp;//eval("(" + exp + ")");

		// update with new data
		$scope.expEdit.companyName 			= json.companyName;
		$scope.expEdit.id 					= json._id;
		$scope.expEdit.title 				= json.title;
		$scope.expEdit.isStillHere 			= json.isWorking;
		$scope.expEdit.dateStarted.month 	= $scope.data.months[4];//json.dateStarted.month;
		$scope.expEdit.dateStarted.year 	= json.dateStarted.year;
		$scope.expEdit.description 			= json.description;
		$scope.expEdit.location 			= json.location;

		var dateStarted = new Date(exp.dateStarted);
		var dateEnded 	= new Date(exp.dateEnded);
		// calculate datetime and assign to model
		$scope.expDateStarted.month = $scope.data.months[dateStarted.getMonth()];
		$scope.expDateEnded.month  = $scope.data.months[dateEnded.getMonth()];

		// year
		for (var i = 0; i < $scope.data.years.length; i++) {
			if (dateStarted.getFullYear() == $scope.data.years[i].value) {
				$scope.expDateStarted.year = $scope.data.years[i];
				break;
			}
		}

		for (var i = 0; i < $scope.data.years.length; i++) {
			if (dateEnded.getFullYear() == $scope.data.years[i].value) {
				$scope.expDateEnded.year = $scope.data.years[i];
				break;
			}
		}

		console.log($scope.expEdit.dateStarted.month);

		if (json.isWorking == false) {
			$scope.expEdit.dateEnded.month 	= json.dateEnded.month;
			$scope.expEdit.dateEnded.year 	= json.dateEnded.year;
		}

		// display modal
		$('#expEditModal').modal('toggle');
		var value = $scope.expEdit.description.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&quot;/g, '"');
		tinyMCE.get('exp-editor').setContent(value);
	}

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
