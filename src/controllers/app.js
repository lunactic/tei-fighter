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
      otherwise({
        redirectTo: '/'
      });
  }]);

teifighterApp.controller("TeifighterController", teifighterController)
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


teifighterApp.controller("settingsController", function($scope)
{
  $scope.testUrl = "http://digi.ub.uni-heidelberg.de/diglitData/image/cpg148/4/007v.jpg";
}
);


