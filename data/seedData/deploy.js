/**
 * This is the seed generator. Run from your console 'node deploy.js' to generate the seed data.
 */

function userData () {
  return require('./userSeedProcessor')()
}

function roomData () {
  return require('./roomSeedProcessor')()
}

function bookingData () {
  return require('./bookingSeedProcessor')()
}
setTimeout(userData, 0)
setTimeout(roomData, 2000)
setTimeout(bookingData, 3000)
