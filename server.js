/*
 * Makes all require('') paths start at the project root
*/
require('rootpath')();

var favicon = require('serve-favicon');
var express = require('express');
var app = express();
var port = 8081;

/*
 * Contains the DB url
*/
var config = require('config.json');

var mongoose = require('mongoose');
mongoose.connect(config.dbConnection);
mongoose.connection.on('error', function() {
  console.error('ERROR: Cannot connect to MongoDB. Please make sure that MongoDB is running.');
  process.exit(1);
});

/*
 * Enable CORS (Cross-Origin Resource sharing)
 *
 * var cors = require('cors');
 * app.use(cors());
 *
 */

app.use(favicon('app/assets/img/favicon.ico'));

// Middleware that will do pre-proccessing and logging to all requests
app.use(function(req, res, next) {
  console.log('Incoming Request');
  console.log(req.method, req.url);
  next();
});

// Main routes
app.use('/api/user', require('api/controllers/UserController'));
app.use('/api/board', require('api/controllers/BoardController'));
app.use('/api/project', require('api/controllers/ProjectController'));
app.use('/api/status', require('api/controllers/StatusController'));

// make '/app' default route
app.use('/', express.static('app'));

/*
 * Starts the server
 */
app.listen(port, function() {
  console.log('Server started on localhost:' + port);
});
