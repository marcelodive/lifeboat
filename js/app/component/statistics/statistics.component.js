const template = `
  <h1>Hello {{ $ctrl.user }} {{ $ctrl.name }}</h1>
`; 

angular.module('lifeboat').component('statistics', {
  template: template, 
  bindings: {
    user: '@'
  },
  controller: StatisticsController
});

function StatisticsController($scope, $element, $attrs) {
  const ctrl = this;
  
  ctrl.name = 'Marcelo';
}