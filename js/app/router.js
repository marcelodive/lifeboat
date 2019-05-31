angular.module('lifeboat')
.config(function($routeProvider) {
 $routeProvider

 .when('/boat', {
    templateUrl: './html/boat.html',
    controller: 'BoatController'
 })

 .otherwise({
    templateUrl: './html/login.html',
    controller: 'LoginController'
 });
});
