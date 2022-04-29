const express = require('express');
require('dotenv').config();

const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { NODE_ENV, PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/newsdb' } = process.env;
const { handleErrors } = require('./middleware/handleErrors');
const { mainRouter } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./helpers/limiter');

mongoose.connect(DB_ADDRESS);

app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

// routes
app.use('/', mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

if (NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);// eslint-disable-line no-console
  });
}
