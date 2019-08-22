const express = require('express')
const logger = require('morgan')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const config = require('./config.json')

const apidoc = require('./data/hydra/apidoc.json')
const entrypoint = require('./data/hydra/entrypoint.json')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.get(config.ns + '/', (req, res, next) => {
  res.send(entrypoint)
  next()
})

app.get(config.ns + '/vocab', (req, res, next) => {
  res.send(apidoc)
  next()
})

app.get(config.ns + '/contexts/:resource', (req, res, next) => {
  res.send(require('./data/hydra/contexts/' + req.params.resource + '.json'))
  next()
})

app.use(config.ns + '/users', require('./app/routes/userRoutes'))
app.use(config.ns + '/rooms', require('./app/routes/roomRoutes'))
app.use(config.ns + '/bookings', require('./app/routes/bookingRoutes'))

app.use(logger('dev'))

app.listen(port, () => {
  console.log('RESTful Web Server started on *:' + port)
})
