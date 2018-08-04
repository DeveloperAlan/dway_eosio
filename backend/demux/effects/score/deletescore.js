function deleteScore (state, payload, blockInfo, context) {
  const score = {
    _id: {
      timestamp: payload.data.timestamp,
      author: payload.data.author
    }
  }
  context.socket.emit('deletescore', score)
}

module.exports = deleteScore
