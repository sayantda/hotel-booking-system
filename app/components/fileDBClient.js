'use strict'

const fs = require('fs')
const path = require('path')
const config = require('../../config')

module.exports = (dbName) => {
  let dbPath = path.resolve('./data/' + dbName + '.json')
  let db = require(dbPath)

  /**
   * This method is used to update the collection storage data files with the new changes stored in db variable
   * @returns {boolean}
   * @private
   */
  function _updateDB () {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(db))
      return true
    } catch (err) {
      console.log(err)
    }
    return false
  }

  /**
   * This method is used to return all records for a given collection
   * @returns {*}
   */
  let all = function () {
    return new Promise((resolve, reject) => {
      return resolve(db)
    })
  }

  /**
   * This method is used to find a specific entry in the dataset, if not found returns null
   * @param id
   * @returns {null/entry}
   */
  let find = function (id) {
    return new Promise((resolve, resject) => {
      let idVal = id.split('/')[4]
      let data = db[idVal]
      return resolve(data)
    })
  }

  /**
   * This method is used to create a new datapoint in the dataset for the specified collection and returns created data in callback
   * @param entity
   * @param cb
   */
  let create = function (entity, cb) {
    entity['id'] = config.ns + '/' + dbName + '/' + db.length
    db.push(entity)

    if (_updateDB()) cb(entity)
    else cb()
  }

  /**
   * This method is used to update an existing datapoint in the dataset for the specified collection and returns updated data in callback
   * @param entity
   * @param cb
   */
  let update = function (entity, cb) {
    let id = entity.id.split('/')[4]
    if (id < 0 || id >= db.length) {
      cb()
    } else {
      entity.id = config.ns + '/' + dbName + '/' + id
      db[id] = entity
      if (_updateDB()) cb(entity)
      else cb()
    }
  }

  /**
   * This method is used to remove an existing datapoint in the dataset for the specified collection and returns true or false depending on success/failure
   * @param id
   * @returns {boolean}
   */
  let remove = function (id) {
    return new Promise((resolve, reject) => {
      let idVal = id.split('/')[4]
      db[idVal] = {}
      return resolve()
    })
  }

  return {
    all,
    find,
    create,
    update,
    remove
  }
}
