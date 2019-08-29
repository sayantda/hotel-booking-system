'use strict'

const fileDBClient = require('./fileDBClient')
const mongoDBClient = require('./mongoDBClient')
const config = require('../../config')

module.exports = (dbName) => {

  if (!config.useMongo) {
    return fileDBClient(dbName)
  } else {
    return mongoDBClient(dbName)
  }
}