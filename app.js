const express = require('express')
const https = require('https')

exports.createApp = () => {
  const app = express()
  app.use(express.json())

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN)
    next()
  })

  app.get('/', (req, res) => {
    res.send('Hello World')
  })

  app.get('/games', (req, res) => {
    fetchGameList((gameList) => res.json(cleanGameList(gameList)))
  })

  const fetchGameList = (callback) => {
    const requestPath = `https://itch.io/api/1/${process.env.ITCHIO_API_KEY}/my-games`

    https.get(requestPath, (res) => {
      var body = ''

      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        if(res.statusCode != 200) {
          console.log(`API call failed with code ${res.statusCode}`)
          callback(null)
        }
        else {
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

  const cleanGameList = (apiResponse) => {
    if (apiResponse === null)
      return []

    const publishedGames = apiResponse.games.filter((gameInfo) => gameInfo.hasOwnProperty('published_at'))
    let gameList = publishedGames.map((gameInfo) => {
      return {
        title: gameInfo.title,
        short_text: gameInfo.short_text,
        url: gameInfo.url,
        cover_url: gameInfo.cover_url,
        has_web_build: gameInfo.type === 'html',
        created_at: gameInfo.created_at,
        published_at: gameInfo.published_at,
        views_count: gameInfo.views_count,
        downloads_count: gameInfo.downloads_count,
        p_windows: gameInfo.p_windows,
        p_osx: gameInfo.osx,
        p_linux: gameInfo.linux
      }
    })
    return gameList
  }
    
  return app
}