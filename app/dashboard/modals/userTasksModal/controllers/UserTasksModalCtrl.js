app.controller('UserTasksModalCtrl', UserTasksModalCtrl);

UserTasksModalCtrl.inject = ['$uibModalInstance', '$uibModal', '$compile', '$scope',
  '$timeout', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', 'User', 'data'];

function UserTasksModalCtrl($uibModalInstance, $uibModal, $compile, $scope,
    $timeout, $q, DTOptionsBuilder, DTColumnBuilder, User, data) {
  var vm = this;

  /*
   * Public Variables
   */
  vm.userId = data.userId;
  vm.currentUser = {};
  vm.modalInstance = $uibModalInstance;
  vm.dtUserTasksInstance = {};
  vm.statuses = data.statuses;

  /*
   * Public Methods
   */
  vm.closeModal = closeModal;

  getUserData();

  function getUserData() {
    User.getById(vm.userId)
      .then(function(response) {
        vm.currentUser = response;
      });
    User.getProjects(vm.userId)
      .then(function(response) {
        vm.currentUser.projects = response;
      });

    User.getExtras(vm.userId)
      .then(function(response) {
        vm.currentUser.extras = response;
      });
  }

  function closeModal(refreshData) {
    vm.modalInstance.close(refreshData);
  }

  // Begin Datatable ---------------------------------------------------------------------------
  vm.dtUserTasksOptions = DTOptionsBuilder.fromFnPromise(function() {
    return getCurrentUserTasks(vm.userId);
  })
  .withOption('createdRow',createdRow)
    .withOption('scrollY', 400)
    .withOption('scroller', true)
    .withOption('pageLength', 100)
    .withDOM('rtip')
    .withColumnFilter({
      sPlaceHolder: 'head:after',
      aoColumns: [{
        type: 'text',
        bRegex: true,
        bSmart: true
      }, {
        type: 'text',
        bRegex: true,
        bSmart: true
      }, {
        type: 'text',
        bRegex: true,
        bSmart: true
      }, {
        type: 'text',
        bRegex: true,
        bSmart: true
      }, {
        type: 'text',
        bRegex: true,
        bSmart: true
      }, {
        type: 'text',
        bRegex: true,
        bSmart: true
      }]
    });

  /*
   * Dynamically fills the columns and row data
   * Each newColumn('var') refers to a propery in the object
   * The object is retrieved from the callback function getBoardTableData
   */
  vm.userTasksCols = [
    DTColumnBuilder.newColumn('assignee').withTitle('Assigned To'),
    DTColumnBuilder.newColumn('name').withTitle('Name'),
    DTColumnBuilder.newColumn('status.name').withTitle('Status'),
    DTColumnBuilder.newColumn('dueDate').withTitle('Due Date'),
    DTColumnBuilder.newColumn('effort').withTitle('Effort'),
    DTColumnBuilder.newColumn('description').withTitle('Description'),
  ];

  vm.dtUserTasksInstance = '';

  /**
   * getUserTasksTableData
   * Callback function for the datatable to fetch current project task data from a promise
   *
   * Sets vm.currentProject
   *
   * @returns {Promise}
   */
  function getCurrentUserTasks() {
    var deferred = $q.defer();
    User.getTasks(vm.userId)
      .then(function(response) {
        vm.currentUser.tasks = response;
        vm.currentUser.tasks = getStatusForTasks(vm.currentUser.tasks);
        deferred.resolve(response);
      });

    return deferred.promise;
  }

  function getStatusForTasks(tasks) {
    for (var i = 0; i < tasks.length; i++) {
      tasks[i].status = getStatusObjFromId(tasks[i]);
    }
    return tasks;
  }

  function getStatusObjFromId(task) {
    for (var i = 0; i < vm.statuses.length; i++) {
      if (task.classOfService !== null && task.classOfService !== undefined) {
        if (task.classOfService === vm.statuses[i]._id ||
            task.classOfService === vm.statuses[i].id) {

          return vm.statuses[i];
        }
      } else {
        return {name: '--',};
      }
    }
  }

  function editTaskBtnHTML(data) {
    return '<button type="button" class="btn btn-raised btn-default btn-sm" ng-click="vm.selectTask(' +
      '\'' + data._id + '\'' + ')">Edit <i class="fa fa-pencil-square-o"</i></button>';
  }

  function createdRow(row, data, dataIndex) {
    $compile(angular.element(row).contents())($scope);
  }
  // End Datatable ---------------------------------------------------------------------------

  vm.userProjectScrollBarConfig = {
    autoHideScrollbar: false,
    theme: 'dark',
    axis: 'y',
    advanced: {
      updateOnContentResize: true
    },
    setHeight: 100,
    scrollInertia: 400,
  };

}
