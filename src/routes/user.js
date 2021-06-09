const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { createUser, readUser, addFile } = require('../controllers/user.controller')
const { jwtLogin, jwtAuthenticationMiddlewares, isAuthenticatedMiddlewares, jwtLogout, jwtLogoutAll } = require('../middlewares/auth') 

router.post('/addNewUser', createUser)
router.use(require('../middlewares/session'))
router.post('/user/login', jwtLogin)
router.use(jwtAuthenticationMiddlewares)
// router.post()
router.post('/logout', isAuthenticatedMiddlewares, jwtLogout)
router.post('/logout/all', isAuthenticatedMiddlewares, jwtLogoutAll)

router.get('/upload/file', isAuthenticatedMiddlewares , addFile)

router.route('/profile')
.get( isAuthenticatedMiddlewares , readUser)

module.exports = router