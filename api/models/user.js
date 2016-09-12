var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: String,
  name: String,
  password: String,
  realName: String,
  pictureUrl: String,
  salt: String,
  version: Number,
  permissions: [{_id: Number, params: [{value: String}]}],
  unloggedFakeUser: Boolean
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
