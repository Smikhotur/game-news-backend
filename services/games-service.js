const BestSeriesGames = require('../models/BestSeriesGames');
const CommentsSchema = require('../models/CommentsModel');
const Details_gameSchema = require('../models/DetailsGame');
const UserModel = require('../models/UserModel');
const moment = require('moment');
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

  async commentCheck({ id_person, id_game, text }) {
    const user = await UserModel.findOne({id_person});

    const comment = await CommentsSchema.create({
      id_person,
      id_game,
      avatar: user.avatar,
      date_left: moment().format('LL'),
      autor: user.lastName + " " + user.firstName,
      text
    });

    if (comment) {
      return comment;
    }
  }

  async findComments(params) {
    const comments = await (await CommentsSchema.find({"id_game": params.id_game.slice(1)})).reverse();

    if (comments) {
      return comments.slice(0, params.count.slice(1));
    }
  }
}

module.exports = new GamesService();
