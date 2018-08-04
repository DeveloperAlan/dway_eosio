const blog = require('./blog')
const score = require('./score')
const location = require('./location')

module.exports = [
  ...blog,
  ...score,
  ...location
]
