const express = require("express")
const colors = require('colors')
const path = require('path');
const cors = require('cors')

// Access Environment variables
require('dotenv').config()
colors.enable()

// Import APi routes
const api = require('./api/api')

//  Initialize app with express
const app = express()

// --- Load App Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true // allow cookies and authorization headers
}))
app.use('/static', express.static(path.join(__dirname, 'assets')));


// routes
app.use('/api/v1', api)

module.exports = {
    app,
}