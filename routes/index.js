const mainRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { usersRouter } = require('./users');
const { articlesRouter } = require('./articles');
const { signUp } = require('../controllers/signup');
const { signIn } = require('../controllers/signin');
const { auth } = require('../middleware/auth');
const { NotFoundError } = require('../utils/errorHandler');

mainRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), signUp);

mainRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), signIn);

mainRouter.use('/users', auth, usersRouter);
mainRouter.use('/articles', auth, articlesRouter);

mainRouter.get('/*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = { mainRouter };
