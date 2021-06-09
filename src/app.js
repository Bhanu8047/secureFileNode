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

app.get('/', (req, res) => {
   res.render('index', {
       title: 'Secure Node File Sharing.',
       footerNote: 'powered By Bits Ke PAPA\'s',
       navbar: [
           { link: '/login', name: 'login', id: 'login' },
           { link: '/signup', name: 'create account', id: 'signup' },
       ]
   })
})

app.get('/login', (req, res, next)=>{
    res.render('login', {
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s',
        navbar: [
            { link: '/', name: 'home', id: 'home' },
            { link: '/signup', name: 'create account', id: 'signup' },
        ]
    })
})

app.get('/signup', (req, res, next)=>{
    res.render('signup', {
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s',
        navbar: [
            { link: '/', name: 'home', id: 'home' },
            { link: '/login', name: 'login', id: 'login' },
        ]
    })
})

app.use(require('./routes/user'))
app.use(require('./routes/file'))
const server = http.createServer(app)

server.listen(PORT, (e)=> {
    console.log(`Server on http://localhost:${PORT}`)
})