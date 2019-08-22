require('mocha')
const assert = require('chai').assert

const dbClient = require('../app/components/dbClient')

describe('dbClient_unitTest', function () {
  const userDBClient = dbClient('users')
  it('all_users_unitTest', function () {
    let data = userDBClient.all()
    assert.equal(data.length, 3)
  })

  it('find_users_unitTest', function () {
    let data = userDBClient.find('0')
    assert.deepEqual(data, {
      'id': '/api/v1/users/0',
      'first_name': 'Rick',
      'last_name': 'Grimes',
      'username': 'rickgrimes',
      'email': 'rickgrimes@email.com',
      'password': 'michonne',
      'bookings': [
        '/api/v1/bookings/0'
      ],
      'bonus_points': 100
    })
  })

  it('create_users_unitTest', function () {
    let userEntity = {
      first_name: 'Morgan',
      last_name: '',
      username: 'morgan',
      email: 'morgan@email.com',
      password: 'morganswife',
      bookings: ['/api/v1/bookings/0'],
      bonus_points: 100
    }
    userDBClient.create(userEntity, function (entity) {
      if (entity) {
        assert.equal(entity.id, '/api/v1/users/3')
      }
    })
  })

  it('update_users_unitTest', function () {
    let userEntity = {
      id: '/api/v1/users/3',
      first_name: 'Morgan',
      last_name: '',
      username: 'morgan',
      email: 'morgan@email.com',
      password: 'morgansson',
      bookings: ['/api/v1/bookings/0'],
      bonus_points: 100
    }
    userDBClient.update(userEntity, function (entity) {
      if (entity) {
        assert.equal(entity.password, 'morgansson')
      }
    })
  })

  it('delete_users_unitTest', function () {
    let success = userDBClient.remove('3')
    assert.equal(success, true)
  })

})