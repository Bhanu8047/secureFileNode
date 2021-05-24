const router = require('express').Router()
const File = require('../models/file')
const upload = require('../middlewares/upload')
const { encryption, decryption } = require('./aes')
const path = require('path')
const crypto = require('crypto')


router.post('/addFile', upload.single('filetoupload') ,async (req, res, next) => {
    // console.log(req.body)
    const file = new File()
    file.password = crypto.randomBytes(8).toString('hex')
    file.filename = req.body.filename
    file.path = req.filePath
    file.extension = req.extension
    const filePath = req.originalPath
    if(encryption(filePath, file.password)) file.encrypted = true
    // decryption(filePath)
    try {
        await file.save()
        res.json({
            success: true,
            file
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'Could not upload file.',
            _error: error._message
        })
    }
})

router.get('/downloadFile/:name', async (req, res, next) => {
    console.log(req.params)
    try {
        const file = await File.findOne({filename: req.params.name})
        if(!file) return res.json({
            message: 'File not found by this name.'
        })
        const dir = path.join(__dirname,'../../files/')
        
        decryption(file.filename+'-'+'bhanu', file.password, file.extension) 
        res.download(dir+'temp'+file.extension)

    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            _error: error._message
        })
    }
})
router.get('/getAllFiles', async (req, res, next) => {
    try {
        const files = await File.find({})
        if(files.length === 0) return res.json({
            message: 'No files found.'
        })
        return res.json({
            files,
            message:'Success'
        })
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            _error: error._message
        })
    }
})

module.exports = router