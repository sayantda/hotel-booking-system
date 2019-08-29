'use strict'

const router = require('../components/router')
const jsonld = require('../components/factory')
const handler = require('../components/hotelHandler')
const config = require('../../config')

/**
 * This is the room specfic routes. It supports get, post, put, and delete operations on various endpoints
 * @returns {Router|router}
 * @constructor
 */
function RoomRoutes () {
  let dbc = require('../components/dbClient')('rooms')
  let rooms = router(dbc)

  rooms.get('/:id', (req, res, next) => {
    let idVal = config.ns + '/rooms/' + req.params.id
    dbc.find(idVal).then(entry => {
      if (entry) {
        let json = jsonld.createResource(req.originalUrl, 'Room')
        json['room_no'] = entry.room_no
        json['description'] = entry.description
        json['category'] = entry.category
        json['size'] = entry.size
        json['capacity'] = entry.capacity
        json['price'] = entry.price
        json['hotel'] = entry.hotel

        res.send(json)
      } else {
        res.status(404).json('Not Found')
      }

      next()
    })
  })

  rooms.post('/', (req, res, next) => {
    handler.createRoom(req.body, (entity) => {
      if (entity) res.status(201).send(entity)
      else res.status(500).json('Room not created successfully')
      next()
    })
  })

  rooms.put('/:id', (req, res, next) => {
    req.body['id'] = req.params.id

    dbc.update(req.body, (entity) => {
      if (entity) res.status(200).send(entity)
      else res.status(500).json('Room not updated successfully')
    })

    next()
  })

  rooms.delete('/:id', (req, res, next) => {
    handler.deleteRoom(req.params.id, (roomId) => {
      if (roomId) res.status(200).json('OK')
      else res.status(500).json('Room not deleted successfully')

      next()
    })
  })

  return rooms
}

module.exports = RoomRoutes()
