app.controller('LoginCtrl', LoginCtrl);

LoginCtrl.inject = ['$rootScope','$scope', '$state', 'User'];

function LoginCtrl($rootScope, $scope, $state, User) {
  var vm = this;

  vm.login = function(person) {
    User.login(person)
      .then(function(response) {
        $rootScope.user = response;
        $rootScope.sessionId = response.sessionId;
        $state.transitionTo('dashboard');
      });
  };
}
