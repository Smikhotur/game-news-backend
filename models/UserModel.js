const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  lastName: {type: String, required: true},
  firstName: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String},
  avatar: {type: String},
  diskSpace: {type: Number, default: 1024**3*10},
  usedSpace: {type: Number, default: 0}
});

module.exports = model('User', UserSchema);
