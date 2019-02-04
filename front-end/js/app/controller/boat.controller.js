angular.module('lifeboat')
.controller('BoatController', function BoatController(
  $scope, 
  boatFactory, 
  $mdDialog, 
  $window,
  utilsFactory
) {
  const localStorage = window.localStorage;

  $scope.isDisconnectingMember = false;

  $scope.$watch(() => $scope.selectedDate, () => $scope.onDateSelect());

  $scope.onDateSelect = () => {
    cleanScopeVariables();
    $scope.loadingMembers = true;

    $scope.dateForDB = utilsFactory.sanitizeDateForDB($scope.selectedDate);    

    boatFactory.getMembers($scope.boat.id, $scope.dateForDB).then((response) => {      
      $scope.members = Object.values(response.data);
      $scope.members.forEach((member) => {
        member.is_present = (member.is_present == 'true');        
      });
      $scope.loadingMembers = false;
    });

    boatFactory.getMinistration($scope.boat.id, $scope.dateForDB).then((response) => {
      $scope.ministration = (response.data) ? response.data.ministration: null;      
    });    
  }

  $scope.setPresenceForMember = (memberId, isPresent) => {
    if(isPresent !== undefined){
      boatFactory.setPresenceForMember(memberId, $scope.boat.id, $scope.dateForDB, isPresent)
        .then((response) => {
          console.log(response);
        });
    }
  }

  $scope.registryMember = (member) => {
    if (member) {
      member.boat_id = $scope.boat.id;
      member.birthday = utilsFactory.sanitizeDateForDB(member.birthday);
      boatFactory.registryMember(member).then((response) => {
        const newMember = response.data;
        if (newMember.id != member.id) {
          $scope.members.push(newMember);
          member = newMember;
          utilsFactory.showToaster(`Membro registrado com sucesso!`);
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
        boatFactory.disconnectMember(selectedMember.id, selectedMember.justification)
        .then(() => {
          utilsFactory.showToaster(`O membro "${selectedMember.name}" foi desligado`);
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
      boatFactory.saveMinistration(ministration, $scope.boat.id, $scope.dateForDB)
      .then(() => {
        $scope.ministrationState = "Ministração salva!";
      })
    }
  }

  $scope.hideDialog = () => {
    $scope.isDisconnectingMember = false;
    $mdDialog.hide();
  };

  $scope.backToSelectBoat = () => {
    $window.location.href = '/';
  }

  $scope.parseInt = parseInt;

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
    $scope.members = [];
  }
  
  (function init () {
    $scope.boat = JSON.parse(localStorage.getItem('boat'));
    if (!$scope.boat) {
      $window.location.href = '/';
    } 
  })();
});