const Product = require('../model/Product')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().lean()

    return res.status(200).json(products)
})

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, active } = req.body

    // Validation duplicate
    const duplicate = await Product.findOne({name}).lean().exec()
    if(duplicate) {
        return res.status(400).json({ message: `Product with name ${duplicate.name} already exist` })
    }

    const created = await Product.create({ name, price, active })
    if(!created) {
        return res.status(500).json({ message: "Create new product failed" })
    }

    return res.status(201).json({
        message: "Successfully create new product",
        data: created
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    let productId = req.params.id
    const newData = req.body

    if(mongoose.Types.ObjectId.isValid(productId)) {
        productId = new mongoose.Types.ObjectId(productId)
    } else {
        return res.status(400).json({ message: `Product Id ${productId} is not valid` })
    }
    
    let product = await Product.findById(productId)
    if(!product) {
        return res.status(400).json({ message: `Product with Id ${productId} not found` })
    }

    let updated = null;
    try {
        product.name = newData.name
        product.price = newData.price
        product.active = newData.active
        updated = await product.save()
    } catch (error) {
        return res.status(500).json({
            message: `Update product failed`,
            error
        })
    }

    return res.status(200).json({
        message: `Product with Id ${updated._id} updated succesfully`,
        data: updated
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    let productId = req.params.id

    if(mongoose.Types.ObjectId.isValid(productId)) {
        productId = new mongoose.Types.ObjectId(productId)
    } else {
        return res.status(400).json({ message: `Product Id ${productId} is not valid` })
    }

    const product = Product.findById(productId)
    if(!product) {
        return res.status(400).json({ message: `Product with Id ${productId} not found` })
    }

    let deleted = null
    try {
        deleted = await product.deleteOne()
    } catch (error) {
        return res.status(500).json({
            message: `Delete product failed`,
            error
        })
    }

    return res.status(200).json({
        message: `Product with Id ${productId} deleted succesfully`,
        data: deleted
    })
})

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
}