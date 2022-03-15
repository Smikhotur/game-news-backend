const { Schema, model } = require('mongoose');

const BestSeriesGamesSchema = new Schema({
  name: {type: String},
  image: {type: String},
  releaseDate: {type: String},
  platforms: {type: String},
  website: {type: String},
  rating: {type: String},
});

module.exports = model('BestSeriesGames', BestSeriesGamesSchema);