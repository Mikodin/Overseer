/*
 * Publicly available functions
 */
module.exports = {
  getUserProjects: getUserProjects,
  getUserTasks: getUserTasks,
  getUserExtraInfo: getUserExtraInfo,
};

var mongoose = require('mongoose');
var Q = require('q');

/*
 * 'Import' our services'
 */
var projectHelper = require('api/helpers/ProjectHelper.js');

/**
 * getUserProjects
 * Gets all projects that a user is in
 *
 * @param {String} userId
 * @returns {Promise}
 * Promise resolves to all the tasks that a user has
 */
function getUserProjects(userId) {
  var deferred = Q.defer();
  var userProjects = [];

  projectHelper.getAllProjects()
    .then(function(response) {
      var allProjects = response;
      var userProjects = parseUserProjects(userId, allProjects);

      deferred.resolve(userProjects);
    })
  .catch(function(response) {
    deferred.resolve();
    console.log(response);
  });
  return deferred.promise;
}

function parseUserProjects(userId, allProjects) {
  userProjects = [];

  for (var i = 0; i < allProjects.length; i++) {
    if (allProjects[i].containsUser(userId)) {
      userProjects.push(allProjects[i]);
    }
  }
  return userProjects;
}

/**
 * getUserTasks
 * Gets all of the tasks assigned to the user
 *
 * @param {String} userId
 * @returns {Promise}
 * Promise resolves to all the tasks that a user has
 */
function getUserTasks(userId) {
  var deferred = Q.defer();

  getUserProjects(userId)
    .then(function(response) {
      var allProjects = response;
      var userTasks = parseUserTasks(userId, allProjects);

      deferred.resolve(userTasks);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}

function parseUserTasks(userId, projects) {
  var userTasks = [];

  for (var i = 0; i < projects.length; i++) {
    if (projects[i].tasks !== undefined || projects[i].tasks.length > 0) {
      for (var j = 0; j < projects[i].tasks.length; j++) {
        task = projects[i].tasks[j];
        if (task.assignee === userId) {
          userTasks.push(task);
        }
      }
    }
  }
  return userTasks;
}

/**
 * getUserExtraInformation
 * When the promise resolves there will be an extraInformation {Object} that contains data such as
 * latestTaskDueDate, totalEffort
 *
 * @param {String} userId
 * @returns {Promise}
 */
function getUserExtraInfo(userId) {
  var deferred = Q.defer();
  var extraInformation = {};

  getUserTasks(userId)
    .then(function(response) {
      var userTasks = response;

      extraInformation.earliestTaskDueDate = dateToString(getEarliestTaskDueDate(userTasks));
      extraInformation.latestTaskDueDate = dateToString(getLastTaskDueDate(userTasks));
      extraInformation.totalEffort = calcTotalEffort(userTasks);
      deferred.resolve(extraInformation);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}

function dateToString(date) {
  if (isValidDate(date)) {
    var dateStr = date.toJSON().split('-');
    return dateStr[0] + '-' + dateStr[1] + '-' + dateStr[2].split('T')[0];
  } else {
    return '';
  }
}

function getLastTaskDueDate(tasks) {
  var latestTaskDueDate = calcEarliestLatestDates(tasks).latest;
  return latestTaskDueDate;
}

function getEarliestTaskDueDate(tasks) {
  var earliestTaskDueDate = calcEarliestLatestDates(tasks).earliest;
  return earliestTaskDueDate;
}

function calcTotalEffort(tasks) {
  var totalEffort = 0;
  var earliestLatestDates = {
    earliest: '',
    latest: '',
  };
  earliestLatestDates = calcEarliestLatestDates(tasks);
  totalEffort = differenceInDaysBetweenDates(earliestLatestDates.earliest,
      earliestLatestDates.latest);

  return totalEffort;
}

function calcEarliestLatestDates(tasks) {
  var dates = {};
  var earliestDate = '';
  var latestDate = '';

  for (var i = 0; i < tasks.length; i++) {
    var currentDate = tasks[i].dueDate;

    if (isValidDate(currentDate)) {
      currentDate = new Date(currentDate);
    } else {
      continue;
    }

    if (!isValidDate(earliestDate)) {
      earliestDate = currentDate;
    } else if (currentDate < earliestDate) {
      earliestDate = currentDate;
    }

    if (!isValidDate(latestDate)) {
      latestDate = currentDate;
    } else if (currentDate > latestDate) {
      latestDate = currentDate;
    }
  }

  dates.earliest = earliestDate;
  dates.latest = latestDate;
  return dates;
}

function isValidDate(date) {
  if (date === '' || date === undefined || date === null) {
    return false;
  } else {
    return true;
  }
}

function differenceInDaysBetweenDates(startDate, endDate) {
  if (startDate !== '' && endDate !== '') {
    var timeDiff = Math.abs(endDate - startDate);
    var difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return difference;
  } else {
    return '';
  }
}
