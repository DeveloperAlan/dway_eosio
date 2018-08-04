const createLocation = require('./createlocation')

const account = process.env.EOSIO_CONTRACT_ACCOUNT

module.exports = [
  {
    actionType: `${account}::createlocat`, // account::action name
    updater: createLocation
  },
]
