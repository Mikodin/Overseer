app.service('Board', BoardService);

BoardService.$inject = ['$http', 'ApiConfigInfo'];

function BoardService($http, ApiConfigInfo) {
  var Api = ApiConfigInfo;

  this.getAll = function() {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'board/',
    }).then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('board/');
      return response;
    });

  };

  this.getById = function(boardId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'board/' + boardId,
    }).then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('board/' + boardId);
      return response;
    });
  };

  this.getProjects = function(boardId) {
    return $http({
      method: 'GET',
      url: Api.Overseer.url + 'board/' + boardId + '/projects',
    }).then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingOverseerAPI('board/' + boardId + '/projects');
      return response;
    });
  };

  function alertErrorConnectingOverseerAPI(path) {
    alert('ERR: Could not fetch "' + Api.Overseer.url + path + '" from the OverseerAPI');
  }
}
