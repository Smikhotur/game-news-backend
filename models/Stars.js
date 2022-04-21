const { Schema, model } = require('mongoose');

const Stars = new Schema({
  id_user: { type: String },
  id_game: { type: String },
  rating: { type: Number }
});

module.exports = model('stars', Stars); 