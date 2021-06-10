const router = require('express').Router()
const controller = require('../controllers/file.controller')
const { fileUpload } = require('../middlewares/upload')
const { jwtAuthenticationMiddlewares, isAuthenticatedMiddlewares } = require('../middlewares/auth')

router.use(require('../middlewares/session'))
router.use(jwtAuthenticationMiddlewares)

router.post('/addFile', isAuthenticatedMiddlewares, fileUpload, controller.UploadFile)
router.post('/share/file', isAuthenticatedMiddlewares, controller.shareFile)
router.get('/downloadFile/:_id', isAuthenticatedMiddlewares, controller.downloadFile)
router.get('/files', isAuthenticatedMiddlewares, controller.getUserFiles)
router.get('/sharedFiles', isAuthenticatedMiddlewares, controller.sharedFiles)
router.get('/deleteFile/:_id', isAuthenticatedMiddlewares, controller.deleteFileById)
router.delete('/deleteAllFiles', isAuthenticatedMiddlewares, controller.dangerousDelete)

module.exports = router