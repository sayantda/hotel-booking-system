require('mocha')
const assert = require('chai').assert
const factory = require('../app/components/factory')
const config = require('../config')

describe('factory_unitTest', function () {
  it('createResource_factory_test', function () {
    let resource = factory.createResource('/api/v1/users/0', 'Collection')
    assert.deepEqual(resource, {
      '@context': config.ns + '/contexts/collection',
      '@id': '/api/v1/users/0',
      '@type': 'Collection'
    })
  })

  it('createCollection_factory_test', function () {
    let collection = factory.createCollection('/api/v1/users/0', 'Collection', [])
    assert.deepEqual(collection, {
      '@context': '/api/v1/contexts/collection',
      '@type': 'Collection',
      '@id': '/api/v1/users/0',
      'members': []
    })
  })
})