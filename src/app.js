const http = require('http')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const path = require('path')
const hbs = require('hbs')
const app = express()
require('./db/db')

let PORT = process.env.PORT || 4000

app.use(cors())
app.use(helmet())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname,'../public')))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname,'../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

app.use(require('./routes/user'))
app.use(require('./routes/file'))
const server = http.createServer(app)

app.all('*', async (req, res, next) => {
    res.render('404',{
        navbar: [
            { link: '/', name: 'home', id: 'home' },
        ]
    })
})

server.listen(PORT, (e)=> {
    console.log(`Server on http://localhost:${PORT}`)
})