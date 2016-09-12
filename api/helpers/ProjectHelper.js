/*
 * Publicly available functions
 */
module.exports = {
  constructProjects: constructProjects,
  getProjectById: getProjectById,
  getAllProjects: getAllProjects,
};

var mongoose = require('mongoose');
var Q = require('q');

/*
 * 'Import' our services'
 */
var projectService = require('api/services/ProjectService.js');
var boardService = require('api/services/BoardService.js');
var userService = require('api/services/UserService.js');
var statusService = require('api/services/StatusService.js');
var ProjectModel = require('api/models/project.js');
var taskHelper = require('api/helpers/TaskHelper.js');

/**
 * constructProjects
 *
 * Gets passed a boardId and constructs projects from an entire Board
 * These project objects do not get stored in the DB and therefore are not persistent.
 * This is NOT optimal and NOT efficient. But without changing the exisiting kanbanikDB, it is a necessity
 *
 * This method calls several other methods that go through an entire board object and parse out the project
 * The ProjectObject 'schema' can be found at the bottom.
 *
 * @param {String} boardId
 * @returns {Promise}
 * When resolved, it returns all the project objects that are found on a board
 */
function constructProjects(boardId) {
  var deferred = Q.defer();
  var projects = [];
  var projectIds = [];
  /*
   * Retrieve all the projectId's on the board
   */
  getProjectIdsOnBoard(boardId)
    .then(function(response) {
      projectsInDb = response;
      projects = parseProjects(projectsInDb);
      /*
       * Retrieve the entire board
       * Parse Tasks, create Start Date, End date, and effort
       */
      boardService.getById(boardId)
        .then(function(response) {
          var board = response;
          var tasks = board.tasks;
          projects = parseWorkflow(projects,board.workflow.workflowitems);
          projects = parseTasks(projects, tasks);
          // projects = constructTasks(projects);
          projects = parseDates(projects);

          parseTeam(projects)
            .then(function(response) {
              projects = response;
              /*
               * Resolve the promise to construct all the projects :)
               */
              deferred.resolve(projects);
            })
        .catch(function(response) {
          console.log(response);
        });
        })
      .catch(function(response) {
        deferred.resolve();
        console.log(response);
      });
    })
  .catch(function(response) {
    deferred.resolve();
    console.log(response);
  });

  return deferred.promise;
}

/**
 * parseProjects
 *
 * Receives the Projects stored in KanbanikDB which consist of the _id, name, and boardIds.
 * Begins creating an array of the new ProjectObject, getting the _id, name and boardIds.
 *
 * @param {Object} DBprojects
 * @returns {Array}
 */
function parseProjects(DBprojects) {
  var allProjects = [];

  DBprojects.forEach(function(project) {
    var tmp = new ProjectObj();
    tmp.id = project._id;
    tmp.name = project.name;
    tmp.boardIds = project.boards;
    allProjects.push(tmp);
  });
  return allProjects;
}

/**
 * parseWorkflow
 *
 * Adds the workflow contained in the board to the project object
 *
 * @param {Array} projects
 * @param {Array} workflow
 * @returns {Array}
 */
function parseWorkflow(projects, workflow) {
  var allProjects = [];

  projects.forEach(function(project) {
    project.workflow = workflow;
    allProjects.push(project);
  });
  return allProjects;
}

/**
 * parseTasks
 *
 * TODO Fix issue with boardId being assigned if a task is on 2 boards but has no tasks on one
 *
 * Goes through each task on the board and checks it's projectId to the id of the projectObject
 * If the check is true, stores that task into that project object
 *
 * @param {Object} projects
 * @param {Array} tasks
 * @returns {Array}
 */
function parseTasks(projects, tasks) {
  var allProjects = [];

  projects.forEach(function(project) {
    tasks.forEach(function(task) {
      if (project.id.toString() === task.projectId.toString()) {
        project.tasks.push(task);
      }
    });
    if (project.tasks.length > 0) {
      project.onBoard = project.tasks[0].boardId;
    }
    allProjects.push(project);
  });
  return allProjects;
}

function constructTasks(projects) {
  var deferred = Q.defer();
  var allProjects = [];
  var constructedTaskPromises = [];

  for (var i = 0; i < projects.length; i++) {
    constructedTaskPromises.push(taskHelper.constructTask(projects[i].tasks));
  }

  Q.all(constructedTaskPromises)
    .then(function(response) {
      for (var i = 0; i < allProjects.length; i++) {
        allProjects[i].tasks = response[i];
      }
      deferred.resolve(allProjects);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}

/**
 * TODO Dates are off by 1 day!  No bueno but Date Strings are on point?
 * parseDates
 *
 * @param {Array} projects
 * @returns {Array}
 */
function parseDates(projects) {
  var allProjects = [];
  for (var i = 0; i < projects.length; i++) {
    var tmpProj = projects[i];

    if (tmpProj.tasks !== undefined || tmpProj.tasks.length > 0) {
      for (var j = 0; j < tmpProj.tasks.length; j++) {
        if (tmpProj.tasks[j].dueDate === undefined || tmpProj.tasks[j].dueDate === '') {
          continue;
        }

        var tmpDate = new Date(tmpProj.tasks[j].dueDate);

        if (tmpProj.startDate === '' && tmpProj.endDate === '') {
          tmpProj.startDate = new Date(tmpProj.tasks[j].dueDate);
          tmpProj.endDate = new Date(tmpProj.tasks[j].dueDate);
        }
        if (tmpDate < tmpProj.startDate) {
          tmpProj.startDate = tmpDate;
        }
        if (tmpDate > tmpProj.endDate) {
          tmpProj.endDate = tmpDate;
        }
      }
    }

    if (tmpProj.startdate !== '' && tmpProj.endDate !== '') {
      tmpProj.startDateStr = formatDateStr(tmpProj.startDate);
      tmpProj.endDateStr = formatDateStr(tmpProj.endDate);
    }
    tmpProj.effort = calcEffort(tmpProj.startDate, tmpProj.endDate);
    allProjects.push(tmpProj);
  }
  return allProjects;
}

/**
 * calcEffort
 * Subtracts the two Date objects and returns the difference in days
 *
 * @param {Date} startDate
 * @param {Date} endDate
 */
function calcEffort(startDate, endDate) {
  if (startDate !== '' && endDate !== '') {
    var timeDiff = Math.abs(endDate - startDate);
    var effort = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return effort;
  } else {
    return '--';
  }
}

/**
 * formatDateStr
 * Formats the date object and returns a string in the desired format mm/dd/yyyy
 *
 * @param {Date} date
 * @returns {String}
 */
function formatDateStr(date) {
  var monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];

  if (date !== '') {
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ' ' +  year;
  } else {
    return '--';
  }
}

/**
 * parseTeam
 *
 * Constructs a team based on who is assigned to each task in the project.
 * Since tasks only have assignee usernames, it takes these usernames and
 * Finds that user in the database by that username.
 *
 * @param {Array} projects
 * @returns {Array}
 */
function parseTeam(projects) {
  var deferred = Q.defer();
  var allProjects = [];

  projects.forEach(function(project) {
    var tasks = project.tasks;
    var team = [];

    tasks.forEach(function(task) {
      if ((task.assignee !== null) && !containsString(team, task.assignee)) {
        team.push(task.assignee);
      }
    });
    project.team = team;
    project.teamString = team.sort().toString();
    allProjects.push(project);
  });

  var allProjectTeamPromises = [];

  for (var i = 0; i < allProjects.length; i++) {
    allProjectTeamPromises.push(userService.getAllById(allProjects[i].team));
  }

  Q.all(allProjectTeamPromises)
    .then(function(response) {
      for (var i = 0; i < allProjects.length; i++) {
        allProjects[i].team = response[i];
      }
      deferred.resolve(allProjects);
    })
  .catch(function(response) {
    deferred.resolve();
  });
  return deferred.promise;
}

/**
 * containsString
 *
 * Checks to see if a userId is already in the team.
 * Cannot use method in prototype
 *
 * @param {Array} array
 * @param {String} userId
 * @returns {Boolean}
 */
function containsString(array, userId) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === userId) {
      return true;
    }
  }
  return false;
}

/**
 * getProjectById
 *
 * Retrieves a constructed ProjectObject by the id given
 *
 * @param {Number}projectId
 * @returns {Promise}
 * Promise may resolve to an {Array} if the project is found on multiple boards
 * Else resolves as an {Object}
 */
function getProjectById(projectId) {
  var allProjects = [];
  var selectedProjects = [];
  var deferred = Q.defer();

  getAllProjects()
    .then(function(response) {
      allProjects = response;
      for (var i = 0; i < allProjects.length; i++) {
        if (allProjects[i].id.toString() === projectId.toString()) {
          if (allProjects[i].boardIds.length > 1) {
            selectedProjects.push(allProjects[i]);
          } else {
            deferred.resolve(allProjects[i]);
            break;
          }
        }
      }
      if (selectedProjects.length >= 1) {
        deferred.resolve(selectedProjects);
      }
    })
  .catch(function(response) {
    deferred.resolve();
    console.log(response);
  });
  return deferred.promise;
}

function containsProject(projects, projectId) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i] === projectId) {
      return projects[i];
    }
  }
  return false;
}

/**
 * getAllProjects
 *
 * Gets all the boards and constructs the projects from them
 *
 * @returns {Promise}
 * resolves to an {Array}
 */
function getAllProjects() {
  var deferred = Q.defer();
  var allProjects = [];
  var allProjectPromises = [];

  boardService.getAll()
    .then(function(response) {
      var boards = response;
      for (var i = 0; i < boards.length; i++) {
        allProjectPromises.push(constructProjects(boards[i]._id));
      }

      Q.all(allProjectPromises)
        .then(function(response) {
          var tmp = response;
          // Flatten the array
          for (var i = 0; i < tmp.length; i++) {
            for (var j = 0; j < tmp[i].length; j++) {
              allProjects.push(tmp[i][j]);
            }
          }
          deferred.resolve(allProjects);
        })
      .catch(function(response) {
        deferred.resolve();
      });

    })
  .catch(function(response) {
    console.log(response);
  });
  return deferred.promise;
}

/**
 * getProjectIdsOnBoard
 * HELPER function
 *
 * Fetches the IDs of projects that are one the specified board
 *
 * @param {Number} boardId
 * @returns {Promise}
 */
function getProjectIdsOnBoard(boardId) {
  var deferred = Q.defer();
  ProjectModel.find({'boards': boardId}, function(err, docs) {
    if (err) {
      deferred.resolve();
    } else {
      deferred.resolve(docs);
    }
  });
  return deferred.promise;
}

function ProjectObj() {
  this.id = '';
  this.name = '';
  this.boardIds = [];
  this.onBoard = '';
  this.tasks = [];
  this.startDate = '';
  this.endDate = '';
  this.startDateStr = '';
  this.endDateStr = '';
  this.effort = 0;
  this.completion = 0;
  this.team = [];
  this.teamString = '';
  this.workflow = [];

  /**
   * containsUser
   *
   * Checks to see if a userId is already in the team.
   *
   * @param {String} userId
   * @returns {Boolean}
   */
  this.containsUser = function(userId) {
    for (var i = 0; i < this.team.length; i++) {
      if (this.team[i]._id === userId) {
        return true;
      }
    }
    return false;
  };
}
