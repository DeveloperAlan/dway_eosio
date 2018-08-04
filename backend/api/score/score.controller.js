const Score = require('./score.model')

/**
 * Get list of all scores confirmed by the blockchain
 * @returns {Score[]}
 */
const listConfirmed = async (req, res) => {
  try {
    const confirmedScores = await Score.find({ scoreConfirmed: true }).exec()
    res.send(confirmedScores)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { listConfirmed }
