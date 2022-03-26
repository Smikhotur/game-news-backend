const { Schema, model } = require('mongoose');

const CommentsSchema = new Schema({
  id_person: {type: String},
  id_game: {type: String},
  avatar: {type: String},
  date_left: {type: String},
  autor: {type: String},
  text: {type: String},
});

module.exports = model('comments', CommentsSchema);