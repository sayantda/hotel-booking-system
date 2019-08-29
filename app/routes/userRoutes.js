'use strict'

const router = require('../components/router')
const jsonld = require('../components/factory')
const handler = require('../components/hotelHandler')
const config = require('../../config')

/**
 * This is the user specfic routes. It supports get, post, put, and delete operations on various endpoints
 * @returns {Router|router}
 * @constructor
 */
function UserRoutes () {
  let dbc = require('../components/dbClient')('users')
  let users = router(dbc)

  users.get('/:id', (req, res, next) => {
    let idVal = config.ns + '/users/' + req.params.id
    dbc.find(idVal).then((entry) => {
      if (entry) {
        let json = jsonld.createResource(req.originalUrl, 'User')
        json['first_name'] = entry.first_name
        json['last_name'] = entry.last_name
        json['username'] = entry.username
        json['email'] = entry.email
        json['password'] = entry.password
        json['bookings'] = req.originalUrl + 'bookings'
        json['bonus_points'] = entry.bonus_points
        res.send(json)
      } else {
        res.status(404).json('Not Found')
      }
      next()
    }).catch(err => console.log(err))
  })

  users.post('/', (req, res, next) => {
    req.body['bookings'] = []
    dbc.create(req.body, (entity) => {
      if (entity) res.status(201).send(entity)
      else res.status(500).json('User not created successfully')
      next()
    })
  })

  users.put('/:id', (req, res, next) => {
    req.body['id'] = req.params.id

    handler.updateUser(req.body, (entity) => {
      if (entity) res.status(200).send(entity)
      else res.status(500).json('User not updated successfully')
      next()
    })
  })

  users.get('/:id/bookings', (req, res, next) => {
    let idVal = config.ns + '/users/' + req.params.id
    dbc.find(idVal).then(data => {
      res.send(jsonld.createCollection(
        req.originalUrl,
        'Booking',
        data['bookings']
      ))
      next()
    })
  })

  users.delete('/:id', (req, res, next) => {
    dbc.remove(req.params.id).then(() => {
      res.sendStatus(200)
      next()
    }).catch(err => {
      res.status(500).json('User not deleted successfully')
      next()
    })

  })

  return users
}

module.exports = UserRoutes()
