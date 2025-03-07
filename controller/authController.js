const User = require('../model/User')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Validation duplicate
    const user = await User.findOne({ email }).exec()
    if(!user) {
        return res.status(400).json({ message: `Invalid credentials` })
    }

    pwIsValid = await bcrypt.compare(password, user.password)
    if(!pwIsValid) {
        return res.status(400).json({ message: `Invalid credentials` })
    }

    // Create Access Token
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )

    // Create Refresh Token
    const refreshToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    // Inject Refresh Token to Cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 24 * 60 * 60 * 1000 //cookie expiry: set to match refresh token expiry
    })

    return res.status(200).json({
        message: "Login success",
        accessToken
    })
})

const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.jwt

    if(!refreshToken) {
        return res.status(401).json({ message: "No token provided" })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, user) => {
        if(err) {
            return res.status(403).json({ message: "Invalid token" })
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        )

        return res.status(200).json({
            message: "Token refreshed",
            accessToken
        })
    }))
})

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Logout success' })
})

module.exports = {
    login,
    refresh,
    logout
}