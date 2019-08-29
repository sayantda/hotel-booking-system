'use strict'

const config = require('../../config')

module.exports = (dbName) => {
  let dbModel = require('../models/hotelModel')(dbName)

  /**
   * This method is used to return all records for a given collection
   * @returns {*}
   */
  let all = function (criteria) {
    return dbModel.find(criteria).exec().then(data => {
      let dataArr = []
      if (data) {
        data.forEach(item => {
          dataArr.push(item._doc)
        })
      }
      return Promise.resolve(dataArr)
    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * This method is used to find a specific entry in the dataset, if not found returns null
   * @param id
   * @returns {null/entry}
   */
  let find = function (id) {
    return dbModel.find({id: id}).exec().then(data => {
      if (data && data[0]) {
        return Promise.resolve(data[0]._doc)
      }
      return Promise.resolve({})
    })
  }

  /**
   * This method is used to create a new datapoint in the dataset for the specified collection and returns created data in callback
   * @param entity
   * @param cb
   */
  let create = function (entity, cb) {
    dbModel.count({}, function(err, count) {
      entity['id'] = config.ns + '/' + dbName + '/' + count
      return new dbModel(entity).save(function (err) {
        cb(entity)
      })
    })
  }

  /**
   * This method is used to update an existing datapoint in the dataset for the specified collection and returns updated data in callback
   * @param entity
   * @param cb
   */
  let update = function (entity, cb) {
    return dbModel.findOneAndUpdate({id: entity.id}, {$set:entity}, {new: true}, function(err, data) {
      cb(data)
    })
  }

  /**
   * This method is used to remove an existing datapoint in the dataset for the specified collection and returns true or false depending on success/failure
   * @param id
   * @returns {boolean}
   */
  let remove = function (id) {
    return dbModel.find({id: id}).remove().exec()
  }

  return {
    all,
    find,
    create,
    update,
    remove
  }
}
