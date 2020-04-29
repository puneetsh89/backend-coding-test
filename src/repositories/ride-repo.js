const db = require('../utilities/db-util');
const AppError = require('../errors/app-error');
const NotFoundError = require('../errors/not-found-error');
const logger = require('../utilities/logger');

/**
 * get rides, pagination
 * @param {number} offset default value is 0
 * @param {number} limit default value is 10
 * @returns {Array} list of rides
 */
async function getRides(offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM Rides LIMIT ? offset ?',
      [limit, offset],
      (err, rows) => {
        if (err) {
          logger.error(`Error while fetching record from db ${err.message}`);
          reject(new AppError('Internal server error', 'SERVER_ERROR'));
        }
        if (rows.length === 0) {
          logger.error(`data not found in db`);
          reject(new NotFoundError('Could not find any rides'));
        } else {
          resolve(rows);
        }
      },
    );
  });
}

/**
 * get ride by id
 * @param {number} rideId
 * @returns {object} ride detail
 */
async function getRideById(rideId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Rides where rideId = ?', [rideId], (err, rows) => {
      if (err) {
        logger.error(`Error while fetching record from db ${err.message}`);
        reject(new AppError('Internal server error', 'SERVER_ERROR'));
      }
      if (rows.length === 0) {
        logger.error(`data not found in db`);
        reject(new NotFoundError('Could not find any rides'));
      } else {
        resolve(rows[0]);
      }
    });
  });
}

/**
 * get ride by id
 * @param {object} rideId
 * @returns {object} ride detail
 */
function createRide(ride) {
  const values = [
    ride.startLat,
    ride.startLong,
    ride.endLat,
    ride.endLong,
    ride.riderName,
    ride.driverName,
    ride.driverVehicle,
  ];
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      function (err) {
        if (err) {
          logger.error(`Error while inserting record in db ${err.message}`);
          reject(new AppError('Internal server error', 'SERVER_ERROR'));
          return;
        }
        getRideById(this.lastID).then((result) => {
          resolve(result);
        });
      },
    );
  });
}

module.exports = {
  getRides,
  getRideById,
  createRide,
};
