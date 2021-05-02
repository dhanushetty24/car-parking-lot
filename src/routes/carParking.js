const express = require('express');
const router = new express.Router();
const carParking = require('../controllers/carParkingController');
const {
  rateLimiter
} = require('../helpers/utils');

router.post('/:carNumber/park', rateLimiter(), carParking.park);
router.post('/:slotNumber/unPark', rateLimiter(), carParking.unPark);
router.get('/:searchKey/getInfo', rateLimiter(), carParking.getParkingDetails);

module.exports = router;
