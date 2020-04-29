const BadRequest = require('../errors/bad-request');
/**
 * validate if lat long is in range
 * @param {number} lat
 * @param {number} long
 * @param {string} message
 * @returns {booleane} result
 * @throws {BadRequest}
 */
function isValidLatLong(lat, long, message) {
  if (
    Number.isNaN(lat) ||
    Number.isNaN(long) ||
    lat < -90 ||
    lat > 90 ||
    long < -180 ||
    long > 180
  ) {
    throw new BadRequest(message);
  }
  return true;
}
/**
 * validate if string is valid
 * @param {string} input
 * @param {string} message
 * @returns {booleane} result
 * @throws {BadRequest}
 */
function isValidString(input, message) {
  if (typeof input !== 'string' || input.length < 1) {
    throw new BadRequest(message);
  }
  return true;
}
/**
 * validate if number is valid
 * @param {string| number} input
 * @param {string} message
 * @returns {booleane} result
 * @throws {BadRequest}
 */
function isValidNumber(input) {
  if (Number.isNaN(input - 0)) {
    throw new BadRequest('Invalid input');
  }
  return true;
}
/**
 * validate ride input
 * @param {object} ride
 * @returns {booleane} result
 * @throws {BadRequest}
 */
function rideValidator(ride) {
  return (
    isValidString(
      ride.driverVehicle,
      'Driver vehicle must be a non empty string',
    ) &&
    isValidString(ride.driverName, 'Driver name must be a non empty string') &&
    isValidString(ride.riderName, 'Rider name must be a non empty string') &&
    isValidLatLong(
      ride.endLat,
      ride.endLong,
      'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    ) &&
    isValidLatLong(
      ride.startLat,
      ride.startLong,
      'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    )
  );
}

module.exports = {
  rideValidator,
  isValidNumber,
};
