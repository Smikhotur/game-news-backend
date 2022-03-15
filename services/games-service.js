const BestSeriesGames = require('../models/BestSeriesGames')

class GamesService {
  async getAllGames(params) {
    const games = await BestSeriesGames.find();
    console.log(games)
    return games.filter((game) => game.name.toLowerCase().includes(params.slice(1).toLowerCase()));
  }
}

module.exports = new GamesService();
