const modelFactory = require('../../app/models/hotelModel')
const users = modelFactory('users')
const bookings = modelFactory('bookings')
const rooms = modelFactory('rooms')
const userData = require('../users')
const bookingData = require('../bookings')
const roomData = require('../rooms')

module.exports = function () {

  rooms.deleteMany({}, function (res) {
    console.log('removed all records')
    rooms.count({}, function (err, count) {
      console.log('Rooms: ' + count)
      if (count === 0) {
        roomData.forEach(room => {
          let newRoom = new rooms(room)
          newRoom.save(function (err, doc) {
            console.log('Created test room: ' + doc._id)
          })
        })
      }
    })
  })

  bookings.deleteMany({}, function (res) {
    console.log('removed all records')
    bookings.count({}, function (err, count) {
      console.log('Bookings: ' + count)
      if (count === 0) {
        bookingData.forEach(booking => {
          let newBooking = new bookings(booking)
          newBooking.save(function (err, doc) {
            console.log('Created test booking: ' + doc._id)
          })
        })
      }
    })
  })

  users.deleteMany({}, function (res) {
    console.log('removed all records')
    users.count({}, function (err, count) {
      console.log('Users: ' + count)
      if (count === 0) {
        userData.forEach(user => {
          let newUser = new users(user)
          newUser.save(function (err, doc) {
            console.log('Created test user: ' + doc._id)
          })
        })
      }
    })
  })

  return
}