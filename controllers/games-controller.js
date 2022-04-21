const Stars = require('../models/Stars');
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

  async getComments(req, res, next) {
    try {
      const params = req.params
      const comments = await gamesService.findComments(params);
      return res.json(comments);
    } catch (error) {
      next(error)
    }
  }

  async addStar(req, res, next) {
    try {
      const stars = new Stars(req.body);
      const savedStars = await stars.save();
      await gamesService.searchGame(req.body);
      res.status(200).json(savedStars);
    } catch (error) {
      next(error)
    }
  }

  async getStars(req, res, next) {
    try {
      const params = req.params
      const stars = await gamesService.findStars(params);
      return res.json(stars);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new GamesController();
