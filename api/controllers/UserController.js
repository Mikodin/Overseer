var express = require('express');
var app = express();
var router = express.Router();

var userService = require('api/services/UserService');

/*
 * Routing
 * What function to get called when X route is hit
 */
router.get('/', getAll);
router.get('/:_id', getById);
router.get('/:_id/projects', getProjects);
router.get('/:_id/tasks', getTasks);
router.get('/:_id/extras', getExtraInfo);

/*
 * Make the routes publicly available
 */
module.exports = router;

/**
 * getAll
 * Fetches all users
 * Handles promise returned by the userService.getAll() function
 *
 * @param {Object} req
 * @param {Object} res
 */
function getAll(req, res) {
  console.log('-User getAll');
  console.log(req.params);
  userService.getAll()
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getById
 * Fetches a user with the associated ID
 * Handles promise returned by the userService.getById() function
 *
 * @param {Object} req
 * @param {Object} res
 */
function getById(req, res) {
  console.log('-User getById');
  console.log(req.params);
  userService.getById(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getProjects
 * Fetches all the projects that a user has
 * Handles promise returned by the userService.getProjects() function
 *
 * @param {Object} req
 * @param {Object} res
 */
function getProjects(req, res) {
  console.log('-User getProjects');
  console.log(req.params);
  userService.getProjects(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}
/**
 * getTasks
 * Fetches all the tasks that are assigned to a user
 * Resolves the promise returned by the userService.getTasks() function
 *
 * @param {Object} req
 * @param {Object} res
 */

function getTasks(req, res) {
  console.log('-User getTasks');
  console.log(req.params);
  userService.getTasks(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

function getExtraInfo(req, res) {
  console.log('User getExtraInfo');
  console.log(req.params);
  userService.getExtraInfo(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
    res.json(response);
  });
}

/**
 * getAllById
 * Fetches an array of users with the associated IDs in the array
 * Handles promise returned by the userService.getById() function
 *
 * @param {Object} req
 * @param {Object} res
 */
function getAllById(req, res) {
  console.log('-User getAllById');
  console.log(req.params);
  userService.getAllById(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}
