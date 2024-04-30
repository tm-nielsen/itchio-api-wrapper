const {createApp} = require('./app')

const dotenv = require('dotenv')
dotenv.config()

const expressApp = createApp()
expressApp.listen(process.env.PORT, () =>
  console.log(`express server listening on port ${process.env.PORT}...`))