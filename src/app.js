const http = require('http')
require('./db/db')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const path = require('path')
const hbs = require('hbs')

const app = express()

let PORT = process.env.PORT || 4000

app.set('trust proxy',true)
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

app.all('*', async (req, res, next) => {
    res.render('404',{
        navbar: [
            { link: '/', name: 'home', id: 'home' },
        ]
    })
})

const server = http.createServer(app)
server.listen(PORT, (e)=> {
    console.log(`Server on http://localhost:${PORT}`)
})