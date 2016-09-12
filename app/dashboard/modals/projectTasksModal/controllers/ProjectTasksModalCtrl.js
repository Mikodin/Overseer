app.controller('ProjectTasksModalCtrl', ProjectTasksModalCtrl);

ProjectTasksModalCtrl.inject = ['$uibModalInstance', '$uibModal', '$compile', '$scope',
  '$timeout', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', 'Project', 'data'];

function ProjectTasksModalCtrl($uibModalInstance, $uibModal, $compile, $scope,
    $timeout, $q, DTOptionsBuilder, DTColumnBuilder, Project, data) {
  var vm = this;

  /*
   * Public Methods
   */
  vm.closeModal = closeModal;
  vm.selectTask = selectTask;
  vm.newTask = newTask;

  /*
   * Public Variables
   */
  vm.modalInstance = $uibModalInstance;
  vm.dtProjectInstance = {};
  vm.users = data.users;
  vm.currentProject = data.currentProject;
  vm.statuses = data.statuses;

  var refreshDelay = 500;

  function closeModal(refreshData) {
    vm.modalInstance.close(refreshData);
  }

  function selectTask(taskId) {
    var taskObj = getTaskFromTasksArray(taskId, vm.currentProject.tasks);

    var modalInstance = $uibModal.open({
      templateUrl: 'dashboard/modals/editTaskModal/views/editTaskModal.html',
      controller: 'EditTaskModalCtrl',
      controllerAs: 'vm',
      resolve: {
        data: function() {
          return {
            task: taskObj,
            project: vm.currentProject,
            users: vm.users,
          };
        }
      }
    });

    modalInstance.result.then(function(refreshData) {
      if (refreshData) {
        $timeout(refreshTaskDataTable, refreshDelay);
      }
    });
  }

  function refreshTaskDataTable() {
    Project.getById(vm.currentProject.id)
      .then(function(response) {
        vm.currentProject = response;
        vm.dtProjectInstance.changeData(getProjectTableData);
      });
  }

  function getTaskFromTasksArray(taskId, tasks) {
    for (var i = 0; i < tasks.length; i++) {
      if (taskId === tasks[i]._id) {
        return tasks[i];
      }
    }
  }

  function newTask() {
    var modalInstance = $uibModal.open({
      templateUrl: 'dashboard/modals/newTaskModal/views/newTaskModal.html',
      controller: 'NewTaskModalCtrl',
      controllerAs: 'vm',
      resolve: {
        data: function() {
          return {
            project: vm.currentProject,
            users: vm.users,
          };
        }
      }
    });
    modalInstance.result.then(function(refreshData) {
      if (refreshData) {
        $timeout(refreshTaskDataTable, refreshDelay);
      }
    });
  }

  vm.dtProjectOptions = DTOptionsBuilder.fromFnPromise(function() {
    return getProjectTableData();
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
      }, {
        type: 'none'
      }]
    });

  vm.projectCols = [
    DTColumnBuilder.newColumn('assignee').withTitle('Assigned To'),
    DTColumnBuilder.newColumn('name').withTitle('Name'),
    DTColumnBuilder.newColumn('status.name').withTitle('Status'),
    DTColumnBuilder.newColumn('dueDate').withTitle('Due Date'),
    DTColumnBuilder.newColumn('effort').withTitle('Effort'),
    DTColumnBuilder.newColumn('description').withTitle('Description'),
    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(editTaskBtnHTML),
  ];

  function getProjectTableData() {
    var deferred = $q.defer();
    vm.currentProject.tasks = getStatusForTasks(vm.currentProject.tasks);
    deferred.resolve(vm.currentProject.tasks);
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
}
