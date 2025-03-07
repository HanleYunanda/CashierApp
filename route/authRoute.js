const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.route('/login').post(authController.login)
router.route('/refresh').post(authController.refresh)
router.route('/logout').post(authController.logout)

module.exports = router