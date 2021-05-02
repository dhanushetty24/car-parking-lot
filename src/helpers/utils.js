/**
 * Pass Object Or Array Or String Or Number and find if it is empty or not, Null Or Undefined also gives false
 * @param  {Any} data data to be checked against
 * @param  {function} cb callback
 * @return {Any} data which is given if it exists or False
 */
 exports.checkIfDataExists = (data) => {
  let flagDataExists;
  if (data === 0 ? '0' : data) {
    switch (data.constructor) {
      case Object:
        flagDataExists = Object.keys(data).length ? true : false;
        break;
      case Array:
        flagDataExists = data.length ? true : false;
        break;
      default:
        flagDataExists = true;
        break;
    }
    if (flagDataExists) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
