angular.module('lifeboat')
.controller('LoginController', function LoginController($scope, $window, boatFactory) {
  const localStorage = window.localStorage;
  
  boatFactory.getBoats().then((response) => {
    $scope.boats = Object.values(response.data);
  });

  $scope.selectedItemChange = (item) => {
    if (item) {
      localStorage.setItem('boat', JSON.stringify(item));
      $window.location.href = './#!/boat';
    }
  };

  $scope.searchTextChange = (searchText) => { };

  $scope.querySearch = (searchText) => {
    if($scope.boats){
      return $scope.boats.filter((boat) => {
        return (boat.name.toLowerCase().includes(searchText.toLowerCase()));
      });
    }
  };
});