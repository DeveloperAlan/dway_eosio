const mongoose = require('mongoose')

const { Schema } = mongoose

let Score = null

try {
  const ScoreSchema = new Schema({
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
    scoreConfirmed: {
      type: Boolean,
      default: false
    }
  })
  Score = mongoose.model('Score', ScoreSchema)
} catch (e) {
  Score = mongoose.model('Score')
}

module.exports = Score
