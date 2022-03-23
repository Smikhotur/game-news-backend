const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');
// const passport = require('passport');

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddleware, UserController.getUsers);
// router.get('/google', passport.authenticate('google', {  scope: ['profile'] }));
// router.get('/google/callback', passport.authenticate('google', {
//   successRedirect: process.env.CLIENT_URL,
//   failureRedirect: '/login'
// }));

module.exports = router;
