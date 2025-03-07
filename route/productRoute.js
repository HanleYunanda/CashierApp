const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const verifyJWT = require('../middleware/verifyJwt')

router.use(verifyJWT)

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct)

router.route('/:id').put(productController.updateProduct)
    .delete(productController.deleteProduct)

module.exports = router