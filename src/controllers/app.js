var teifighterApp = angular.module('teifighterApp', []);
 
teifighterApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'DummyController'
      }).
      when('/info', {
      	templateUrl:'views/info.html',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

teifighterApp.controller('DummyController', function(){

});