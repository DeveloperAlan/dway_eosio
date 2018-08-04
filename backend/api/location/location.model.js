const mongoose = require('mongoose')

const { Schema } = mongoose

let location = null

try {
  const locationSchema = new Schema({
    _id: {
      timestamp: Number,
      author: String
    },
    author: String,
    user_id: String,
    name: String,
    loc_long: Number,
    loc_lat: Number,
    loc_time: Number,
    device: String,
    sustainability: Number,
    travel: Number,
    on_bus: Boolean,
    locationConfirmed: {
      type: Boolean,
      default: false
    }
  })
  location = mongoose.model('location', locationSchema)
} catch (e) {
  location = mongoose.model('location')
}

module.exports = location
