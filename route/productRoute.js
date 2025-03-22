const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const verifyJWT = require('../middleware/verifyJwt')
const productValidator = require('../validator/productValidator')

router.use(verifyJWT)

router.route('/')
    .get(productController.getAllProducts)
    .post(productValidator, productController.createProduct)

router.route('/:id')
    .put(productValidator, productController.updateProduct)
    .delete(productController.deleteProduct)
    .get(productController.getProduct)

module.exports = router