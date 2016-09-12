app.controller('NavCtrl', NavCtrl);

NavCtrl.$inject = ['$scope','$rootScope', '$state', '$stateParams', 'ApiConfigInfo'];

function NavCtrl($scope, $rootScope, $state, $stateParams, ApiConfigInfo) {
  var vm = this;
  var Api = ApiConfigInfo;

  /*
   * Public Methods
   */
  vm.logout = logout;

  /*
   * Public Variables
   */
  vm.kanbanikUrl = Api.Kanbanik.url;

  function logout() {
    $rootScope.user = {};
    $rootScope.sessionId = undefined;
  }
}
