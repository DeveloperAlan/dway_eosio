const createScore = require('./createscore')
const deleteScore = require('./deletescore')
const editScore = require('./editscore')

const account = process.env.EOSIO_SCORE_CONTRACT_ACCOUNT

module.exports = [
  {
    actionType: `${account}::createscore`, // account::action name
    updater: createScore
  },
  {
    actionType: `${account}::deletescore`,
    updater: deleteScore
  },
  {
    actionType: `${account}::editscore`,
    updater: editScore
  }
]
