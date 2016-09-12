var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusSchema = new Schema({
  _id: Schema.ObjectId,
  name: String,
  description: String,
  colour: String,
  version: Number
},
{
  collection: 'classesOfService'
});

var Status = mongoose.model('Status', StatusSchema);
module.exports = Status;
