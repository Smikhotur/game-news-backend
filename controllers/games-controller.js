const gamesService = require('../services/games-service');

class GamesController {
  async getGames(req, res, next) {
    console.log('hello from game')
    try {
      const params = req.params.nameGame
      const games = await gamesService.getAllGames(params);
      return res.json(games);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new GamesController();
