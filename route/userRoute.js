const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const userValidator = require('../validator/userValidator')

router.route('/')
    .get(userController.getAllUsers)
    .post(userValidator, userController.createUser)

router.route('/:id').put(userValidator, userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router