const { getToken } = require('../utils/jwt');
const User = require('../models/user');
const {
  BadRequestError, AuthorizationError,
} = require('../utils/errorHandler');

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!password || !email) {
      next(new BadRequestError('Invalid info was provided'));
      return;
    }

    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = await getToken(user._id);

      res.status(200).send(token);
    } else {
      next(new AuthorizationError('Invalid Email or Password'));
      return;
    }
  } catch (e) {
    next(new AuthorizationError('Invalid Email or Password'));
  }
};
module.exports = { signIn };
