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

    const schema = Joi.object().keys({
      carNumber: Joi.string().required().error(new Error("Invalid Car Number.")),
    });

    const result = schema.validate({
      carNumber
    });

    if (result.error) {
      return res.status(400).send({
        error: result.error.message
      });
    }

    //check if the car number provided is duplicate i.e a car with that car number is already parked. 
    const checkDuplicateCarNumber = parkingData.find(ele => ele.carNumber === carNumber);
    if (checkIfDataExists(checkDuplicateCarNumber)) {
      return res.status(400).send({
        error: `Car with ${carNumber} is already parked.`
      });
    }
    //check for vacant parking slot
    const availableSlot = parkingData.find(ele => !ele.carNumber);
    if (availableSlot) {
      const index = parkingData.findIndex(ele => ele._id === availableSlot._id)
      parkingData[index].carNumber = carNumber;
      fs.writeFileSync('parkingData.json', JSON.stringify(parkingData), 'utf8');
      return res.status(200).send({
        status: 'Car Parked.',
        slotNumber: parkingData[availableSlot]._id
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
        slotNumber: createSlot._id
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