const express = require('express')
const scoreController = require('./score.controller')

const router = express.Router()

router.route('/').get(scoreController.listConfirmed)

module.exports = router
