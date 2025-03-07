const User = require('../model/User')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().lean()

    return res.status(200).json(users)
})

const createUser = asyncHandler(async (req, res) => {
    let newData = req.body
    const errors = validationResult(req)

    // Validation express-validator
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Data is invalid",
            errors: errors.array()
        })
    }

    // Validation duplicate
    const duplicate = await User.findOne({ email: newData.email }).lean().exec()
    if(duplicate) {
        return res.status(400).json({ message: `User with email ${duplicate.email} already exist` })
    }

    // Hash Password
    try {
        newData.password = await bcrypt.hash(newData.password, 10)
    } catch (error) {
        return res.status(500).json({ message: "Fail to hash password" })
    }

    let user = null
    try {
        user = await User.create(newData)
    } catch (error) {
        return res.status(500).json({ message: "Create new user failed" })
    }

    return res.status(201).json({
        message: "Successfully create new user",
        data: user
    })
})

const updateUser = asyncHandler(async (req, res) => {
    let userId = req.params.id
    const newData = req.body
    const errors = validationResult(req)

    // Validation Id
    if(userId) {
        userId = new mongoose.Types.ObjectId(userId)
    } else {
        return res.status(400).json({ message: `User Id ${userId} is not valid` })
    }

    // Validation express-validator
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Data is invalid",
            errors: errors.array()
        })
    }

    const user = await User.findById(userId)
    if(!user) {
        return res.status(400).json({ message: `User with Id ${userId} not found` })
    }

    // Hash Password
    try {
        newData.password = await bcrypt.hash(newData.password, 10)
    } catch (error) {
        return res.status(500).json({ message: "Fail to hash password" })
    }

    let updated = null
    try {
        user.name = newData.name
        user.email = newData.email
        user.password = newData.password
        user.gender = newData.gender
        user.active = newData.active
        updated = await user.save()
    } catch (error) {
        return res.status(500).json({
            message: `Update user failed`,
            error
        })
    }

    return res.status(200).json({
        message: `User with Id ${updated._id} updated succesfully`,
        data: updated
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    let userId = req.params.id

    // Validation Id
    if(userId) {
        userId = new mongoose.Types.ObjectId(userId)
    } else {
        return res.status(400).json({ message: `User Id ${userId} is not valid` })
    }

    const user = await User.findById(userId)
    if(!user) {
        return res.status(400).json({ message: `User with Id ${userId} not found` })
    }

    let deleted = null
    try {
        deleted = await user.deleteOne()
    } catch (error) {
        return res.status(500).json({
            message: `Delete user failed`,
            error
        })
    }

    return res.status(200).json({
        message: `User with Id ${userId} deleted succesfully`,
        data: deleted
    })
})

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}