const logger = require('./src/utilities/logger');
const app = require('./src/app');

const port = 8010;

app.listen(port, () =>
  logger.info(`App started and listening on port ${port}`),
);
