const dbcBookings = require('./dbClient')('bookings')
const dbcRooms = require('./dbClient')('rooms')
const dbcUsers = require('./dbClient')('users')
const config = require('../../config')

/**
 * This is the hotelHandler, used to manage all api operations.
 * @returns {{updateUser: updateUser, updateBooking: updateBooking, addRoom: addRoom, removeRoom: removeRoom, createRoom: createRoom, deleteRoom: deleteRoom}}
 * @constructor
 */
function HotelHandler () {

  /**
   * Used to update user information and updated information gets passed through the callback
   * @param user
   * @param cb
   */
  let updateUser = function (user, cb) {
    let idVal = config.ns + '/users/' + user.id
    dbcUsers.find(idVal).then(oldUser => {
      delete user.bookings
      let newUser = {...oldUser, ...user}
      if (user.hasOwnProperty('bonus_points')) {
        newUser.bonus_points = oldUser.bonus_points + user.bonus_points
        dbcBookings.all({user: idVal}).then(bookings => {
          bookings.forEach(booking => {
            if (booking.booking_status === 'PENDING APPROVAL') {
              if (newUser.bonus_points > booking.amount) {
                newUser.bonus_points = (newUser.bonus_points - booking.amount).toFixed(2)
                booking.booking_status = 'BOOKED'
                dbcBookings.update({id: booking.id, booking_status: booking.booking_status}, function () {
                  console.log('Booking updated')
                })
              }
            }
          })
          newUser.id = idVal
          dbcUsers.update(newUser, cb)
        })
      }
    })
  }

  /**
   * Used to update booking information and updated booking information is sent via the callback
   * @param booking
   * @param cb
   */
  let updateBooking = function (booking, cb) {
    dbcBookings.find(booking.id).then(result => {
      let oldBooking = result[0]
      booking.user = config.ns + '/users/' + booking.user
      booking['rooms'] = oldBooking.rooms
      dbcBookings.update(booking, cb)
    })
  }

  /**
   * Used to associate a room to a booking id and updated information is passed to the callback
   * @param bookingId
   * @param roomId
   * @param cb
   */
  let addRoom = function (bookingId, roomId, cb) {
    dbcBookings.find(bookingId).then(booking => {
      dbcRooms.find(roomId).then(room => {
        if (booking && room) {
          booking.rooms.push(room.id)
          dbcBookings.update(booking, (bookingEntity) => {
            if (bookingEntity) cb(bookingEntity)
            else cb()
          })
        } else cb()
      })
    })

  }

  /**
   * Used to remove a room from existing booking and updated booking is passed back via the callback
   * @param bookingId
   * @param roomId
   * @param cb
   */
  let removeRoom = function (bookingId, roomId, cb) {
    dbcBookings.find(bookingId).then((booking) => {
      dbcRooms.find(roomId).then(room => {
        if (booking && room) {
          let roomIndex = booking.rooms.indexOf(room.id)
          if (roomIndex >= 0) {
            booking.rooms.splice(roomIndex, 1)
            dbcBookings.update(booking, (bookingEntity) => {
              if (bookingEntity) cb(bookingEntity)
              else cb()
            })
          } else cb()
        } else cb()
      })
    })
  }

  /**
   * This is used to provide a way for adding new rooms to the hotel.
   * @param room
   * @param cb
   */
  let createRoom = function (room, cb) {
    dbcRooms.create(room, (roomEntity) => {
      if (roomEntity) cb(roomEntity)
      else cb()
    })
  }

  /**
   * This is used to provide a way for deleting an existing room to the hotel.
   * @param roomId
   * @param cb
   * @returns {*}
   */
  let deleteRoom = function (roomId, cb) {
    dbcRooms.find(roomId).then((result) => {
      let room = result[0]
      if (!room) {
        return cb()
      }
      dbcRooms.remove(roomId).then(() => {cb(roomId)})
    })
  }

  return {
    updateUser,
    updateBooking,
    addRoom,
    removeRoom,
    createRoom,
    deleteRoom
  }
}

module.exports = HotelHandler()
