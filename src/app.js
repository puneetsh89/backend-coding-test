const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/rides');
const swaggerRouter = require('./routes/swagger-route');
const logger = require('./utilities/logger');

const app = express();

app.use(swaggerRouter);
app.use(morgan('combined', { stream: logger.stream }));
app.get('/health', (req, res) => res.send('Healthy'));
app.use('/rides', routes);

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.info(`Error handler: ${err.message} ${err.code} ${err.httpCode}`);
  if (err && err.httpCode) {
    res
      .status(err.httpCode)
      .json({ message: err.message, error_code: err.code });
  } else {
    res.status(500).send({ err: err.message });
  }
}

app.use(errorHandler);
module.exports = app;
