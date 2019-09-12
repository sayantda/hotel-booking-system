'use strict'

const router = require('../components/router')
const jsonld = require('../components/factory')
const handler = require('../components/hotelHandler')
const dbc = require('../components/dbClient')('bookings')
const usersdbc = require('../components/dbClient')('users')
const bookings = router(dbc)
const config = require('../../config')

/**
 * This is the booking specfic routes. It supports get, post, put, and delete operations on various endpoints
 * @returns {Router|router}
 * @constructor
 */
function BookingRoutes () {
  bookings.get('/:id', (req, res, next) => {
    let idVal = config.ns + '/bookings/' + req.params.id
    dbc.find(idVal).then(entry => {
      if (entry) {
        let json = jsonld.createResource(req.originalUrl, 'Booking')
        json['date'] = entry.date
        json['arrival_date'] = entry.arrival_date
        json['departure_date'] = entry.departure_date
        json['payment_method'] = entry.payment_method
        json['amount'] = entry.amount
        json['user'] = entry.user
        json['rooms'] = req.originalUrl + '/rooms'
        json['booking_status'] = entry.booking_status

        res.send(json)
      } else {
        res.status(404).json('Not Found')
      }
      next()
    })
  })

  bookings.get('/:id/rooms', (req, res, next) => {
    let idVal = config.ns + '/bookings/' + req.params.id
    dbc.find(idVal).then(entry => {
      if (entry && Object.keys(entry).length > 0) {
        res.send(jsonld.createCollection(
          req.originalUrl,
          'Room',
          entry.rooms
        ))
      } else {
        res.status(404).json('No rooms present with this booking')
      }
      next()
    })
  })

  bookings.post('/', (req, res, next) => {
    dbc.all().then((data) => {
      let bookedRoomIndex = []
      let bookedRoomsStatus = {}
      data.forEach(function (booking) {
        if (booking.rooms) {
          booking.rooms.forEach(function (room) {
            if (room) {
              bookedRoomIndex.push(room.split('/')[4])
              bookedRoomsStatus[room] = booking
            }
          })
        }
      })

      function getAvailableRoom(bonus) {
        if (bookedRoomIndex.length === 10) {
            for (let i in bookedRoomsStatus) {
              if (bookedRoomsStatus[i].booking_status === 'PENDING APPROVAL' && ((!!bonus && bonus >= req.body.amount) || !bonus)) {
                return i
              }
            }
          return
        } else {
          for (let i = 0; i < 10; i++) {
            if (bookedRoomIndex.indexOf(i.toString()) === -1) {
              return config.ns + '/rooms/' + i
            }
          }
        }
      }

      function updatePendingBooking(room) {
        let userBookingTobeDeleted = bookedRoomsStatus[room]
        if (userBookingTobeDeleted) {
          if (userBookingTobeDeleted.rooms.length > 1) {
            let index = userBookingTobeDeleted.rooms.indexOf(room);
            if (index !== -1) userBookingTobeDeleted.rooms.splice(index, 1);
            dbc.update(userBookingTobeDeleted, function () {
              console.log('Booking successfully updated by removing Pending Approval')
            })
          } else {
            dbc.remove(userBookingTobeDeleted.id).then(() => {console.log('Booking successfully removed for Pending Approval')})
          }
        }
      }

      let userIdVal = config.ns + '/users/' + req.body.user
      usersdbc.find(userIdVal).then((entry) => {
        if (!entry || (entry && Object.keys(entry).length === 0)) {
          return res.status(500).json('User not found in system!')
        }
        if (!req.body.payment_method || !['paytm', 'credit', 'debit', 'cash', 'bonus'].includes(req.body.payment_method)) {
          return res.status(500).json('Payment method is incorrect! Valid values: [\'paytm\', \'credit\', \'debit\', \'cash\', \'bonus\']')
        }
        req.body['rooms'] = []
        req.body['booking_status'] = ''
        if (req.body && req.body.payment_method && req.body.payment_method === 'bonus') {
          if (bookedRoomIndex.length === 10) {
            let room = getAvailableRoom(entry.bonus_points)
            if (!room) {
              return res.status(500).json('Booking could not be created! Rooms are unavailable!')
            } else {
              req.body['rooms'].push(room)
              updatePendingBooking(room)
            }
          }
          if (entry.bonus_points < req.body.amount) {
            req.body['booking_status'] = 'PENDING APPROVAL'
            let room = getAvailableRoom()
            if (!room) return res.status(500).json('Booking could not be created! Rooms are unavailable!')
            req.body['rooms'].push(room)
          } else {
            req.body['booking_status'] = 'BOOKED'
            entry.bonus_points = (entry.bonus_points - req.body.amount).toFixed(2)
            if (bookedRoomIndex.length < 10) {
              let room = getAvailableRoom()
              req.body['rooms'].push(room)
            }
          }
        } else {
          let room = getAvailableRoom()
          if (!room) return res.status(500).json('Booking could not be created! Rooms are unavailable!')
          req.body['rooms'].push(room)
          req.body['booking_status'] = 'BOOKED'
          if (bookedRoomIndex.length === 10) {
            updatePendingBooking(room)
          }
        }
        req.body.user = config.ns + '/users/' + req.body.user
        dbc.create(req.body, (entity) => {
          if (entity) {
            entry.bookings.push(entity['id'])
            usersdbc.update(entry, function () {
              res.status(201).send(entity)
              next()
            })
          } else {
            res.status(500).json('Booking could not be created! Please try again later.')
            next()
          }

        })
      })
    })
  })

  bookings.delete('/:id/rooms', (req, res, next) => {
    if (!req.body.room) {
      return res.status(500).json('Room id was not provided in body!')
    }
    let idVal = config.ns + '/bookings/' + req.params.id
    handler.removeRoom(idVal, req.body.room, (entity) => {
      if (entity) res.status(200).send(entity)
      else res.status(500).json('Room could not be removed! Please try again later.')
      next()
    })
  })

  bookings.delete('/:id', (req, res, next) => {
    let idVal = config.ns + '/bookings/' + req.params.id
    dbc.remove(idVal).then(() => {
      res.status(200).json('OK')
      next()
    }).catch(err => {
      res.status(500).json('Booking could not be deleted! Please try again later.')
      next()
    })
  })
  return bookings
}

module.exports = BookingRoutes()
