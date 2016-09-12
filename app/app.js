angular.module('overseer', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize',
    'datatables',
    'datatables.columnfilter',
    'datatables.scroller',
    'duScroll',
    'ngScrollbars',
    'angular.vertilize',
    'angular-confirm',
]);

var app = angular.module('overseer');

function isAuthenticated($rootScope) {
  if ($rootScope.sessionId === undefined) {
    return false;
  } else {
    return true;
  }
}

app.run(function($rootScope, $state, $timeout) {
  $rootScope.$on( '$stateChangeStart', function(event, toState  , toParams, fromState, fromParams) {
    if (toState.name === 'dashboard') {
      if ($rootScope.sessionId === undefined) {
        $timeout(function() { $state.go('login'); });   
        return;
      } else {
        $timeout(function() { $state.go('dashboard'); });   
        return;
      }
    }   
  });
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'login/views/login.html',
      controller: 'LoginCtrl',
      data : {requireLogin : false }
    })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'dashboard/views/dashboard.html',
    controller: 'DashboardCtrl',
    data : {requireLogin : true }
  });

  $urlRouterProvider.otherwise('login');
});


