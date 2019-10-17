angular.module('lifeboat')
.factory('statisticsFactory', function($http, API, utilsFactory) {
  return {
    getStatistics: () => {
        return $http.get(API.url + 'statistics');
    },
    getPivotTable: () => {
      return $http.get(API.url + 'pivot-table');
    }
  };
});