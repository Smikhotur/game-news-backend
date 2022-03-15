const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/games-controller');

router.get('/best-series/:nameGame', GamesController.getGames);

module.exports = router;