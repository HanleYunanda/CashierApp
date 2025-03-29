const Product = require('../model/Product')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator')
const { deleteFile } = require('../utils/fileHandler');

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().lean()

    return res.status(200).json(products)
})

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, active } = req.body
    const errors = validationResult(req)
    const imageFile = req.file;
    let filePath = null;

    // Validation express-validator
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, error) => {
            if (!acc[error.path]) {
                acc[error.path] = error.msg;
            }
            return acc;
        }, {});
        deleteFile(imageFile.path);
        return res.status(400).json({
            message: "Data is invalid",
            errors: formattedErrors
        })
    }

    // Validation image
    if(imageFile) {
        filePath = imageFile.path.replace('public\\', '');
    } else {
        return res.status(400).json({
            message: "Failed to upload image",
        })
    }

    // Validation duplicate
    const duplicate = await Product.findOne({name}).lean().exec()
    if(duplicate) {
        deleteFile(imageFile.path);
        return res.status(400).json({ message: `Product with name ${duplicate.name} already exist` })
    }

    const created = await Product.create({ name, price, active, image: filePath })
    if(!created) {
        deleteFile(imageFile.path);
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
    const imageFile = req.file
    let filePath = null

    const errors = validationResult(req)
    
    // Validation express-validator
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, error) => {
            if (!acc[error.path]) {
                acc[error.path] = error.msg;
            }
            return acc;
        }, {});
        if(imageFile) deleteFile(imageFile.path);
        return res.status(400).json({
            message: "Data is invalid",
            errors: formattedErrors
        })
    }
    
    if(mongoose.Types.ObjectId.isValid(productId)) {
        productId = new mongoose.Types.ObjectId(productId)
    } else {
        if(imageFile) deleteFile(imageFile.path);
        return res.status(400).json({ message: `Product Id ${productId} is not valid` })
    }
    
    let product = await Product.findById(productId)
    if(!product) {
        if(imageFile) deleteFile(imageFile.path);
        return res.status(400).json({ message: `Product with Id ${productId} not found` })
    }
    
    let updated = null;
    try {
        product.name = newData.name
        product.price = newData.price
        product.active = newData.active
        product.image = imageFile ? imageFile.path.replace('public\\', '') : product.image;
        updated = await product.save()
    } catch (error) {
        if(imageFile) deleteFile(imageFile.path);
        return res.status(500).json({
            message: `Update product failed`,
            error
        });
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

const getProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    let product = null;
    try {
        product = await Product.findById(new mongoose.Types.ObjectId(id)).lean().exec();
    } catch (error) {
        return res.status(400).json({ message: `Product Id ${productId} is not valid` })
    }
    if(!product) {
        return res.status(400).json({ message: `Product Id ${productId} is not found` })
    }

    return res.status(200).json(product);
})

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
}