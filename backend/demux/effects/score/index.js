const createScore = require('./createscore')
const deleteScore = require('./deletescore')
const editScore = require('./editscore')

const account = process.env.EOSIO_SCORE_CONTRACT_ACCOUNT

module.exports = [
  {
    actionType: `${account}::createscore`, // account::action name
    effect: createScore
  },
  {
    actionType: `${account}::deletescore`,
    effect: deleteScore
  },
  {
    actionType: `${account}::editscore`,
    effect: editScore
  }
]
