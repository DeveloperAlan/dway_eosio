const location = require('./location.model')

/**
 * Get list of all locations confirmed by the blockchain
 * @returns {location[]}
 */
const listConfirmed = async (req, res) => {
  try {
    const confirmedLocations = await location.find({ locationConfirmed: true }).exec()
    res.send(confirmedLocations)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { listConfirmed }
