const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const emailValidator = require('validator');
const { AuthorizationError } = require('../utils/errorHandler');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return emailValidator.isEmail(v);
      },
      message: 'The Email must be valid!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      return Promise.reject(new AuthorizationError('Incorrect email or password'));
    }

    const passwordVerification = await bcrypt.compare(password, user.password);

    if (!passwordVerification) {
      return Promise.reject(new AuthorizationError('Incorrect email or password'));
    }

    return user;
  } catch (err) {
    return Promise.reject(new AuthorizationError('Incorrect email or password'));
  }
};

module.exports = mongoose.model('user', userSchema);
