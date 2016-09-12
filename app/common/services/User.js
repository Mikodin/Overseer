app.service('User', UserService);

UserService.$inject = ['$http', '$state', 'ApiConfigInfo'];

function UserService($http, $state, ApiConfigInfo) {
  var Api = ApiConfigInfo;
  var kanbanikUrl = 'http://localhost:8080/kanbanik/api';
  var apiUrl = 'http://localhost:8081/api/';

  this.login = function(person) {
    return $http({
      method: 'GET',
      url: Api.Kanbanik.url + Api.Kanbanik.commandStr + '"login","userName":"' + person.username +
          '","password":"' + person.password + '"}'
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(JSON.stringify(response));
      if (response.status === -1) {
        alert('The Kanbanik API cannot be reached, please start Kanbanik and try again');
      }
      if (response.status === 452) {
        alert('You\'ve entered the wrong username or password, please try again');
      }
      return response;
    });
  };

  this.getById = function(userId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'user/' + userId,
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      alertErrorConnectingOverseerAPI('user/' + userId);
      return response;
    });
  };

  this.getAll = function() {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'user/',
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      alert('Could not fetch users from db, are you sure Mongo is running?  Is the kanbanikdb collection existent?');
      alertErrorConnectingOverseerAPI('user/');
      return response;
    });
  };

  this.getTasks = function(userId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'user/' + userId + '/tasks/' ,
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      alertErrorConnectingOverseerAPI('user/' + userId + '/tasks/');
      return response;
    });
  };

  this.getProjects = function(userId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'user/' + userId + '/projects/' ,
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      alertErrorConnectingOverseerAPI('user/' + userId + '/projects/');
      return response;
    });
  };

  this.getExtras = function(userId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'user/' + userId + '/extras/' ,
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      alertErrorConnectingOverseerAPI('user/' + userId + '/extras/');
      return response;
    });
  };

  function alertErrorConnectingOverseerAPI(path) {
    alert('ERR: Could not fetch "' + apiUrl + path + '" from the OverseerAPI');
  }

}
