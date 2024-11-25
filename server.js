const cors = require('cors')
const path = require('path')
const express = require('express')
require('dotenv').config()

const fetchRouter = require('./api/fetch/index')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname)))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// API Routes
app.use('/api/fetch', fetchRouter)

app.listen(PORT, () => {
  console.log(`Server running on port "http://127.0.0.1:${PORT}"`)
})
