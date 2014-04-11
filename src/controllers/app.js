var teifighterApp = angular.module('teifighterApp', ['ui.codemirror']);
 
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
        controller : 'TeiInfoController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

teifighterApp.service('teiService', function() {
    // Stores the teiModel
    return {
        teiModel: {
            listOfPages: [],
            teiInfo: null,
            }
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

teifighterApp.controller("TeiInfoController", ['$scope', 'teiService', teiInfoController])

teifighterApp.controller("settingsController", function($scope)
{
  $scope.testUrl = "";

    // utils functions
  $scope.getNumber = function(num) {
    return new Array(num);
  };
}
);


