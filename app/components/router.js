'use strict'

const express = require('express')
const config = require('../../config')
const jsonld = require('./factory')

/**
 * This is the abstract router, diverts to specific route implementations based on url
 * @param dbc
 * @returns {Router|router}
 */
module.exports = dbc => {
  let router = express.Router()

  function _getType (baseUrl) {
    switch (baseUrl) {
      case config.ns + '/users':
        return 'User'
      case config.ns + '/rooms':
        return 'Room'
      case config.ns + '/bookings':
        return 'Booking'
      default:
        return 'Nothing'
    }
  }

  router.get('/', (req, res, next) => {
    function send (data) {
      if (data) {
        res.send(jsonld.createCollection(
          req.originalUrl,
          _getType(req.baseUrl),
          data
        ))
        next()
      }
    }

    dbc.all().then((data) => {
      send(data)
    })

  })

  return router
}
