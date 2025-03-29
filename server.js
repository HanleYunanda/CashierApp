require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const connectDb = require('./config/dbConfig')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3500
connectDb()

// Middleware
app.use(logger)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

// Route
app.use('/', require('./route/root'))

app.use('/auth', require('./route/authRoute'))
app.use('/product', require('./route/productRoute'))
app.use('/user', require('./route/userRoute'))
app.use('/transaction', require('./route/transactionRoute'))

app.all('*', (req, res) => {
    res.status(404).json({message: "404 Not Found"})
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})