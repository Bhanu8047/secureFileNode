const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { createUser, readUser, addFile } = require('../controllers/user.controller')
const { jwtLogin, jwtAuthenticationMiddlewares, isAuthenticatedMiddlewares, jwtLogout, jwtLogoutAll } = require('../middlewares/auth') 

router.post('/addNewUser', createUser)
router.use(require('../middlewares/session'))
router.post('/user/login', jwtLogin)
router.use(jwtAuthenticationMiddlewares)

router.get('/' ,(req, res) => {
    if(!req.user) {
        res.render('index', {
            title: 'Secure Node File Sharing.',
            footerNote: 'powered By Bits Ke PAPA\'s',
            navbar: [
                { link: '/login', name: 'login', id: 'login' },
                { link: '/signup', name: 'create account', id: 'signup' },
            ]
        })
    } else {
        res.render('viewFiles',{
            navbar: [
                { link: '/profile', name: 'profile', id: 'profile' },
                { link: '/upload/file', name: 'upload', id: 'upload' },
                { link: '', name: 'dump file-box', id: 'deleteAll' },
                { link: '/logout', name: 'logout', id: 'logout' },
            ]
        })
    }
 })

 router.get('/login', (req, res, next)=>{
     if(!req.user){
        return res.render('login', {
            title: 'Secure Node File Sharing.',
            footerNote: 'powered By Bits Ke PAPA\'s',
            navbar: [
                { link: '/', name: 'home', id: 'home' },
                { link: '/signup', name: 'create account', id: 'signup' },
            ]
        })
     } 
     return res.redirect('/')
})

router.get('/signup', (req, res, next)=>{
    if(!req.user){
        return res.render('signup', {
            title: 'Secure Node File Sharing.',
            footerNote: 'powered By Bits Ke PAPA\'s',
            navbar: [
                { link: '/', name: 'home', id: 'home' },
                { link: '/login', name: 'login', id: 'login' },
            ]
        })
    } 
    return res.redirect('/')
})
// router.post()
router.post('/logout', isAuthenticatedMiddlewares, jwtLogout)
router.post('/logout/all', isAuthenticatedMiddlewares, jwtLogoutAll)

router.get('/upload/file', isAuthenticatedMiddlewares , addFile)

router.route('/profile')
.get( isAuthenticatedMiddlewares , readUser)

module.exports = router