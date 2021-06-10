const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { createUser, readUser, addFile } = require('../controllers/user.controller')
const { jwtLogin, jwtAuthenticationMiddlewares, isAuthenticatedMiddlewares, jwtLogout, jwtLogoutAll, isAuthenticatedOrNot } = require('../middlewares/auth') 

router.post('/addNewUser', createUser)
router.use(require('../middlewares/session'))
router.post('/user/login', jwtLogin)
router.use(jwtAuthenticationMiddlewares)

router.get('/', isAuthenticatedOrNot ,(req, res) => {
    res.render('index', {
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s',
        navbar: [
            { link: '/login', name: 'login', id: 'login' },
            { link: '/signup', name: 'create account', id: 'signup' },
        ]
    })
 })

 router.get('/login', isAuthenticatedOrNot, (req, res, next)=>{
    res.render('login', {
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s',
        navbar: [
            { link: '/', name: 'home', id: 'home' },
            { link: '/signup', name: 'create account', id: 'signup' },
        ]
    })
})

router.get('/signup', isAuthenticatedOrNot, (req, res, next)=>{
    res.render('signup', {
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s',
        navbar: [
            { link: '/', name: 'home', id: 'home' },
            { link: '/login', name: 'login', id: 'login' },
        ]
    })
})
// router.post()
router.post('/logout', isAuthenticatedMiddlewares, jwtLogout)
router.post('/logout/all', isAuthenticatedMiddlewares, jwtLogoutAll)

router.get('/upload/file', isAuthenticatedMiddlewares , addFile)

router.route('/profile')
.get( isAuthenticatedMiddlewares , readUser)

module.exports = router