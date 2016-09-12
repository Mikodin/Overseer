app.controller('NewTaskModalCtrl', NewTaskModalCtrl);

NewTaskModalCtrl.inject = ['$uibModalInstance', 'data', 'Task'];

function NewTaskModalCtrl($uibModalInstance, data, Task) {
  var vm = this;

  /*
   * Public Methods
   */
  vm.newTask = newTask;
  vm.closeModal = closeModal;
  vm.openDatePicker = openDatePicker;

  /*
   * Public Variables
   */
  vm.modalInstance = $uibModalInstance;
  vm.users = data.users;
  vm.project = data.project;
  vm.task = {};

  function newTask(task) {
    task.projectId = vm.project.id;
    task.boardId = vm.project.boardIds[0]; //TODO Will break if project is on 2 boards

    var kanbanikTask = Task.initKanbanikTask(task);
    Task.createTask(kanbanikTask);

    closeModal(true);
  }

  function closeModal(refreshData) {
    vm.modalInstance.close(refreshData);
  }

  function openDatePicker() {
    vm.datePickerPopup.opened = true;
  }

  vm.datePickerPopup = {
    opened: false
  };

  vm.datePickerOptions = {
    formatYear: 'yy',
    maxDate: new Date(2100, 1, 01),
    minDate: new Date(),
    startingDay: 1
  };

}
