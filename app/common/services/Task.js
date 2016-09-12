app.service('Task', TaskService);

TaskService.$inject = ['$rootScope', '$http', 'ApiConfigInfo', 'KanbanikTask'];

function TaskService($rootScope, $http, ApiConfigInfo, KanbanikTask) {
  var Api = ApiConfigInfo;

  this.editTask = function(task) {
    var editedTask = task;

    this.getTask(task)
      .then(function(response) {
        editedTask.version = response.version;
        editedTask.classOfService = response.classOfService;
        var taskStr = apiStringifyTask(editedTask);

        return $http({
          method: 'POST',
          url: generateKanbanikRestUrl('editTask', taskStr),
        })
        .then(function(response) {
          return response.data;
        })
        .catch(function(response) {
          console.log(response);
          alertErrorConnectingKanbanikApi(generateKanbanikRestUrl('editTask', taskStr));
          return response;
        });
      });
  };

  this.getTask = function(task) {
    var tmpStr = JSON.stringify(task);
    var taskStr = tmpStr.substring(1, tmpStr.length - 1);

    return $http({
      method: 'GET',
      url: generateKanbanikRestUrl('getTask', taskStr),
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingKanbanikApi(generateKanbanikRestUrl('getTask', taskStr));
      return response;
    });
  };

  function apiStringifyTask(task) {
    var tmpStr = JSON.stringify(task);
    var taskStr = tmpStr.substring(1, tmpStr.length - 1);
    return taskStr;
  }

  function generateKanbanikRestUrl(commandName, stringifyTask) {
    var cmdString = '"' + commandName + '"';
    var kanbanikRestUrl = Api.Kanbanik.url + Api.Kanbanik.commandStr + cmdString  + ',' +
      stringifyTask + ',' + '"sessionId":"' + $rootScope.sessionId + '"\}';

    return kanbanikRestUrl;
  }

  this.deleteTask = function(task) {
    var updatedTask = task;

    this.getTask(task)
      .then(function(response) {
        updatedTask.version = response.version;
        var taskStr = apiStringifyTask(updatedTask);

        return $http({
          method: 'POST',
          url: Api.Kanbanik.url + Api.Kanbanik.commandStr + '"deleteTask","sessionId":"' +
            $rootScope.sessionId + '","values":[\{' + taskStr + '\}]\}',
        })
        .then(function(response) {
          return response.data;
        })
        .catch(function(response) {
          console.log(response);
          alertErrorConnectingKanbanikApi(Api.Kanbanik.url +
              Api.Kanbanik.commandStr + '"deleteTask","sessionId":"' +
              $rootScope.sessionId + '","values":[\{' + taskStr + '\}]\}');
          return response;
        });

      });
  };

  this.createTask = function(task) {
    var taskStr = apiStringifyTask(task);

    return $http({
      method: 'POST',
      url: generateKanbanikRestUrl('createTask', taskStr),
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.log(response);
      alertErrorConnectingKanbanikApi(generateKanbanikRestUrl('createTask', taskStr));
      return response;
    });
  };

  this.initKanbanikTask = function(task) {
    kanbanikTask = new KanbanikTaskService().init(task);
    delete(kanbanikTask.init);
    return kanbanikTask;
  };

  function alertErrorConnectingOverseerAPI(path) {
    alert('ERR: Could not fetch "' + Api.Overseer.url + path + '" from the OverseerAPI');
  }

  function alertErrorConnectingKanbanikApi(kanbanikRestUrl) {
    alert('ERR: Could not fetch "' + kanbanikRestUrl + '" from the KanbanikAPI');
  }
}
