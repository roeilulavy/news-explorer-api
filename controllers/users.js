const User = require('../models/user');
const { NotFoundError, BadRequestError } = require('../utils/errorHandler');

const getUserInfo = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    if (user) {
      res.status(200).send(user);
    } else if (user === null) {
      next(new NotFoundError('User not found!'));
      return;
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError('Invalid data provided!'));
      return;
    }
    next(e);
  }
};

module.exports = { getUserInfo };
