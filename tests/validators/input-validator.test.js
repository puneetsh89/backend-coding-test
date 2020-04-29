const chai = require('chai');
const inputValidator = require('../../src/validators/input-validator');

const { assert } = chai;

describe('inputValidator', () => {
  describe('rideValidator', () => {
    const testCases = [
      {
        payLoad: {
          startLat: -91,
          startLong: 70,
          endLat: 80,
          endLong: 60,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'start lat is -91',
      },
      {
        payLoad: {
          startLat: 91,
          startLong: 70,
          endLat: 80,
          endLong: 60,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'start lat is 91',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 181,
          endLat: 80,
          endLong: 60,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'start long is 181',
      },
      {
        payLoad: {
          startLat: 85,
          startLong: -181,
          endLat: 80,
          endLong: 60,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'start long is -181',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: -91,
          endLong: 60,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'end lat is -91',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 91,
          endLong: 60,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'end lat is 91',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: -90,
          endLong: 181,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'end long is 181',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -181,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message:
          'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        name: 'end long is -181',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -151,
          driverName: 'ron',
          driverVehicle: 'car',
        },
        message: 'Rider name must be a non empty string',
        name: 'Rider name is null',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -151,
          driverName: 'ron',
          driverVehicle: 'car',
          riderName: '',
        },
        message: 'Rider name must be a non empty string',
        name: 'Rider name is empty',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -151,
          riderName: 'john',
          driverVehicle: 'car',
        },
        message: 'Driver name must be a non empty string',
        name: 'Driver name is null',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -151,
          riderName: 'john',
          driverVehicle: 'car',
          driverName: '',
        },
        message: 'Driver name must be a non empty string',
        name: 'Driver name is empty',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -151,
          riderName: 'john',
          driverName: 'ron',
        },
        message: 'Driver vehicle must be a non empty string',
        name: 'Driver vehicle is null',
      },
      {
        payLoad: {
          startLat: 80,
          startLong: 150,
          endLat: 90,
          endLong: -151,
          riderName: 'john',
          driverName: 'ron',
          driverVehicle: '',
        },
        message: 'Driver vehicle must be a non empty string',
        name: 'Driver vehicle is empty',
      },
    ];
    testCases.forEach((testCase) => {
      it(testCase.name, (done) => {
        try {
          inputValidator.rideValidator(testCase.payLoad);
          assert.fail();
        } catch (ex) {
          assert.equal(ex.message, testCase.message);
        }
        done();
      });
    });
  });
});
