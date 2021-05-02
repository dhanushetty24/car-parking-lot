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


const storeIp = [];
const getcurrentTimeInSec = () => Math.floor(Date.now() / 1000);
exports.getRemainingTime = (timeLimit, lastReqtime) => Math.abs(getcurrentTimeInSec() - (lastReqtime + timeLimit));

/**
 * @name rateLimiter
 * API Limit on route by IP.
 */
exports.rateLimiter = () => {
  return (req, res, next) => {
    const ip = req.ip;
    const timeLimit = process.env.TIME_LIMIT;
    const requestLimit = process.env.REQUEST_LIMIT;
    const existingIp = storeIp.findIndex(ele => ele.ip === ip);
    if (existingIp !== -1) {
      storeIp[existingIp].reqCount += 1;
      const currentTime = getcurrentTimeInSec();
      if (storeIp[existingIp].previousRequest + timeLimit > currentTime) {
        if (storeIp[existingIp].reqCount > requestLimit) {
          return res.status(429).json({
            message: `Too many requests. Please try after ${this.getRemainingTime(timeLimit, storeIp[existingIp].previousRequest)} seconds.`
          });
        } else {
          storeIp[existingIp].previousRequest = getcurrentTimeInSec();
          next();
        }
      } else {
        storeIp[existingIp].reqCount = 1;
        storeIp[existingIp].previousRequest = getcurrentTimeInSec();
        next();
      }
    } else {
      // this is a new ip
      storeIp.push({
        ip,
        reqCount: 1,
        previousRequest: getcurrentTimeInSec()
      });
      next();
    }
  }
};
