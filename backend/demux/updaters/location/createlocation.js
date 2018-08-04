async function createLocation (state, payload, blockInfo, context) {
  const Location = state.location
  try {
    let location = await Location.find(
      {
        _id: {
          timestamp: payload.data.timestamp,
          author: payload.data.author
        }
      }
    ).exec()

    // if post already exists do not insert it in again
    if (location.length !== 0) return

    location = new Location(
        {
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
    )
    await location.save()
  } catch (err) {
    console.error(err)
  }
}

module.exports = createLocation
