app.service('Status', StatusService);

StatusService.$inject = ['$http', 'ApiConfigInfo'];

function StatusService($http, ApiConfigInfo) {
  var Api = ApiConfigInfo;

  this.getAll = function() {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'status/',
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('status/');
      return response;
    });
  };

  this.getById = function(statusId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'status/' + statusId,
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('status/' + statusId);
      return response;
    });
  };

  function alertErrorConnectingOverseerAPI(path) {
    alert('ERR: Could not fetch "' + Api.Overseer.url + path + '" from the OverseerAPI');
  }
}
