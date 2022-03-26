const { Schema, model } = require('mongoose');

const Details_gameSchema = new Schema({
  id: {type: String},
  description: {type: String},
  genre: {type: String},
  minimum_system_requirements: {type: Array},
  release_date: {type: String},
  screenshots: {type: Array},
  thumbnail: {type: String},
  title: {type: String},
  video_url: {type: String}
});

module.exports = model('details_game', Details_gameSchema);
