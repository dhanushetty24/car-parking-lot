# car-parking-lot

## Installation

install node, simply

`npm install`

## Usage

`node app.js`
#APIs
Method: POST
Endpoint: /api/car/:carNumber/park
Response: { slotnumber, carNumber, status}
Description: Park a car

Method: PATCH
Endpoint: /api/car/:slotNumber/unPark
Response: {message}
Description: Unpark a car from the slot number provided.

Method: GET
Endpoint: /api/car/:searchKey/getInfo
Response: { slotnumber, carNumber}
Description: Get the slot/car number in params and return both the car number and slot number for the input.
