var express = require('express');
var app = express();
var router = express.Router();

var StatusService = require('api/services/StatusService.js');

router.get('/', getAll);
router.get('/:_id', getById);

module.exports = router;

function getAll(req, res) {
  console.log('ClassesOfService getAll');
  console.log(req.params);
  StatusService.getAll()
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}

function getById(req, res) {
  console.log('ClassesOfService getById');
  console.log(req.params);
  StatusService.getById(req.params._id)
    .then(function(response) {
      res.json(response);
    })
  .catch(function(response) {
    console.log(response);
  });
}
