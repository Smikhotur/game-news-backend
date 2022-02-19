const express = require('express');
const { check } = require('express-validator');
const { registration, login, authMiddlewareControllers } = require('../controllers/authUser');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const fileMiddleware = require('../middleware/file.middleware');

router.post('/registration', fileMiddleware.single('avatar'), registration);
router.post('/login', login);
router.get('/auth', authMiddleware, authMiddlewareControllers);

module.exports = router;
