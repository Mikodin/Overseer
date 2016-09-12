module.exports = {
  getAll: getAll,
  getById: getById
};

var mongoose = require('mongoose');
var ClassesOfService = require('api/models/status.js');
var Q = require('q');

function getAll() {
  var deferred = Q.defer();

  ClassesOfService.find(function(err, docs) {
    if (err) {
      deferred.resolve();
    } else {
      console.log(docs);
      deferred.resolve(docs);
    }
  });
  return deferred.promise;
}

function getById(id) {
  var deferred = Q.defer();
  ClassesOfService.findById(id, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
}
