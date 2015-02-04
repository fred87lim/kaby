// AngularJS

var phonecatApp = angular.module('phonecatApp', ['ngRoute','PopInTownControllers', 'phonecatFilters', 
  'phonecatServices', 'phonecatAnimations', 'ui.bootstrap', 'angularFileUpload', 'ngSanitize', 'ui.ace']);

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
                console.log(boundx + '/' + boundy);
             }
             
            });
        }
       });
       scope.$on('$destroy', clear);
        }
    };
});

phonecatApp.directive('codeHighlighter', function () {
  return {
    restrict: 'EA',
    link: function (scope, element, attr) {
        console.log('Test directive');
    }
  }
});

phonecatApp.directive('vk', ['$compile', function($compile) {
  return {
    template: '<div>Content of Vk</div>',
    restrict: 'AE',
    link: function (scope, element, attr) {
      console.log('"link" function inside directive vk called, "element" param is: ', element);
    }
  };
}]);

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

phonecatApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.
		when('/phones', {
			templateUrl: '/partials/phone-list.html',
			controller: 'PhoneListCtrl'
		}).
		when('/phone/:phoneId', {
			templateUrl: '/partials/phone-detail.html',
			controller: 'PhoneDetailCtrl'
		}).
    when('/biz/new', {
      templateUrl: '/partials/new-biz.html',
      controller: 'NewBizCtrl'
    }).
    when('/settings', {
      templateUrl: '/partials/settings.html',
      controller: 'SettingsCtrl'
    }).
    when('/index', {
      templateUrl: '/partials/index.html',
      controller: 'IndexCtrl'
    }).
    when('/rate', {
      templateUrl: '/partials/rate.html',
      controller: 'RateCtrl'
    }).
    when('/transactions', {
      templateUrl: '/partials/transactions.html',
      controller: 'TransactionsCtrl'
    }).
    when('/post/new', {
      templateUrl: 'partials/new-post.html',
      controller: 'NewPostCtrl'
    }).
    when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/:username/:urlTitle', {
      templateUrl: 'partials/user-post.html',
      controller: 'UserPostCtrl'
    }).
    when('/:username', {
      templateUrl: 'partials/user.html',
      controller: 'UserProfileCtrl'
    }).
		otherwise({
			redirectTo: '/index'
		});

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
}]);

phonecatApp.directive('helloWorld', function () {
	return {
		restrict: 'AE',
		replace: false,
		templateUrl: '/partials/logout-navbar.html'
	};
});

phonecatApp.directive('loginNavbar', function () {
  return {
    restrict: 'AE',
    replace: false,
    templateUrl: '/partials/login-navbar.html'
  };
});

function AlertDemoCtrl($scope) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: "Another alert!"});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: '/partials/login-popup.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    toastr.info("Javascript is so awesome");

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items, $location, Auth) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.loginUser = function () {
    toastr.success("You are signed in.\n" + JSON.stringify(data));
    Auth.login({email: 'kabuky_knight@yahoo.com', password: 'myl0v3'}).success(function (data) {
     if (data.error) {
       toastr.error(data.error);
     } else {
       toastr.success("You are signed in.\n" + JSON.stringify(data));
       $scope.$emit("USER_LOGGEDIN" , "test emit");
       $modalInstance.close($scope.selected.item);
     }
    });
  };

  $scope.$on('USER_LOGGEDIN', function () {
    
    toastr.info("USER_LOGGEDIN: Closing User Login Dialog");
  });

  $scope.ok = function () {
    toastr.info("Closing User Login Dialog");
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

