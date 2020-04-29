const snakeCaseKeys = require('snakecase-keys');
const camelcaseKeys = require('camelcase-keys');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../utilities/logger');

const jsonParser = bodyParser.json();

const rideService = require('../services/rides-service');
const {
  rideValidator,
  isValidNumber,
} = require('../validators/input-validator');

const router = express.Router();

router.post('/', jsonParser, async (req, res, next) => {
  const options = {
    ride: camelcaseKeys(req.body),
  };
  try {
    logger.debug(`create Rides request ${options.ride}`);
    rideValidator(options.ride);
    const result = await rideService.createRide(options.ride);
    res.status(201).json(snakeCaseKeys(result));
  } catch (error) {
    logger.info(`Error while creating rides ${error.message}`);
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  const options = {
    limit: req.query.limit,
    offset: req.query.offset,
  };
  try {
    logger.debug(`gets Rides request ${options}`);
    const result = await rideService.getRides(options.offset, options.limit);
    res.status(200).json(snakeCaseKeys(result));
  } catch (error) {
    logger.info(`Error while fetching rides ${error.message}`);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const options = {
    rideId: req.params.id,
  };
  try {
    logger.debug(`getRide by id request ${options}`);
    isValidNumber(options.rideId);
    const result = await rideService.getRideById(options.rideId);
    res.status(200).json(snakeCaseKeys(result));
  } catch (error) {
    logger.info(`Error while geting ride by id ${error.message}`);
    next(error);
  }
});
module.exports = router;
