app.service('KanbanikTask', KanbanikTaskService);

KanbanikTaskService.$inject = [];

function KanbanikTaskService() {
  this.id = '';
  this.name = '';
  this.ticketId = '4';
  this.workflowitemId = '';
  this.classOfService = '';
  this.version = 0;
  this.projectId = '';
  this.order = 1;
  this.stakeholder = '';
  this.milestone = false;
  this.effort = '';
  this.priority = '';
  this.reminderInHours = '';
  this.lastReminded = '';
  this.dueDate = '';
  this.boardId = '';
  this.taskTags = [];
  this.description = '';

  this.prepareForDelete = function() {
    delete(this.order);
    delete(this.stakeholder);
    delete(this.milestone);
    delete(this.effort);
    delete(this.priority);
    delete(this.reminderInHours);
    delete(this.lastReminded);
    delete(this.dueDate);
    delete(this.taskTags);
    delete(this.description);
  };

  this.init = function(task) {
    if (task._id !== undefined) {
      this.id = task._id;
    } else {
      delete(this.id);
    }
    this.name = task.name;
    this.boardId = task.boardId;
    this.projectId = task.projectId;
    this.workflowitemId = task.workflowitemId;
    this.projectId = task.projectId;
    this.classOfService = task.classOfService;
    this.milestone = task.milestone;
    this.description = task.description;

    this.assignee = createKanbanikAssignee(task.assignee);
    this.priority = checkIsDefinedConvertToString(task.priority);
    this.reminderInHours = checkIsDefinedConvertToString(task.reminderInHours);
    this.workflowitemId = determineWorkflow(task);
    this.ticketId = removePoundSign(task.ticketId);

    if (task.dueDate !== undefined && task.dueDate !== '') {
      this.effort = calcEffort(task.dueDate).toString();
      this.dueDate = dateToString(task.dueDate);
    }

    return this;
  };

  function createKanbanikAssignee(user) {
    if (user !== undefined && user !== null) {
      return new KanbanikAssignee().userToKanbanikAssignee(user);
    }
  }

  function KanbanikAssignee() {
    this.userName = '';
    this.realName = '';
    this.initialsName = '';
    this.myProjectsOnly = false;
    this.myTasksOnly = false;
    this.readOnly = false;
    this.projectFilter = '';
    this.pictureUrl = '';
    this.sessionId = '';
    this.version = 7;

    this.userToKanbanikAssignee = function(user) {
      this.userName = user._id;
      this.realName = user.realName;
      this.initialsName = user.initialsName;

      return this;
    };
  }

  function checkIsDefinedConvertToString(property) {
    if (property === null || property === undefined) {
      return '';
    } else {
      return property.toString();
    }
  }

  function determineWorkflow(task) {
    if (task.workflow.nestedWorkflow.workflowitems.length === 0) {
      return task.workflow._id;
    } else {
      return task.nestedWorkflow._id;
    }
  }

  function removePoundSign(ticketId) {
    if (ticketId !== undefined) {
      ticketId = ticketId[0] === '#' ?
        ticketId.substr(1,ticketId.length) : ticketId;
    }
    return ticketId;
  }

  function calcEffort(dueDate) {
    var startDate = new Date();

    if (dueDate !== undefined || dueDate !== '') {
      dueDate = new Date(dueDate);
      var timeDiff = Math.abs(dueDate - startDate);
      var effort = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return effort;
    } else {
      return '--';
    }
  }

  function dateToString(date) {
    if (date === undefined || date === null || isNaN(date.valueOf()) || date === '') {
      return '';
    } else {
      var dateStr = date.toJSON().split('-');
      return dateStr[0] + '-' + dateStr[1] + '-' + dateStr[2].split('T')[0];
    }
  }
}
