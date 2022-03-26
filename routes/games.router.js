const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/games-controller');

router.get('/best-series/:nameGame', GamesController.getGames);
router.get('/details/:id', GamesController.getGameDetails);
router.post('/comment', GamesController.addComment);

module.exports = router;