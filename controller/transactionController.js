const express = require('express');
const asyncHandler = require('express-async-handler');
const Transaction = require('../model/Transaction');
const moment = require('moment');
const Product = require('../model/Product');

const getAllTransactions = asyncHandler(async (req, res) => {
    const transtactions = await Transaction.find({}).lean().exec();

    return res.status(200).json(transtactions);
})

const createTransaction = asyncHandler(async (req, res) => {
    const transaction = req.body;
    // return res.status(500).json({ transaction });
    /*
        {
            "transactionCode":"TR/250318/003", // tidak ada
            "totalPrice":48000,
            "createdBy": "67c99a165a6b108703b0f3c9", // tidak ada
            "transactionDetails":[
                {
                    "productId":"67cea3288b996727b20d6b32",
                    "quantity":2,
                    "pricePerUnit":24000,
                    "subTotal":48000
                }
                {
                    id:"67c85f423da9d052a2ea8394"
                    name:"CAFE LATTE"
                    price:20000
                    quantity:1
                }
            ]
        }
        
    */

    // createdBy Validation
    if(transaction.createdBy != req.user.id) {
        return res.status(500).json({ message: "Cashier employee not found" });
    }

    // transactionDetails Validation
    for(const detail of transaction.transactionDetails) {
        const checkProduct = await Product.findById(detail.productId).exec();
        if(!checkProduct) {
            return res.status(500).json({ message: `Product with Id ${detail.productId} not found` });
        }
        detail.subTotal = detail.pricePerUnit * detail.quantity;
    }

    // Generate Transaction Code
    const today = moment().format('YYMMDD');
    let transactionCode = "TR/" + today + '/';
    const lastest = await Transaction
        .findOne({ transactionCode: { $regex: `^${transactionCode}` } })
        .sort({ transactionCode: -1 })
        .exec();
    if(lastest) {
        let digit = parseInt(lastest.transactionCode.split('/')[2]);
        ++digit;

        digit = digit.toString().padStart(3, '0');
        transactionCode = "TR/" + today + '/' + digit;
    } else {
        transactionCode = transactionCode + '001';
    }

    transaction.transactionCode = transactionCode;

    // Create Transaction
    try {
        console.log(transaction)
        const created = await Transaction.create(transaction);
    } catch (error) {
        return res.status(500).json({ message: "Create new transaction failed", error: error });
    }

    return res.status(201).json({
        message: "Successfully create new transaction",
        data: created
    });
})

module.exports = {
    getAllTransactions,
    createTransaction
};