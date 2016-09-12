/*
 * Public methods
 */
module.exports = {
  getAll: getAll,
  getById: getById,
  getWorkFlow: getWorkFlow,
  getTasks: getTasks,
  getProjects: getProjects,
};

var mongoose = require('mongoose');
var Board = require('api/models/board.js');
var Project = require('api/models/project.js');
var Q = require('q');

var projectHelp = require('api/helpers/ProjectHelper.js');

/**
 * getAll
 * Fetches all the boards contained in the DB
 *
 * @returns {Promise}
 */
function getAll() {
  var deferred = Q.defer();

  Board.find(function(err, docs) {
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
 * Fetches the board with the associated id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function getById(id) {
  var deferred = Q.defer();

  Board.findById(id, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
}

/**
 * getWorkFlow
 * Fetches the workflow of the associated board
 *
 * @param {Number} id
 * @returns {Promise}
 */
function getWorkFlow(id) {
  var deferred = Q.defer();

  Board.findById(id, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc.workflow.workflowitems);
    }
  });
  return deferred.promise;
}

/**
 * getTasks
 * Fetches all the tasks that contained in the project with the associated id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function getTasks(id) {
  var deferred = Q.defer();

  Board.findById(id, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc.tasks);
    }
  });
  return deferred.promise;
}

/**
 * getProjects
 *
 * Constructs all the projects that are contained on a board
 *
 * @param {Number} id
 * @returns {Promise}
 */
function getProjects(id) {
  var projectIds = [];
  var deferred = Q.defer();

  projectHelp.constructProjects(id)
    .then(function(response) {
      deferred.resolve(response);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}
