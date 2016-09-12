var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  boards: [Schema.ObjectId],
  name: String,
  version: Number
});

var Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
