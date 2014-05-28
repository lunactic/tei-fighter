var teifighterApp = angular.module('teifighterApp', ['ui.codemirror']);
 
teifighterApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'TeifighterController'
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

teifighterApp.service('lineService', ['$http','$q', lineService]);

teifighterApp.controller("TeifighterController", ['$scope', '$location', '$timeout', 'teiService', 'lineService', teifighterController])
.directive('imageonload', function() {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
           element.bind('load', function() {
              scope.initializeCanvas();
        });
     }
 };
}).directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.bind('focus', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);

teifighterApp.controller("TeiInfoController", ['$scope', 'teiService', teiInfoController])
teifighterApp.controller("TranscriptionController", ['$scope', transcriptionController]);

teifighterApp.controller("settingsController", function($scope)
{
  $scope.testUrl = "";

    // utils functions
  $scope.getNumber = function(num) {
    return new Array(num);
  };
}
);



