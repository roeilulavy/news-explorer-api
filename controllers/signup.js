const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { ConflictError, BadRequestError } = require('../utils/errorHandler');

const { SALT_ROUNDS } = process.env;

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      next(new BadRequestError('Invalid info was provided'));
      return;
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      next(new ConflictError('User already exist'));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (hashedPassword) {
      const newUser = await User.create({
        name, email, password: hashedPassword,
      });

      if (newUser) {
        res.status(201).send({ name, email });
      } else {
        throw new Error();
      }
    } else {
      throw new Error();
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid info was provided'));
      return;
    }
    next(err);
  }
};

module.exports = { signUp };
