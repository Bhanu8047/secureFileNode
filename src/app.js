const http = require('http')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const bodyParser = require('body-parser')
require('./db/db')


let PORT = process.env.PORT || 4000

app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('', (req, res) => {
    res.send(`
    <h1> MASTI BHARI SHARING</h1>
    `)
})

app.use(require('./routes/file'))
app.use(require('./routes/user'))
const server = http.createServer(app)

server.listen(PORT, (e)=> {
    console.log(`Server on localhost:${PORT}`)
})