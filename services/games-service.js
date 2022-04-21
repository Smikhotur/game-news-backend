const BestSeriesGames = require('../models/BestSeriesGames');
const CommentsSchema = require('../models/CommentsModel');
const Details_gameSchema = require('../models/DetailsGame');
const UserModel = require('../models/UserModel');
const Stars = require('../models/Stars');
const moment = require('moment');

class GamesService {
  async getAllGames(params) {
    const games = await BestSeriesGames.find();
    return games.filter((game) => game.name.toLowerCase().includes(params.slice(1).toLowerCase()));
  }

  async findGames(params) {
    const detailGame = await Details_gameSchema.find({"id": params.slice(1)});
    return detailGame
  }

  async commentCheck({ id_person, id_game, text }) {
    const user = await UserModel.findOne({"_id": id_person});

    const comment = await CommentsSchema.create({
      id_person,
      id_game,
      avatar: user.avatar,
      date_left: moment().format('lll'),
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

  async searchGame(body) {
    const game = await BestSeriesGames.find({"_id": body.id_game});
    const filter = { _id: body.id_game };
    const upDate = {
      rating: game[0].ratingSum ? +((game[0].ratingSum + body.rating) / (game[0].ratingNumber + 1)).toFixed(1) : body.rating, 
      ratingSum: game[0].ratingSum ? game[0].ratingSum + body.rating : body.rating,
      ratingNumber: game[0].ratingNumber ? game[0].ratingNumber + 1 : 1,
    }
    const addedStar = await BestSeriesGames.updateOne(filter, upDate);
    return addedStar
  }

  async findStars(params) {
    const stars = await (await Stars.find({
      "id_user": params.id_user,
      "id_game": params.id_game,
    }));
    return stars;
  }
}

module.exports = new GamesService();
