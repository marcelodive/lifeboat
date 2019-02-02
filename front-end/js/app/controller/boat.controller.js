angular.module('lifeboat')
.controller('BoatController', function BoatController($scope, boatFactory, $mdDialog, $window) {
  const localStorage = window.localStorage;

  $scope.onDateSelect = () => {
    cleanScopeVariables();

    $scope.selectedDate = $scope.selectedDate.toISOString().substring(0,10);

    boatFactory.getMembers($scope.boat.id, $scope.selectedDate).then((response) => {
      $scope.members = Object.values(response.data);
      $scope.members.forEach((member) => {
        member.is_present = (member.is_present == 'true');        
      });
    });
    boatFactory.getMinistration($scope.boat.id, $scope.selectedDate).then((response) => {
      $scope.ministration = (response.data) ? response.data.ministration: null;      
    });    
  }

  $scope.setPresenceForMember = (memberId, isPresent) => {
    if(isPresent !== undefined){
      boatFactory.setPresenceForMember(memberId, $scope.boat.id, $scope.selectedDate, isPresent)
        .then((response) => {
          console.log(response);
        });
    }
  }

  $scope.registryMember = (member) => {
    if (member) {
      member.boat_id = $scope.boat.id;
      boatFactory.registryMember(member).then((response) => {
        const newMember = response.data;
        if (newMember.id != member.id) {
          $scope.members.push(newMember);
          window.alert(`Membro registrado com sucesso!`)
        } else {
          member = newMember;
        }    
        $mdDialog.hide();     
      });
    }
  }

  $scope.editMember = (member = {}) => {
    $scope.selectedMember = member;
    showEditionDialog();
  }

  $scope.disconnectMember = (selectedMember) => {
    if (selectedMember.id) {
      const message = `Você deseja desligar "${selectedMember.name}" de seu bote?`;
      const disconnectMember = window.confirm(message);
      if (disconnectMember) {
        boatFactory.disconnectMember(selectedMember.id).then((response) => {
          window.alert(`O membro "${selectedMember.name}" foi desligado`);
          selectedMember.disconnected = 1;
          $mdDialog.hide();
        });
      } else {
        $mdDialog.hide();
      }
    }
  }

  $scope.saveMinistration = (ministration) => {
    if (ministration != null) {
      $scope.ministrationState = "Salvando ministração...";
      boatFactory.saveMinistration(ministration, $scope.boat.id, $scope.selectedDate).then((response) => {
        $scope.ministrationState = "Ministração salva!";
      })
    }
  }

  $scope.hideDialog = () => {
    $mdDialog.hide();
  };

  $scope.backToSelectBoat = () => {
    $window.location.href = '/';
  }

  function showEditionDialog () {
    $mdDialog.show({
      controller: BoatController,
      templateUrl: './../../html/boat.user-edit.html',
      parent: angular.element(document.body),
      scope: $scope.$new(),
      clickOutsideToClose:false,
      fullscreen: false // Only for -xs, -sm breakpoints.
    });
  };

  function cleanScopeVariables () {
    $scope.ministrationState = null;
    $scope.ministration = null;
    $scope.checked = [];
    $scope.members = [];
  }
  
  (function init () {
    $scope.boat = JSON.parse(localStorage.getItem('boat'));
    if (!$scope.boat) {
      $window.location.href = '/';
    } 
  })();
});