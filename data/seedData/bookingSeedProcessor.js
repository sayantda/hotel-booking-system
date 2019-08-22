const w = require('../util/fileWriter')
const utils = require('../util/utils')
const config = require('../../config')
const users = require('../users.json')
const rooms = require('../rooms.json')

/**
 * This function is going to create entries in the booking dataset when deploy.js gets called, and then update users
 * dataset with the update bookings, respective to their accounts.
 */
module.exports = function () {
  let pmts = ['paytm', 'credit', 'debit', 'cash', 'bonus']
  let bookings = []

  for (let i = 0; i < 3; i++) {
    let bookingDate = utils.getDate()
    let arrivalDate = utils.getDate(bookingDate)
    let amount = parseFloat((Math.random() * 500 + 20).toFixed(2))
    let payment_method = pmts[Math.floor(Math.random() * pmts.length)]
    let userId = Math.floor(Math.random() * users.length)
    let bookingDetails = {
      id: config.ns + '/bookings/' + i,
      date: bookingDate,
      arrival_date: arrivalDate,
      departure_date: utils.getDate(arrivalDate),
      payment_method: payment_method,
      amount: amount,
      user: config.ns + '/users/' + userId,
      rooms: utils.fillArray(1, 5, rooms.length, 'rooms'),
      booking_status: 'BOOKED'
    }
    bookings.push(bookingDetails)
    users[i].bookings.push(config.ns + '/bookings/' + i)
  }

  setTimeout(() => {w('bookings', JSON.stringify(bookings))}, 1000)
  setTimeout(() => {w('users', JSON.stringify(users))}, 2000)
}
