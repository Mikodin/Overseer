app.directive('navigation', function() {
  return {
    restrict: 'E',
    templateUrl: '/common/directives/navigation/navigation.html',
    link: function(scope, elem, attrs) {
      angular.element('#navigation');
    },
    controller: 'NavCtrl',
  };
});
