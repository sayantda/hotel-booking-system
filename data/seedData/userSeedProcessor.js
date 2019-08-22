const w = require('../util/fileWriter')
const config = require('../../config')

const firstnames = require('./firstnames.json')
const lastnames = require('./lastnames.json')
const passwords = require('./passwords.json')

/**
 * This function is going to create entries in the users dataset when deploy.js gets called, based on dummy data
 * provided in firstnames, lastnames and passwords files
 */
module.exports = function () {
  let users = []
  for (let i = 0; i < 3; i++) {
    let firstname = firstnames[i]['firstname']
    let lastname = lastnames[i]['lastname']
    let username = firstname.toLowerCase() + lastname.toLowerCase()
    users.push({
      id: config.ns + '/users/' + i,
      first_name: firstname,
      last_name: lastname,
      username: username,
      email: username + '@email.com',
      password: passwords[i]['password'],
      bookings: [],
      bonus_points: 100
    })
  }

  w('users', JSON.stringify(users))
}
