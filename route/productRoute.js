const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const verifyJWT = require('../middleware/verifyJwt')
const productValidator = require('../validator/productValidator')
const upload = require('../config/multerConfig')

router.use(verifyJWT)

router.route('/')
    .get(productController.getAllProducts)
    .post(upload.single('imageFile'), productValidator, productController.createProduct)

router.route('/:id')
    .put(upload.single('imageFile'), productValidator, productController.updateProduct)
    .delete(productController.deleteProduct)
    .get(productController.getProduct)

module.exports = router