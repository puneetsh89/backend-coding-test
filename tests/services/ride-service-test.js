const chai = require('chai');
const sinon = require('sinon');
const rideRepo = require('../../src/repositories/ride-repo');
const rideService = require('../../src/services/rides-service');
const NotFoundError = require('../../src/errors/not-found-error');
const AppError = require('../../src/errors/app-error');
const {
  response,
  insertData,
  insertResult,
} = require('../utilities/mock-data');

chai.use(require('chai-as-promised'));

const { expect } = chai;

describe('ride service', () => {
  describe('getRides', () => {
    const sandbox = sinon.createSandbox();
    let rideRepoStub;
    beforeEach(() => {
      rideRepoStub = sandbox.stub(rideRepo, 'getRides');
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('db has data', () => {
      rideRepoStub.withArgs(0, 10).resolves(response);
      const promise = rideService.getRides(0, 10);
      return expect(promise).eventually.equal(response);
    });
    it('repo throws AppError', () => {
      rideRepoStub
        .withArgs(0, 10)
        .rejects(new AppError('Internal server error', 'SERVER_ERROR'));
      const promise = rideService.getRides(0, 10);
      return expect(promise)
        .eventually.rejectedWith('Internal server error')
        .and.be.an.instanceOf(AppError);
    });
    it('repo throws NotFound', () => {
      rideRepoStub
        .withArgs(0, 10)
        .rejects(new NotFoundError('Could not find any rides'));
      const promise = rideService.getRides(0, 10);
      return expect(promise)
        .eventually.rejectedWith('Could not find any rides')
        .and.be.an.instanceOf(NotFoundError);
    });
  });
  describe('getRideById', () => {
    const sandbox = sinon.createSandbox();
    let rideRepoStub;
    beforeEach(() => {
      rideRepoStub = sandbox.stub(rideRepo, 'getRideById');
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('db has data', () => {
      rideRepoStub.withArgs(1).resolves(response[0]);
      const promise = rideService.getRideById(1);
      return expect(promise).eventually.equal(response[0]);
    });
    it('repo throws AppError', () => {
      rideRepoStub
        .withArgs(10)
        .rejects(new AppError('Internal server error', 'SERVER_ERROR'));
      const promise = rideService.getRideById(10);
      return expect(promise)
        .eventually.rejectedWith('Internal server error')
        .and.be.an.instanceOf(AppError);
    });
    it('repo throws NotFound', () => {
      rideRepoStub
        .withArgs(100)
        .rejects(new NotFoundError('Could not find any rides'));
      const promise = rideService.getRideById(100);
      return expect(promise)
        .eventually.rejectedWith('Could not find any rides')
        .and.be.an.instanceOf(NotFoundError);
    });
  });
  describe('create ride', () => {
    const sandbox = sinon.createSandbox();
    let rideRepoStub;
    beforeEach(() => {
      rideRepoStub = sandbox.stub(rideRepo, 'createRide');
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('db has data', () => {
      rideRepoStub.withArgs(insertData).resolves(insertResult);
      const promise = rideService.createRide(insertData);
      return expect(promise).eventually.equal(insertResult);
    });
    it('repo throws AppError', () => {
      rideRepoStub
        .withArgs(insertData)
        .rejects(new AppError('Internal server error', 'SERVER_ERROR'));
      const promise = rideService.createRide(insertData);
      return expect(promise)
        .eventually.rejectedWith('Internal server error')
        .and.be.an.instanceOf(AppError);
    });
  });
});
