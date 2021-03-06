const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/games-controller');

router.get('/best-series/:nameGame', GamesController.getGames);
router.get('/details/:id', GamesController.getGameDetails);
router.get('/comments/:id_game/:count', GamesController.getComments);
router.post('/add-to-comment', GamesController.addComment);
router.post('/star-game', GamesController.addStar);
router.get('/stars/:id_user/:id_game', GamesController.getStars);

module.exports = router;