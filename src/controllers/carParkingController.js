const Joi = require('joi');
const {
  checkIfDataExists
} = require('../helpers/utils');
const fs = require('fs');
const {
  v4: uuidv4
} = require('uuid');
const parkingData = JSON.parse(fs.readFileSync('parkingData.json', 'utf-8'));

/**
 * @name park
 * @description Get the car number passed in params and send the slot where it is parked in the response 
 */
exports.park = async (req, res) => {
  try {
    const {
      carNumber
    } = req.params;

    //check if the car number provided is duplicate i.e a car with that car number is already parked. 
    const checkDuplicateCarNumber = parkingData.find(ele => ele.carNumber === carNumber);
    if (checkIfDataExists(checkDuplicateCarNumber)) {
      return res.status(400).send({
        error: `Car with ${carNumber} is already parked.`
      });
    }
    //check for vacant parking slot
    const availableSlot = parkingData.findIndex(ele => !ele.carNumber);
    if (availableSlot !== -1) {
      parkingData[availableSlot].carNumber = carNumber;
      fs.writeFileSync('parkingData.json', JSON.stringify(parkingData), 'utf8');
      return res.status(200).send({
        status: 'Car Parked.',
        slotNumber: parkingData[availableSlot]._id,
        carNumber
      });
    }

    //check for parking slot availability according to the capacity
    if (parkingData.length < process.env.PARKING_CAPACITY) {
      const createSlot = {
        _id: uuidv4(),
        carNumber,
      };

      parkingData.push(createSlot);
      fs.writeFileSync('parkingData.json', JSON.stringify(parkingData), 'utf8');

      return res.status(200).send({
        status: 'Car Parked.',
        slotNumber: createSlot._id,
        carNumber
      });
    }

    return res.status(400).send({
      error: 'Parking lot is full.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Internal Server Error.'
    });
  }
};

/**
 * @name unPark
 * @description Get the slot number in params from which the car is to be unparked 
 */
exports.unPark = async (req, res) => {
  try {
    const {
      slotNumber
    } = req.params;

    //check if slotId is valid and is occupied
    const checkSlotNumber = parkingData.find(ele => ele._id === slotNumber);
    if (!checkIfDataExists(checkSlotNumber)) {
      return res.status(404).send({
        error: 'Invalid Slot number provided.'
      });
    }
    if (!checkIfDataExists(checkSlotNumber.carNumber)) {
      return res.status(400).send({
        error: 'Slot is vacant.'
      });
    }

    const carNumber = checkSlotNumber.carNumber;
    const index = parkingData.findIndex(ele => ele._id === slotNumber);
    parkingData[index].carNumber = '';
    fs.writeFileSync('parkingData.json', JSON.stringify(parkingData), 'utf8');
    return res.status(200).send({
      message: `Car number ${carNumber} Unparked successfully. Parking available at ${slotNumber}.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Internal Server Error.'
    });
  }
};

/**
 * @name getParkingDetails
 * @description Get the slot/car number in params and return both the car number and slot number for the input
 */
exports.getParkingDetails = async (req, res) => {
  try {
    const {
      searchKey
    } = req.params;

    //check if searchKey is valid
    const checkSearchKey = parkingData.find(ele => ele._id === searchKey || ele.carNumber === searchKey);
    if (!checkIfDataExists(checkSearchKey)) {
      return res.status(404).send({
        error: 'Invalid search key provided.'
      });
    }

    return res.status(200).send({
      slotNumber: checkSearchKey._id,
      carNumber: checkSearchKey.carNumber || 'Parking Available.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Internal Server Error.'
    });
  }
};
