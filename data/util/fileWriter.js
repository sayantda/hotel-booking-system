const fs = require('fs')
const path = require('path')

module.exports = (name, json) => {
  let destDir = path.join(__dirname, '..')

  fs.writeFile(path.join(destDir, name + '.json'), json, 'utf8', err => {
    if (err) {
      console.log('An error occured while writing ' + name + ' to File.')
      return console.log(err)
    }

    console.log('\'' + name + '\' have been saved.')
  })
}
