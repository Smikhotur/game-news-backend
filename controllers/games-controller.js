const gamesService = require('../services/games-service');

class GamesController {
  async getGames(req, res, next) {
    try {
      const params = req.params.nameGame
      const games = await gamesService.getAllGames(params);
      return res.json(games);
    } catch (error) {
      next(error)
    }
  }

  async getGameDetails(req, res, next) {
    try {
      const params = req.params.id
      const games = await gamesService.findGames(params);
      return res.json(games);
    } catch (error) {
      next(error)
    }
  }

  async addComment(req, res, next) {
    try {
      const games = await gamesService.commentCheck(req.body);
      return res.json(games);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new GamesController();
