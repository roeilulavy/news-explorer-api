const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { handleErrors } = require('./middleware/handleErrors');
const { mainRouter } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { limiter } = require('./helpers/limiter');

mongoose.connect('mongodb://localhost:27017/newsdb');

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

mongoose.connection.once('error', () => {
  console.error.bind(console, 'MongoDB Connection Error: ');// eslint-disable-line no-console
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');// eslint-disable-line no-console
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));// eslint-disable-line no-console
});
