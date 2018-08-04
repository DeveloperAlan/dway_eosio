const express = require('express')
const locationController = require('./location.controller')

const router = express.Router()

router.route('/').get(locationController.listConfirmed)

module.exports = router
