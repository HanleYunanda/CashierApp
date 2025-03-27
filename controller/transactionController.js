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

const getProductReport = null;

const getTransactionReport = asyncHandler(async (req, res) => {
    let { periodStart, periodEnd } = req.body;
    periodStart = moment(periodStart).toDate();
    periodEnd = moment(periodEnd).toDate();

    const transactions = await Transaction.find({
        createdAt: {
            $gte: periodStart,
            $lte: periodEnd,
        }
    });

    const productsReport = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: periodStart,
                    $lte: periodEnd,
                }
            }
        },
        {
            $unwind: "$transactionDetails"
        },
        {
            $group: {
              _id: "$transactionDetails.productId", // Group by productId
              totalQuantity: { $sum: "$transactionDetails.quantity" },  // Sum of quantity for each product
              totalSubTotal: { $sum: "$transactionDetails.subTotal" }   // Sum of subTotal for each product

            }
        },
        {
            $sort: { totalSubTotal: -1 }
        },
        {
            $lookup: {
                from: "products",  // The collection you want to join with
                localField: "_id",  // The field in the current collection (Transaction) to join on
                foreignField: "_id",  // The field in the "products" collection to join on
                as: "product"  // The name of the new array field that will contain the joined documents
            }
        },
        {
            $unwind: {
                path: "$product",  // Unwind the productDetails array so that we can access the fields directly
                preserveNullAndEmptyArrays: true  // Optionally preserve entries where no matching product was found
            }
        },
        {
            $project: {
                productId: "$_id",  // Include the productId in the final result
                productName: "$product.name",  // Assuming the product collection has a "name" field
                totalQuantity: 1,
                totalSubTotal: 1,
                _id: 0,
            }
        }
    ]).exec();

    const salesReport = await Transaction.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: periodStart,
                    $lte: periodEnd
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },  // Extract year from createdAt
                    month: { $month: "$createdAt" }  // Extract month from createdAt
                },
                transactionCount: { $sum: 1 }  // Count number of transactions
            }
        },
        {
            $project: {
                _id: {
                    $concat: [
                        { $toString: "$_id.year" },
                        "-",
                        {
                            $cond: {
                                if: {
                                    $lt: ["$_id.month", 10]
                                },
                                then: {
                                    $concat: ["0", { $toString: "$_id.month" }]
                                },
                                else: {
                                    $toString: "$_id.month"
                                }
                            }
                        }
                    ]
                },
                transactionCount: 1
            }
        }
    ]).exec();
    
    return res.status(200).json({ transactions, salesReport, productsReport });
});

module.exports = {
    getAllTransactions,
    createTransaction,
    getTransactionReport
};