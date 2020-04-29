const rideRepo = require('../repositories/ride-repo');

/**
 * getRides
 * @param {number} offset
 * @param {number} limit
 * @return {Array} rides
 */
async function getRides(offset, limit) {
  return rideRepo.getRides(offset, limit);
}
/**
 * get Rides by id
 * @param {number} rideId
 * @return {object} ride
 */
async function getRideById(rideId) {
  return rideRepo.getRideById(rideId);
}
/**
 * create ride
 * @param {object} ride input
 * @return {object} new ride
 */
async function createRide(ride) {
  return rideRepo.createRide(ride);
}

module.exports = {
  getRides,
  getRideById,
  createRide,
};
