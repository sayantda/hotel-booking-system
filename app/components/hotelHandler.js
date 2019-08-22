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
    let oldUser = dbcUsers.find(user.id)
    delete user.bookings
    let newUser = {...oldUser, ...user}
    dbcUsers.update(newUser, cb)
  }

  /**
   * Used to update booking information and updated booking information is sent via the callback
   * @param booking
   * @param cb
   */
  let updateBooking = function (booking, cb) {
    let oldBooking = dbcBookings.find(booking.id)
    booking.user = config.ns + '/users/' + booking.user
    booking['rooms'] = oldBooking.rooms
    dbcBookings.update(booking, cb)
  }

  /**
   * Used to associate a room to a booking id and updated information is passed to the callback
   * @param bookingId
   * @param roomId
   * @param cb
   */
  let addRoom = function (bookingId, roomId, cb) {
    let booking = dbcBookings.find(bookingId)
    let room = dbcRooms.find(roomId)
    if (booking && room) {
      booking.rooms.push(room.id)
      dbcBookings.update(booking, (bookingEntity) => {
        if (bookingEntity) cb(bookingEntity)
        else cb()
      })
    } else cb()
  }

  /**
   * Used to remove a room from existing booking and updated booking is passed back via the callback
   * @param bookingId
   * @param roomId
   * @param cb
   */
  let removeRoom = function (bookingId, roomId, cb) {
    let booking = dbcBookings.find(bookingId)
    let room = dbcRooms.find(roomId)
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
  }

  /**
   * This is used to provide a way for adding new rooms to the hotel.
   * @param room
   * @param cb
   */
  let createRoom = function (room, cb) {
    dbcRooms.create(room, (roomEntity) => {
      cb()
    })
  }

  /**
   * This is used to provide a way for deleting an existing room to the hotel.
   * @param roomId
   * @param cb
   * @returns {*}
   */
  let deleteRoom = function (roomId, cb) {
    let room = dbcRooms.find(roomId)
    if (!room) {
      return cb()
    }
    dbcRooms.remove(roomId)
    cb(roomId)
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
