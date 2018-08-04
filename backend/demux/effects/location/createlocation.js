function createLocation (state, payload, blockInfo, context) {
  const location = {
    _id: {
      timestamp: payload.data.timestamp,
      author: payload.data.author
    },
    author: payload.data.author,
    user_id: payload.data.user_id,
    name: payload.data.name,
    loc_long: payload.data.loc_long,
    loc_lat: payload.data.loc_lat,
    loc_time: payload.data.loc_time,
    device: payload.data.device,
    sustainability: payload.data.sustainability,
    travel: payload.data.travel,
    on_bus: payload.data.on_bus,
    locationConfirmed: {
      type: payload.data.type,
      default: payload.data.default
    }
  }
  context.socket.emit('createlocat', location)
}

module.exports = createLocation
