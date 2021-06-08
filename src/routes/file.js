const router = require('express').Router()
const File = require('../models/file')
const upload = require('../middlewares/upload')
const { encryption, decryption } = require('./aes')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')


router.post('/addFile', upload.single('filetoupload') ,async (req, res, next) => {
    // console.log(req.body)
    const file = new File()
    let key = 'MySuperSecretKey';
    file.password = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
    file.path = req.filePath
    file.extension = req.extension
    const filePath = req.originalPath

    if(encryption(filePath, file.password)) file.encrypted = true
    // decryption(filePath)
    try {
        await file.save()
        res.json({
            success: true,
            message: 'successfully uploaded file.'
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'Could not upload file.'
        })
    }
})

router.get('/downloadFile', async (req, res, next) => {
    console.log(req.params)
    const { _id } = req.body.id
    try {
        const file = await File.findById(_id)
        if(!file) return res.json({
            message: 'File not found by this name.'
        })
        const dir = path.join(__dirname,'../../files/')
        const filename = file.path.split('/')[2]
        decryption(filename, file.password, file.extension, (err,ready)=>{
            if(err)
                return res.json({
                    success: false,
                    message: 'could not download.',
                    err
                })
            res.download(dir+'download'+file.extension)
        })
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            error
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

router.get('/deleteAllFiles', async (req, res, next) => {
    try {
        const files = await File.deleteMany({})

        return files.n > 0 ? 
         res.json({
            files,
            message:'All files Deleted',
         }) : 
         res.json({
            files,
            message:'No files Found',
         })
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            _error: error._message
        })
    }
})

module.exports = router