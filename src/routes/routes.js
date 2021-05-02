const express = require('express');
const router = new express.Router();
const carParking = require('./carParking');

router.use('/car', carParking);

module.exports = router;
