angular.module('lifeboat')
.controller('BoatController', function BoatController($scope, boatFactory, $mdDialog) {
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

  $scope.registryMember = (member) => {
    if (member) {
      boatFactory.registryMember(member)
        .then((response) => {
          console.log(response);
        });
    }
  }

  $scope.editMember = (member) => {
    console.log(member);
    $scope.selectedMember = member;
    showEditionDialog();
  }

  function showEditionDialog () {
    $mdDialog.show({
      controller: BoatController,
      templateUrl: './../../html/boat.user-edit.html',
      parent: angular.element(document.body),
      scope: $scope.$new(),
      // targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: false // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.hideDialog = function() {
    $mdDialog.hide();
  };
  
  function init () {
    $scope.boat = JSON.parse(localStorage.getItem('boat'));
    if (!$scope.boat) {
      $window.location.href = '/';
    } 
  }
});