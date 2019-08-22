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
    let entry = dbc.find(req.params.id)

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

  bookings.get('/:id/rooms', (req, res, next) => {
    res.send(jsonld.createCollection(
      req.originalUrl,
      'Room',
      dbc.find(req.params.id)['rooms']
    ))
    next()
  })

  bookings.put('/:id', (req, res, next) => {
    req.body['id'] = req.params.id

    handler.updateBooking(req.body, (entity) => {
      if (entity) res.status(200).send(entity)
      else res.status(500).json('Booking could not be updated! Please try again later.')
      next()
    })
  })

  bookings.post('/:id/rooms', (req, res, next) => {
    handler.addRoom(req.params.id, req.body.room, (entity) => {
      if (entity) res.status(200).send(entity)
      else res.status(500).json('Room could not be added! Please try again later.')
      next()
    })
  })

  bookings.post('/', (req, res, next) => {
    let allBookings = dbc.all()
    let bookedRooms = []
    allBookings.forEach(function (booking) {
      booking.rooms.forEach(function (room) {
        bookedRooms.push(room)
      })
    })

    function generateRandomRoom (originalUrl) {
      let num = Math.floor(Math.random() * (100 - 5 + 1)) + 5
      let roomNum = originalUrl.replace('bookings', 'rooms') + (originalUrl.endsWith('/') ? '' : '/') + num
      return (bookedRooms.includes(roomNum)) ? generateRandomRoom() : roomNum
    }

    let entry = usersdbc.find(req.body.user)
    if (!entry) {
      return res.status(500).json('User not found in system!')
    }
    if (!req.body.payment_method || !['paytm', 'credit', 'debit', 'cash', 'bonus'].includes(req.body.payment_method)) {
      return res.status(500).json("Payment method is incorrect! Valid values: ['paytm', 'credit', 'debit', 'cash', 'bonus']")
    }
    req.body['rooms'] = []
    req.body['booking_status'] = ''
    if (req.body && req.body.payment_method && req.body.payment_method === 'bonus') {
      if (entry.bonus_points < req.body.amount) {
        req.body['booking_status'] = 'PENDING APPROVAL'
        entry.bonus_points = 0
      } else {
        req.body['booking_status'] = 'BOOKED'
        entry.bonus_points = (entry.bonus_points - req.body.amount).toFixed(2)
        let room = generateRandomRoom(req.originalUrl)
        req.body['rooms'].push(room)
      }
    } else {
      let room = generateRandomRoom(req.originalUrl)
      req.body['rooms'].push(room)
      req.body['booking_status'] = 'BOOKED'
    }
    req.body.user = config.ns + '/users/' + req.body.user
    dbc.create(req.body, (entity) => {
      if (entity) {
        entry.bookings.push(entity['id'])
        usersdbc.update(entry, function () {
          res.status(201).send(entity)
        })
      } else
        res.status(500).json('Booking could not be created! Please try again later.')
      next()
    })
  })

  bookings.delete('/:id/rooms', (req, res, next) => {
    if (!req.body.room) {
      return res.status(500).json('Room id was not provided in body!')
    }
    handler.removeRoom(req.params.id, req.body.room, (entity) => {
      if (entity) res.status(200).send(entity)
      else res.status(500).json('Room could not be removed! Please try again later.')
      next()
    })
  })

  bookings.delete('/:id', (req, res, next) => {
    if (dbc.remove(req.params.id)) {
      res.status(200).json('OK')
    } else {
      res.status(500).json('Booking could not be deleted! Please try again later.')
    }
    next()
  })
  return bookings
}

module.exports = BookingRoutes()
