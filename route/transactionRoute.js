const express = require('express')
const router = express.Router()
const transactionController = require('../controller/transactionController')
const verifyJWT = require('../middleware/verifyJwt')

router.use(verifyJWT)

router.route('/')
    .get(transactionController.getAllTransactions)
    .post(transactionController.createTransaction)

// router.route('/:id').put(transactionController.updateProduct)
//     .delete(transactionController.deleteProduct)

module.exports = router