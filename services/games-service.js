const BestSeriesGames = require('../models/BestSeriesGames')
const CommentsSchema = require('../models/CommentsModel')
const Details_gameSchema = require('../models/DetailsGame')

class GamesService {
  async getAllGames(params) {
    const games = await BestSeriesGames.find();
    console.log(games)
    return games.filter((game) => game.name.toLowerCase().includes(params.slice(1).toLowerCase()));
  }

  async findGames(params) {
    const detailGame = await Details_gameSchema.find({"id": params.slice(1)});
    return detailGame
  }

  async commentCheck({ id_person, id_game, avatar, date_left, autor, text }) {
    const comment = await CommentsSchema.create({
      id_person,
      id_game,
      avatar,
      date_left,
      autor,
      text
    });

    console.log(comment);

    if (comment) {
      return { "status": "Comment was add" }
    }
  }
}

module.exports = new GamesService();
