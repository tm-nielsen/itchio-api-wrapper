const express = require('express')
const https = require('https')

exports.createApp = () => {
  const app = express()
  app.use(express.json())

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    next()
  })

  app.get('/', (req, res) => {
    res.send('Hello World')
  })

  app.get('/games', (req, res) => {
    fetchGameList((gameList) => res.json(gameList))
  })

  const fetchGameList = (callback) =>{
    const requestPath = `https://itch.io/api/1/${process.env.ITCHIO_API_KEY}/my-games`

    https.get(requestPath, (res) => {
      var body = ''

      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        if(res.statusCode != 200){
          console.log(`API call failed with code ${res.statusCode}`)
          callback(null)
        }
        else{
          console.log('API call successful')
          callback(JSON.parse(body))
        }
      })

      res.on('error', (e) => {
        console.log(`Error: ${e.message}`)
        callback(null)
      })
    })
  }
    
  return app
}