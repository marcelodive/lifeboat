angular.module('lifeboat')
.controller('BoatController', function BoatController($scope, boatFactory) {
  const localStorage = window.localStorage;
  $scope.checked = [];

  init();

  $scope.onDateSelect = () => {
    const selectedDate = $scope.selectedDate.toISOString().substring(0,10);
    boatFactory.getMembers($scope.boat.id, selectedDate).then((response) => {
      $scope.members = Object.values(response.data);
      $scope.members.forEach((member) => {
        member.is_present = (member.is_present == 'true');        
      });
    });
  }

  $scope.setPresenceForMember = (memberId, isPresent) => {
    const selectedDate = $scope.selectedDate.toISOString().substring(0,10);
    if(isPresent !== undefined){
      boatFactory.setPresenceForMember(memberId, $scope.boat.id, selectedDate, isPresent)
        .then((response) => {
          console.log(response);
        });
    }
  }
  
  function init () {
    $scope.boat = JSON.parse(localStorage.getItem('boat'));
    if (!$scope.boat) {
      $window.location.href = '/';
    } 
  }
});