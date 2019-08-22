const config = require('../../config')

/**
 * This function is used to provide JSON LD formatted data to consumers when fetch operation is performed on the collection.
 * @returns {{createResource: (function(*=, *=): {'@context': string, '@id': *, '@type': *}), createCollection: (function(*=, *, *): {'@context': string, '@type': string, '@id': *, members: Array})}}
 * @constructor
 */
function JsonLdFactory () {
  let createResource = function (url, type) {
    return {
      '@context': config.ns + '/contexts/' + type.toLowerCase(),
      '@id': url,
      '@type': type
    }
  }

  let createCollection = function (url, type, entries) {
    let json = {
      '@context': config.ns + '/contexts/collection',
      '@type': 'Collection',
      '@id': url,
      'members': []
    }

    entries.forEach(entry => {
      if (Object.keys(entry).length > 0) {
        json.members.push({
          '@id': entry.id ? entry.id : entry,
          '@type': 'vocab:' + type
        })
      }
    })
    return json
  }
  return {
    createResource,
    createCollection
  }
}

module.exports = JsonLdFactory()
