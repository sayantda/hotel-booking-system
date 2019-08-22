require('mocha')
const assert = require('chai').assert
const hotelHandler = require('../app/components/hotelHandler')
const config = require('../config')

describe('hotelHandler_unitTest', function () {
  it('updateUser_hotelHandler_unitTest', function () {
    hotelHandler.updateUser({'id': '0', 'bonus_points': 500}, function (entity) {
      assert.equal(entity.bonus_points, 500)
      entity.bonus_points = 100
      entity.id = '0'
      hotelHandler.updateUser(entity, function (entity) {
        assert.equal(entity.bonus_points, 100)
      })
    })
  })

  it('updateBooking_hotelHandler_unitTest', function () {
    let origEntity = {
      'id': '0',
      'date': '2019-08-25T12:01:04.740Z',
      'arrival_date': '2019-08-31T12:01:04.740Z',
      'departure_date': '2019-09-09T12:01:04.740Z',
      'payment_method': 'credit',
      'amount': 330.02,
      'user': '/api/v1/users/1',
      'rooms': '/api/v1/bookings/0/rooms',
      'booking_status': 'BOOKED'
    }
    hotelHandler.updateBooking(origEntity, function (entity) {
      assert.equal(entity.amount, 330.02)
      entity.amount = 440.02
      entity.id = 0
      hotelHandler.updateBooking(entity, function (updatedEntity) {
        assert.equal(updatedEntity.amount, 440.02)
      })
    })
  })

  it('addRoom_hotelHandler_unitTest', function () {
    hotelHandler.addRoom('0', '99', function (entity) {
      if (entity) {
        assert.deepEqual(entity.rooms, [
          "/api/v1/rooms/79",
          "/api/v1/rooms/36",
          "/api/v1/rooms/88",
          "/api/v1/rooms/53",
          "/api/v1/rooms/99"
        ])
      }
    })
  })

  it('removeRoom_hotelHandler_unitTest', function () {
    hotelHandler.removeRoom('0', '99', function (entity) {
      if (entity) {
        assert.deepEqual(entity.rooms, [
          "/api/v1/rooms/79",
          "/api/v1/rooms/36",
          "/api/v1/rooms/88",
          "/api/v1/rooms/53"
        ])
      }
    })
  })

  it('createRoom_hotelHandler_unitTest', function () {
    hotelHandler.createRoom({
      "room_no": 110,
      "description": "Test room",
      "size": 100,
      "capacity": 2,
      "price": 293.84
    }, function (entity) {
      if (entity) {
        assert.deepEqual(entity.id, "/api/v1/rooms/100")
      }
    })
  })

  it('deleteRoom_hotelHandler_unitTest', function () {
    hotelHandler.deleteRoom('100', function (roomid) {
      if (roomid) {
        assert.deepEqual(roomid, '100')
      }
    })
  })
})