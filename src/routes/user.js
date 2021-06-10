const router = require('express').Router()
const { createUser, readUser, addFile, forgotPassword, sendOtp } = require('../controllers/user.controller')
const { jwtLogin, jwtAuthenticationMiddlewares, isAuthenticatedMiddlewares, jwtLogout, jwtLogoutAll } = require('../middlewares/auth') 
const authenticateOtp = require('../middlewares/otpAuth') 

router.use(require('../middlewares/session'))
router.post('/addNewUser', createUser)
router.post('/getOtp', sendOtp)
router.post('/password/reset', authenticateOtp, forgotPassword)
router.post('/user/login', jwtLogin)
router.use(jwtAuthenticationMiddlewares)

router.get('/' ,(req, res) => {
    if(!req.user) {
        res.render('index', {
            navbar: [
                { link: '/login', name: 'login', id: 'login' },
                { link: '/signup', name: 'create account', id: 'signup' },
            ]
        })
    } else {
        res.render('viewFiles',{
            navbar: [
                { link: '/shared', name: 'shared', id: 'shared' },
                { link: '/profile', name: 'profile', id: 'profile' },
                { link: '/upload/file', name: 'upload', id: 'upload' },
                { link: '', name: 'dump file-box', id: 'deleteAll' },
                { link: '/logout', name: 'logout', id: 'logout' },
            ]
        })
    }
 })

 router.get('/shared', (req, res, next)=>{
    if(req.user){
       return res.render('shared', {
           navbar: [
                { link: '/', name: 'myfiles', id: 'myfiles' },
                { link: '/profile', name: 'profile', id: 'profile' },
                { link: '/upload/file', name: 'upload', id: 'upload' },
                { link: '', name: 'dump file-box', id: 'deleteAll' },
                { link: '/logout', name: 'logout', id: 'logout' },
           ]
       })
    } 
    return res.redirect('/')
})

 router.get('/login', (req, res, next)=>{
     if(!req.user){
        return res.render('login', {
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
            navbar: [
                { link: '/', name: 'home', id: 'home' },
                { link: '/login', name: 'login', id: 'login' },
            ]
        })
    } 
    return res.redirect('/')
})

router.get('/forgotPassword', (req, res, next) => {
    if(!req.user){
        return res.render('forgotPassword', {
            navbar: [
                { link: '/', name: 'home', id: 'home' },
                { link: '/login', name: 'login', id: 'login' },
                { link: '/signup', name: 'create account', id: 'signup' },
            ]
        })
    } 
    return res.redirect('/')
})

router.get('/resetPassword', (req, res, next) => {
    if(!req.user){
        return res.render('resetPassword', {
            navbar: [
                { link: '/', name: 'home', id: 'home' },
                { link: '/login', name: 'login', id: 'login' },
                { link: '/signup', name: 'create account', id: 'signup' },
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