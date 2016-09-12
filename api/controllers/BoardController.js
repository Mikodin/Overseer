var express = require('express');
var app = express();
var router = express.Router();

var boardService = require('api/services/BoardService');

/*
 * Routing
 * What function to get called when X route is hit
 */
router.get('/', getAll);
router.get('/:_id', getById);
router.get('/:_id/workflow', getWorkFlow);
router.get('/:_id/tasks', getTasks);
router.get('/:_id/projects', getProjects);

/*
 * Make the routes publicly available
 */
module.exports = router;

/**
 * getAll
 * Fetches all the boards
 * Handles promise returned by the boardService.getAll() function
 *
 * @param {Object} req
 * @param {Object} res
 */
function getAll(req, res) {
  console.log('-Board getAll');
  console.log(req.params);
  boardService.getAll()
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getById
 * Fetches board with the associated ID
 * Handles promise returned by the boardService
 *
 * @param {Object} req
 * @param {Object} res
 */
function getById(req, res) {
  console.log('-Board getById');
  console.log(req.params);
  boardService.getById(req.params)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getWorkFlow
 * Fetches the workflow of the board with the associated ID
 * Handles promise returned by the boardService
 *
 * @param {Object} req
 * @param {Object} res
 */
function getWorkFlow(req, res) {
  console.log('-Board getWorkFlow');
  console.log(req.params);
  boardService.getWorkFlow(req.params)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getTasks
 * Fetches the tasks contained in the board with the associated ID
 * Handles promise returned by the boardService
 *
 * @param {Object} req
 * @param {Object} res
 */
function getTasks(req, res) {
  console.log('-Board getTasks');
  console.log(req.params);
  boardService.getTasks(req.params)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

/**
 * getProjects
 * Fetches the Projects contained in the board with the associated ID
 * Handles promise returned by the boardService
 *
 * @param {Object} req
 * @param {Object} res
 */
function getProjects(req, res) {
  console.log('-Board getProjects');
  console.log(req.params);
  boardService.getProjects(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}
