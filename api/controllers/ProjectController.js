var express = require('express');
var app = express();
var router = express.Router();

var projectService = require('api/services/ProjectService');

/*
 * Routing
 * What function to get called when X route is hit
 */
router.get('/', getAll);
router.get('/:_id', getById);

/*
 * Make the routes publicly available
 */
module.exports = router;

/**
 * getAll
 * Fetches all projects from all boards
 * Handles promise returned by the projectService.getAll() function
 *
 * @param {Object} req
 * @param {Object} res
 */
function getAll(req, res) {
  console.log('-Project getAll');
  console.log(req.params);
  projectService.getAll()
    .then(function(response) {
      return res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getById
 * Fetches project with the associated ID
 * Handles promise returned by the projectService
 *
 * @param {Object} req
 * @param {Object} res
 */
function getById(req, res) {
  console.log('-Project getById');
  console.log(req.params);
  projectService.getById(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}
