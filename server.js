const express = require('express')
const cors = require('cors')
const path = require('path')
const fetchRouter = require('./api/fetch/index')


require('dotenv').config()


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/fetch', fetchRouter)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port "http://127.0.0.1:${PORT}"`)
})
