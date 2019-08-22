const config = require('../../config')

module.exports = (function () {
  /**
   * Returns an array with min...max unique random numbers in the range of 0...length.
   **/
  let fillArray = function (min, max, length, resource) {
    let set = new Set()
    let maxCount = Math.floor(Math.random() * (max - min + 1)) + min
    for (let i = 0; i < maxCount; i++) {
      let id = Math.floor(Math.random() * length)
      set.add(config.ns + '/' + resource + '/' + id)
    }

    return Array.from(set)
  }

  /**
   * Returns a random date from now to 1000 days in the future.
   **/
  let getDate = function (seed = new Date()) {
    return new Date(seed.getTime() + (Math.floor(Math.random() * 10) * 24 * 3600 * 1000))
  }

  return {
    fillArray,
    getDate
  }
}())
