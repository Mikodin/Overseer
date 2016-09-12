app.service('Project', ProjectService);

ProjectService.$inject = ['$http', 'ApiConfigInfo'];

function ProjectService($http, ApiConfigInfo) {
  var Api = ApiConfigInfo;

  this.getAll = function() {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'project/',
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('project/');
      return response;
    });
  };

  this.getById = function(projectId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'project/' + projectId,
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('project/' + projectId);
      return response;
    });
  };

  function alertErrorConnectingOverseerAPI(path) {
    alert('ERR: Could not fetch "' + Api.Overseer.url + path + '" from the OverseerAPI');
  }
}
