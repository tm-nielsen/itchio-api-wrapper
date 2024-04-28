const {createApp} = require('./app')

const dotenv = require('dotenv')
dotenv.config()

const expressApp = createApp()
expressApp.listen(8080)