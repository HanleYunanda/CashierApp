const mongoose = require('mongoose')

const transactionDetailSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        pricePerUnit: {
            type: Number,
            required: true
        },
        subTotal: {
            type: Number,
            required: true
        }
    }
)

const transactionSchema = new mongoose.Schema(
    {
        transactionCode: {
            type: String,
            required: true,
            unique: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        transactionDetails: [transactionDetailSchema]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Transaction', transactionSchema)