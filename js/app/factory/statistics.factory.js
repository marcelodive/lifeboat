angular.module('lifeboat')
.factory('statisticsFactory', function($http, API, utilsFactory) {
  return {
    getStatistics: () => {
        return $http.get(API.url + 'statistics');
    }
  };
});