/*
 * Public methods
 */
module.exports = {
  getAll: getAll,
  getById: getById,
  getProjects: getProjects,
  getTasks: getTasks,
  getAllById: getAllById,
  getExtraInfo: getExtraInfo,
};

var mongoose = require('mongoose');
var User = require('api/models/user.js');
var Board = require('api/models/board.js');
var userHelper = require('api/helpers/UserHelper.js');
var Q = require('q');

/**
 * getAll
 * Fetches all users contained in the DB
 *
 * @returns {Promise}
 */
function getAll() {
  var deferred = Q.defer();
  User.find(function(err, docs) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(docs);
    }
  });
  return deferred.promise;
}

/**
 * getById
 * Fetches the user with the associated id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function getById(id) {
  var deferred = Q.defer();
  User.findById(id, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
}

/**
 * getAllById
 * Fetches the array of users with the associated id
 *
 * @param {Array} ids
 * @returns {Promise}
 */
function getAllById(ids) {
  var deferred = Q.defer();
  User.find({'_id': {$in: ids}}, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
}

/**
 * getProjects
 * Fetches all the projects that a user is involved in
 *
 * @param {String} id
 * @returns {Promise}
 */
function getProjects(id) {
  console.log('getProjects');
  var deferred = Q.defer();

  userHelper.getUserProjects(id)
    .then(function(response) {
      deferred.resolve(response);
    })
  .catch(function(response) {
    deferred.resolve();
    console.log(response);
  });
  return deferred.promise;
}

/**
 * getTasks
 * Fetches all the tasks that are assigned to the user
 *
 * @param {String} id
 * @returns {Promise}
 */
function getTasks(id) {
  console.log('getTasks');
  var deferred = Q.defer();

  userHelper.getUserTasks(id)
    .then(function(response) {
      deferred.resolve(response);
    })
  .catch(function(response) {
    deferred.resolve();
    console.log(response);
  });
  return deferred.promise;
}

function getExtraInfo(id) {
  console.log('getExtraInfo');
  var deferred = Q.defer();

  userHelper.getUserExtraInfo(id)
    .then(function(response) {
      deferred.resolve(response);
    })
  .catch(function(response) {
    deferred.resolve();
    console.log(response);
  });
  return deferred.promise;
}
