const mongoose = require('mongoose')
const config = require('./../../config')

mongoose.connect('mongodb://' + config.mongo.host + '/hotel', { useNewUrlParser: true })

const User = mongoose.model('User', {
  id: String,
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
  bookings: [
    String
  ],
  bonus_points: Number
})

const Booking = mongoose.model('Booking', {
  id: String,
  date: String,
  arrival_date: String,
  departure_date: String,
  payment_method: String,
  amount: Number,
  user: String,
  rooms: [
    String
  ],
  booking_status: String
})

const Room = mongoose.model('Room', {
  id: String,
  room_no: Number,
  description: String,
  size: Number,
  capacity: Number,
  price: Number
})

module.exports = (dbName) => {
  if (dbName === 'users') {
    return User
  } else if (dbName === 'rooms'){
    return Room
  } else if (dbName === 'bookings') {
    return Booking
  }
}