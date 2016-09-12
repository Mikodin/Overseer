app.controller('EditTaskModalCtrl', EditTaskModalCtrl);

EditTaskModalCtrl.inject = ['$uibModalInstance', 'data', 'Task'];

function EditTaskModalCtrl($uibModalInstance, data, Task) {
  var vm = this;

  /*
   * Public Methods
   */
  vm.editTask = editTask;
  vm.deleteTask = deleteTask;
  vm.closeModal = closeModal;
  vm.openDatePicker = openDatePicker;

  /*
   * Public Variables
   */
  vm.modalInstance = $uibModalInstance;
  vm.project = data.project;
  vm.users = data.users;
  vm.task = data.task;

  castTaskDataTypesForForm();

  function castTaskDataTypesForForm() {
    castPriorityToInt();
    castReminderInHoursToInt();
    castDueDateToDate();
    getUserObjFromAssigneeStr();

    function castPriorityToInt() {
      vm.task.priority = vm.task.priority === undefined ?
        0 : parseInt(vm.task.priority);
    }

    function castReminderInHoursToInt() {
      vm.task.reminderInHours = vm.task.reminderInHours === undefined ?
        0 : parseInt(vm.task.reminderInHours);
    }

    function castDueDateToDate() {
      if (vm.task.dueDate !== undefined && vm.task.dueDate !== '') {
        vm.task.dueDate = new Date(vm.task.dueDate);
      }
    }

    function getUserObjFromAssigneeStr() {
      for (var i = 0; i < vm.users.length; i++) {
        if (vm.task.assignee === vm.users[i]._id) {
          vm.task.assignee = vm.users[i];
        }
      }
    }
  }

  function editTask(task) {
    var kanbanikTask = Task.initKanbanikTask(task);

    Task.editTask(kanbanikTask);

    closeModal(true);
  }

  function deleteTask(task) {
    var kanbanikTask = Task.initKanbanikTask(task);

    kanbanikTask.prepareForDelete();
    Task.deleteTask(kanbanikTask);
    closeModal(true);
  }

  function closeModal(refreshData) {
    vm.task = data.task;
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
