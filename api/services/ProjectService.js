/*
 * IMPORTANT:
 * There is a difference between the objects in the DB and the objects created in
 * the ProjectHelper.js file
 *
 * The objects in the DB contain very little useful information and need to be expanded on
 * The objects created in ProjectHelper allow for alot more flexibility and are NOT stored in the DB.
 *
 * The API is returning the custom made objects that are made from parsing out entire boards
 * The functions are found in ~/api/helpers/ProjectHelper.js
 *
 * This is not the ideal as it is not very efficient, but I cannot change the schema in the DB
 */

/*
 * Public Methods
 */
module.exports = {
  getAll: getAll,
  getById: getById,

  getByIdDb: getByIdDb,
  getAllDb: getAllDb,
};

var mongoose = require('mongoose');
var Project = require('api/models/project.js');
var projectHelper = require('api/helpers/ProjectHelper.js');
var Board = require('api/models/board.js');
var Q = require('q');

/**
 * getAll
 * Fetches all project objects
 *
 * @returns {Promise}
 */
function getAll() {
  var deferred = Q.defer();
  projectHelper.getAllProjects()
    .then(function(response) {
      deferred.resolve(response);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}

/**
 * getById
 * Fetches the constructed project object with the associated ID
 *
 * @param {String} id
 * @returns {Object}
 */
function getById(id) {
  var deferred = Q.defer();
  projectHelper.getProjectById(id)
    .then(function(response) {
      deferred.resolve(response);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}

/**
 * getAllDb
 * Fetches all projects contained in the DB
 *
 * @returns {Promise}
 */
function getAllDb() {
  var deferred = Q.defer();
  Project.find(function(err, docs) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(docs);
    }
  });
  return deferred.promise;
}

/**
 * getByIdDb
 * Fetches the project with the associated id from the DB
 *
 * @param {Number} id
 * @returns {Promise}
 */
function getByIdDb(id) {
  var deferred = Q.defer();
  Project.findById(id, function(err, doc) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
}
