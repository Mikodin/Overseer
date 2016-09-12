app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.inject = ['$compile', '$document', '$uibModal', '$scope', '$state', '$timeout', '$http',
  '$q', 'Board', 'Project', 'Status', 'User', 'DTOptionsBuilder', 'DTColumnBuilder'];

function DashboardCtrl($compile, $document, $uibModal, $scope, $state, $timeout, $http,
    $q, Board, Project, User, Status, DTOptionsBuilder, DTColumnBuilder) {

  var vm = this;

  /*
   * Public Methods
   */
  vm.selectBoard = selectBoard;
  vm.selectUserProjects = selectUserProjects;
  vm.openProjectTasksModal = openProjectTasksModal;
  vm.openUserTasksModal = openUserTasksModal;

  /*
   * Public variables
   */
  vm.boards = [{}];
  vm.users = [{}];
  vm.currentBoard = {};
  vm.currentUser = '';

  User.getAll()
    .then(function(response) {
      vm.users = response;
    });

  Status.getAll()
    .then(function(response) {
      vm.statuses = response;
    });

  function openUserTasksModal(userId) {
    var modalInstance = $uibModal.open({
      templateUrl: 'dashboard/modals/userTasksModal/views/userTasksModal.html',

      controller: 'UserTasksModalCtrl',
      controllerAs: 'vm',
      windowClass: 'dtModal',
      resolve: {
        data: function() {
          return {
            userId: userId,
            users: vm.users,
            statuses: vm.statuses,
          };
        }
      }
    });
    modalInstance.result.then(function(refreshData) {
    });
  }

  function openProjectTasksModal(projId) {
    Project.getById(projId)
      .then(function(response) {
        var project = response;
        var modalInstance = $uibModal.open({
          templateUrl: 'dashboard/modals/projectTasksModal/views/projectTasksModal.html',

          controller: 'ProjectTasksModalCtrl',
          controllerAs: 'vm',
          windowClass: 'dtModal',
          resolve: {
            data: function() {
              return {
                currentProject: project,
                users: vm.users,
                statuses: vm.statuses,
              };
            }
          }
        });
        modalInstance.result.then(function(refreshData) {
        });
      });
  }

  function selectBoard(boardId) {
    var deferred = $q.defer();
    vm.currentUser = '';

    Board.getById(boardId)
      .then(function(response) {
        vm.currentBoard = response;

        Board.getProjects(boardId)
          .then(function(response) {
            var resetPaging = true;
            vm.currentBoard.projects = response;
            deferred.resolve(vm.currentBoard.projects);
          });
      });
    return deferred.promise;
  }

  function selectUserProjects(user) {
    vm.currentUser = user;
    vm.currentBoard = '';
    var deferred = $q.defer();

    User.getProjects(user._id)
      .then(function(response) {
        vm.currentBoard = response;
        vm.currentBoard.projects = response;
        deferred.resolve(vm.currentBoard.projects);
      });
    return deferred.promise;
  }

  /*
   * Board Datatable --------------------------------------------------------------------------------
   */
  vm.dtBoardOptions = DTOptionsBuilder.fromFnPromise(function() {
    return getBoardTableData();
  })
  .withOption('createdRow',createdRow)
    .withOption('scrollY', 550)
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
        type: 'number'
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

  /*
   * Dynamically fills the columns and row data
   * Each newColumn('var') refers to a propery in the object
   * The object is retrieved from the callback function getBoardTableData
   */
  vm.boardCols = [
    DTColumnBuilder.newColumn('name').withTitle('Project'),
    DTColumnBuilder.newColumn('tasks.length').withTitle('Tasks'),
    DTColumnBuilder.newColumn('startDateStr').withTitle('Start Date'),
    DTColumnBuilder.newColumn('endDateStr').withTitle('End Date'),
    DTColumnBuilder.newColumn('effort').withTitle('Effort'),
    DTColumnBuilder.newColumn('teamString').withTitle('Team'),
    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(detailsButtonHTML),
  ];

  vm.dtBoardInstance = {};

  function getBoardTableData() {
    var deferred = $q.defer();
    Board.getAll()
      .then(function(response) {
        vm.boards = response;
        vm.boards.sort(function(a, b) {
          var nameA = a.name;
          var nameB = b.name;

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        });

        vm.currentBoard = vm.boards[0];

        Board.getProjects(vm.currentBoard._id)
          .then(function(response) {
            vm.currentBoard.projects = response;
            deferred.resolve(vm.currentBoard.projects);
          });
      });
    return deferred.promise;
  }

  function detailsButtonHTML(data) {
    return '<button type="button" class="btn btn-raised btn-default btn-sm" ng-click="vm.openProjectTasksModal(' +
      '\'' + data.id + '\'' + ')">View Tasks <i class="fa fa-arrow-circle-right"</i> </button>';

  }

  function createdRow(row, data, dataIndex) {
    $compile(angular.element(row).contents())($scope);
  }

  // END Board Datatable ---------------------------------------------------------------------------

  vm.scrollBarConfig = {
    autoHideScrollbar: false,
    theme: 'dark',
    axis: 'y',
    advanced: {
      updateOnContentResize: true
    },
    setHeight: 600,
    scrollInertia: 400,
  };

}
