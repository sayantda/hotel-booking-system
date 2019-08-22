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
    res.send(jsonld.createCollection(
      req.originalUrl,
      _getType(req.baseUrl),
      dbc.all()
    ))
    next()
  })

  return router
}
