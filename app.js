const express = require('express');
require('dotenv').config();

const app = express();

const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { NODE_ENV, PORT, ADDRESS } = process.env;
const { handleErrors } = require('./middleware/handleErrors');
const { mainRouter } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./helpers/limiter');

mongoose.connect(ADDRESS);

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
  app.listen(PORT);
} else {
  app.listen(3000, () => {
    console.log('MODE Production => Server is running on port 3000');// eslint-disable-line no-console
  });
}
