const { Schema, model, ObjectId } = require('mongoose');

const User = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  nikname: {type: String, required: true},
  lastName: {type: String, required: true},
  firstName: {type: String, required: true},
  avatar: {type: String},
  // files: [{type: ObjectId, ref: 'file'}],
  diskSpace: {type: Number, default: 1024**3*10},
  usedSpace: {type: Number, default: 0}
});

module.exports = model('User', User);
