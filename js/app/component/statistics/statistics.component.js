angular.module('lifeboat').component('statistics', {
  templateUrl: './js/app/component/statistics/statistics.html',
  bindings: {
    user: '@'
  },
  controller: StatisticsController
});

async function StatisticsController($scope, statisticsFactory) {  
  const {data: {boatStatistics, mostPresentMembers, randMinistrations, randPhoto}} = await statisticsFactory.getStatistics();
  $scope.boatStatistics = boatStatistics;
  $scope.mostPresentMembers = mostPresentMembers;
  $scope.randMinistrations = randMinistrations;
}