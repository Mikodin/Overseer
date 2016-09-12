var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
  fixedSizeShortDescription: Boolean,
  name: String,
  showUserPictures: Boolean,
  tasks: [{
    assignee: String,
    boardId: Schema.ObjectId,
    classOfService: Schema.ObjectId,
    description: String,
    dueDate: String,
    name: String,
    order: String,
    projectId: Schema.ObjectId,
    taskTags: [String],
    ticketId: String,
    version: Number,
    workflowitem: Schema.ObjectId
  }],
  version: Number,
  workfloVerticalSizing: Number,
  workflow: {
    workflowitems: [{
      itemType: String,
      name: String,
      nestedWorkflow: {
        workflowitems: [{}]
      },
      version: Number,
      verticalSize: Number,
      wipLimit: Number,
    }]
  },
});

var Board = mongoose.model('Board', BoardSchema);
module.exports = Board;
