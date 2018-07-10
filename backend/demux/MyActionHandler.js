const {
  handlers: { AbstractActionHandler }
} = require("demux");

const state = { volumeBySymbol: {}, totalTransfers: 0 }; // Initial state

class ObjectActionHandler extends AbstractActionHandler {
  async handleWithState(handle) {
    await handle(state);
  }
}

module.exports = ObjectActionHandler;
