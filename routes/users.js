const usersRouter = require('express').Router();
const { getUserInfo } = require('../controllers/users');

usersRouter.get('/me', getUserInfo);

module.exports = { usersRouter };
