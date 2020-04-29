const request = require('supertest');
const chai = require('chai');
const chaiExclude = require('chai-exclude');
const db = require('../src/utilities/db-util');
const app = require('../src/app');

const { expect } = chai;
chai.use(chaiExclude);

describe('API tests', () => {
  afterEach((done) => {
    db.run('delete from Rides');
    db.run(`delete from sqlite_sequence where name='Rides'`);
    done();
  });
  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });
  describe('POST /rides', () => {
    it('should return result', (done) => {
      const payload = {
        start_lat: -80,
        start_long: 70,
        end_lat: 80,
        end_long: 60,
        rider_name: 'john',
        driver_name: 'ron',
        driver_vehicle: 'car',
      };
      request(app)
        .post('/rides')
        .send(payload)
        .send({ name: 'john' })
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          expect(res.body)
            .excluding(['ride_id', 'created'])
            .to.deep.equals(payload);
        });
    });
    it('should return result, second record enter', (done) => {
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values(-85, 80, 70, 60, 'jeff', 'john', 'car')`,
      );
      const payload = {
        start_lat: -80,
        start_long: 70,
        end_lat: 80,
        end_long: 60,
        rider_name: 'john',
        driver_name: 'ron',
        driver_vehicle: 'car',
      };
      request(app)
        .post('/rides')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          expect(res.body)
            .excluding(['ride_id', 'created'])
            .to.deep.equals(payload);
          expect(res.body.ride_id).to.equals(2);
        });
    });
    describe('should return validation error', () => {
      const testCases = [
        {
          payLoad: {
            start_lat: -91,
            start_long: 70,
            end_lat: 80,
            end_long: 60,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'start lat is -91',
        },
        {
          payLoad: {
            start_lat: 91,
            start_long: 70,
            end_lat: 80,
            end_long: 60,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'start lat is 91',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 181,
            end_lat: 80,
            end_long: 60,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'start long is 181',
        },
        {
          payLoad: {
            start_lat: 85,
            start_long: -181,
            end_lat: 80,
            end_long: 60,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'start long is -181',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: -91,
            end_long: 60,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'end lat is -91',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 91,
            end_long: 60,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'end lat is 91',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: -90,
            end_long: 181,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'end long is 181',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -181,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message:
              'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
          },
          name: 'end long is -181',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -151,
            driver_name: 'ron',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          },
          name: 'Rider name is null',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -151,
            driver_name: 'ron',
            driver_vehicle: 'car',
            rider_name: '',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          },
          name: 'Rider name is empty',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -151,
            rider_name: 'john',
            driver_vehicle: 'car',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message: 'Driver name must be a non empty string',
          },
          name: 'Driver name is null',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -151,
            rider_name: 'john',
            driver_vehicle: 'car',
            driver_name: '',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message: 'Driver name must be a non empty string',
          },
          name: 'Driver name is empty',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -151,
            rider_name: 'john',
            driver_name: 'ron',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message: 'Driver vehicle must be a non empty string',
          },
          name: 'Driver vehicle is null',
        },
        {
          payLoad: {
            start_lat: 80,
            start_long: 150,
            end_lat: 90,
            end_long: -151,
            rider_name: 'john',
            driver_name: 'ron',
            driver_vehicle: '',
          },
          result: {
            error_code: 'VALIDATION_ERROR',
            message: 'Driver vehicle must be a non empty string',
          },
          name: 'Driver vehicle is empty',
        },
      ];
      testCases.forEach((testCase) => {
        it(testCase.name, (done) => {
          request(app)
            .post('/rides')
            .send(testCase.payLoad)
            .expect('Content-Type', /json/)
            .expect(400, done)
            .expect((res) => {
              expect(res.body).to.deep.equals(testCase.result);
            });
        });
      });
    });
  });
  describe('GET /rides', () => {
    it('should return 404 as no records in db', (done) => {
      request(app)
        .get('/rides')
        .send({ name: 'john' })
        .expect('Content-Type', /json/)
        .expect(404, done)
        .expect((res) => {
          expect(res.body).to.deep.equals({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          });
        });
    });
    it('should return 200 and 2 records', (done) => {
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values(-85, 80, 70, 60, 'jeff', 'john', 'car')`,
      );
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values(-85, 80, 70, 60, 'jin', 'jog', 'truck')`,
      );
      request(app)
        .get('/rides')
        .send({ name: 'john' })
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          expect(res.body.length).to.deep.equals(2);
          expect(res.body[0]).excluding(['created']).to.deep.equals({
            ride_id: 1,
            start_lat: -85,
            start_long: 80,
            end_lat: 70,
            end_long: 60,
            rider_name: 'jeff',
            driver_name: 'john',
            driver_vehicle: 'car',
          });
        });
    });
  });
  describe('GET /rides{id}', () => {
    it('should return 404 as no record in db', (done) => {
      request(app)
        .get('/rides/1')
        .send({ name: 'john' })
        .expect('Content-Type', /json/)
        .expect(404, done)
        .expect((res) => {
          expect(res.body).to.deep.equals({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          });
        });
    });
    it('should return 404 as id not found in db', (done) => {
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values(-85, 80, 70, 60, 'jeff', 'john', 'car')`,
      );
      request(app)
        .get('/rides/2')
        .send({ name: 'john' })
        .expect('Content-Type', /json/)
        .expect(404, done)
        .expect((res) => {
          expect(res.body).to.deep.equals({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          });
        });
    });
    it('should return 200 and records found in db', (done) => {
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values(-85, 80, 70, 60, 'jeff', 'john', 'car')`,
      );
      request(app)
        .get('/rides/1')
        .send({ name: 'john' })
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          expect(res.body).excluding(['created']).to.deep.equals({
            ride_id: 1,
            start_lat: -85,
            start_long: 80,
            end_lat: 70,
            end_long: 60,
            rider_name: 'jeff',
            driver_name: 'john',
            driver_vehicle: 'car',
          });
        });
    });
  });
});
