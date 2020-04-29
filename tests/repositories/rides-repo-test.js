const chai = require('chai');
const db = require('../../src/utilities/db-util');
const rideRepo = require('../../src/repositories/ride-repo');
const NotFoundError = require('../../src/errors/not-found-error');
const AppError = require('../../src/errors/app-error');
const { response } = require('../utilities/mock-data');

chai.use(require('chai-as-promised'));

const { expect } = chai;

describe('rideRepo', () => {
  afterEach((done) => {
    db.run('delete from Rides');
    db.run(`delete from sqlite_sequence where name='Rides'`);
    done();
  });
  describe('getRides', () => {
    describe('positive cases', () => {
      beforeEach((done) => {
        db.run(
          `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values
          (15, 115, 10, 115, 'jeff', 'john', 'car'),
          (-85, 80, 80, 160, 'jin', 'jog', 'truck'),
          (85, 80, 70, 60, 'obama', 'ron', 'car'),
          (65, 80, -70, -60, 'mike', 'tyson', 'truck')`,
        );
        done();
      });
      it('records found in db and offet and limit is default', async () => {
        const promise = rideRepo.getRides();
        return expect(promise)
          .eventually.excluding(['created'])
          .deep.equal(response);
      });
      it('records found in db and offet 1 and limit is default', async () => {
        const promise = rideRepo.getRides(1);
        return expect(promise)
          .eventually.excluding(['created'])
          .deep.equal(response.slice(1));
      });
      it('records found in db and offet 0 and limit 2 is default', async () => {
        const promise = rideRepo.getRides(0, 2);
        return expect(promise)
          .eventually.excluding(['created'])
          .deep.equal(response.slice(0, 2));
      });
      it('records found in db and offet 1 and limit 2 is default', async () => {
        const promise = rideRepo.getRides(1, 2);
        return expect(promise)
          .eventually.excluding(['created'])
          .deep.equal(response.slice(1, 3));
      });
    });
    describe('negative cases', () => {
      it('records not found in db', async () => {
        const promise = rideRepo.getRides();
        return expect(promise)
          .eventually.rejectedWith('Could not find any rides')
          .and.be.an.instanceOf(NotFoundError);
      });
    });
  });
  describe('getRidesById', () => {
    beforeEach((done) => {
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values
          (15, 115, 10, 115, 'jeff', 'john', 'car'),
          (-85, 80, 80, 160, 'jin', 'jog', 'truck'),
          (85, 80, 70, 60, 'obama', 'ron', 'car'),
          (65, 80, -70, -60, 'mike', 'tyson', 'truck')`,
      );
      done();
    });
    it('records found in db and id is 1', async () => {
      const promise = rideRepo.getRideById(1);
      return expect(promise)
        .eventually.excluding(['created'])
        .deep.equal(response[0]);
    });
    it('records found in db and id is 3', async () => {
      const promise = rideRepo.getRideById(3);
      return expect(promise)
        .eventually.excluding(['created'])
        .deep.equal(response[2]);
    });
    it('records not found in db and id is 6', async () => {
      const promise = rideRepo.getRideById(6);
      return expect(promise)
        .eventually.rejectedWith('Could not find any rides')
        .and.be.an.instanceOf(NotFoundError);
    });
  });
  describe('createRide', () => {
    beforeEach((done) => {
      db.run(
        `insert into Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) values
          (15, 115, 10, 115, 'jeff', 'john', 'car'),
          (-85, 80, 80, 160, 'jin', 'jog', 'truck'),
          (85, 80, 70, 60, 'obama', 'ron', 'car'),
          (65, 80, -70, -60, 'mike', 'tyson', 'truck')`,
      );
      done();
    });
    it('created new record', async () => {
      const data = {
        driverName: 'jog',
        driverVehicle: 'truck',
        endLat: 80,
        endLong: 160,
        riderName: 'jin',
        startLat: -85,
        startLong: 80,
      };
      const result = {
        driverName: 'jog',
        driverVehicle: 'truck',
        endLat: 80,
        endLong: 160,
        riderName: 'jin',
        startLat: -85,
        startLong: 80,
        rideId: 5,
      };
      const promise = rideRepo.createRide(data);
      return expect(promise)
        .eventually.excluding(['created'])
        .deep.equal(result);
    });
    it('erro while creatin new record', async () => {
      const data = {
        driverVehicle: 'truck',
        endLat: 80,
        endLong: 160,
        riderName: 'jin',
        startLat: -85,
        startLong: 80,
      };
      const promise = rideRepo.createRide(data);
      return expect(promise)
        .eventually.rejectedWith('Internal server error')
        .and.be.an.instanceOf(AppError);
    });
  });
});
