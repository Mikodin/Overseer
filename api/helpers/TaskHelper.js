/*
 * Publicly available functions
 */
module.exports = {
  constructTask: constructTask,
};

var Q = require('q');
var statusService = require('api/services/StatusService.js');

function constructTask(tasks) {
  var deferred = Q.defer();
  console.log(tasks);
  return deferred.promise;
}
