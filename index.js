const sqlite3 = require('sqlite3').verbose();
const logger = require('./src/utilities/logger');
const app = require('./src/app');

const port = 8010;
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
  buildSchemas(db);

  const server = app(db);

  server.listen(port, () =>
    logger.info(`App started and listening on port ${port}`),
  );
});
