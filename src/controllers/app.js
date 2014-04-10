var teifighterApp = angular.module('teifighterApp', []);
 
teifighterApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'settingsController'
      }).
      when('/info', {
      	templateUrl:'views/info.html',
      }).
        when('/header', {
      	templateUrl:'views/infoTei.html',
        controller : 'TeifighterController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

teifighterApp.service('teiService', function() {
    return {
        teiInfo : {title: 't'}
    }
});
teifighterApp.controller("TeifighterController", ['$scope', 'teiService', teifighterController])
.directive('imageonload', function() {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
           element.bind('load', function() {
              scope.initializeCanvas();
        });
     }
 };
});

// Creates a service that stores the data


teifighterApp.controller("settingsController", function($scope)
{
  $scope.testUrl = "";

    // utils functions
  $scope.getNumber = function(num) {
    return new Array(num);
  };
}
);


