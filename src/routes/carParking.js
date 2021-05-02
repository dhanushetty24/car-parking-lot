
const express = require('express');
const router = new express.Router();
// Controller
const carParking = require('../controllers/carParkingController');

router.post('/:carNumber/park', carParking.park);

module.exports = router;