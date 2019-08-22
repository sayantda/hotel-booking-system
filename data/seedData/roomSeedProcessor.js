const w = require('../util/fileWriter')
const config = require('../../config')

/**
 * This function is going to create entries in the rooms dataset when deploy.js gets called, based on dummy data
 *
 */
module.exports = function () {
  let rooms = []
  for (let i = 0; i < 100; i++) {
    let catIndex = Math.floor(Math.random() * 5)
    rooms.push({
      id: config.ns + '/rooms/' + i,
      room_no: i + 1,
      description: 'Awesome room',
      size: parseInt(Math.floor(Math.random() * 55) + 15),
      capacity: catIndex + 1,
      price: parseFloat((Math.random() * 200 + 20).toFixed(2))
    })
  }
  w('rooms', JSON.stringify(rooms))
}
