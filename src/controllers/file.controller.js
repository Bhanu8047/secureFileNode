const File = require('../models/file')
const path = require('path')
const crypto = require('crypto')
require('dotenv').config()
const fs = require('fs')

// MiddleWares
const { encryption, decryption } = require('../middlewares/aes')
const {
    CIPHER_PASS_KEY
} = process.env


module.exports.UploadFile = async (req, res, next) => {
    const file = new File()
    file.password = crypto.createHash('sha256').update(String(CIPHER_PASS_KEY)).digest('base64').substr(0, 32);
    file.path = req.filePath
    file.owner = req.user._id
    file.extension = req.extension
    try {
        encryption(req.originalPath, file.password, async (err,data)=>{
            if(err)
                return res.json({
                    success: false,
                    message: 'could not upload.',
                    err
                })
            await file.save()
            res.json({
                success: true,
                message: 'file uploaded successfully.'
            })
        })  
    } catch (error) {
        res.json({
            success: false,
            message: 'Could not upload this file.'
        })
    }
}


module.exports.downloadFile = async (req, res, next) => {
    const { _id } = req.params
    try {
        const file = await File.findById(_id)
        if(!file) return res.render('404',{
            navbar: [
                { link: '/profile', name: 'profile', id: 'profile' },
                { link: '/upload/file', name: 'upload', id: 'upload' },
                { link: '/files', name: 'file-box', id: 'file-box' },
                { link: '/logout', name: 'logout', id: 'logout' },
            ]
        })
        decryption(file.path.split('/')[2], file.password, file.extension, (err,data)=>{
            if(err)
                return res.json({
                    success: false,
                    message: 'could not download this file.',
                    err
                })
            res.download(path.join(__dirname,'../../files/download')+file.extension)
        })
    } catch (error) {
        return res.json({
            message:'could not download this file.',
            error
        })
    }
}

module.exports.getUserFiles = async (req, res, next) => {
    try {
        const files = await File.find({owner : req.user._id})
        const newFiles = []
        files.forEach(file => {
            const fileObj = {
                filename: file.path.split('/')[2]+file.extension,
                _id: file._id,
                createdAt: file.createdAt
            }
            newFiles.push(fileObj)
        })
        if(newFiles.length === 0) return res.render('viewFiles',{
            files: null,
            navbar: [
                { link: '/profile', name: 'profile', id: 'profile' },
                { link: '/upload/file', name: 'upload', id: 'upload' },
                { link: '', name: 'dump file-box', id: 'deleteAll' },
                { link: '/logout', name: 'logout', id: 'logout' },
            ]
        })
        res.render('viewFiles',{
            files: newFiles,
            navbar: [
                { link: '/profile', name: 'profile', id: 'profile' },
                { link: '/upload/file', name: 'upload', id: 'upload' },
                { link: '', name: 'dump file-box', id: 'deleteAll' },
                { link: '/logout', name: 'logout', id: 'logout' },
            ]
        })
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            _error: error._message
        })
    }
}


module.exports.deleteFileById = async (req, res, next) => {
    const { _id } = req.params
    try {
        const file = await File.findById(_id)
        if(!file) {
            return res.status(404).render('404',{
                navbar: [
                    { link: '/profile', name: 'profile', id: 'profile' },
                    { link: '/upload/file', name: 'upload', id: 'upload' },
                    { link: '/files', name: 'file-box', id: 'file-box' },
                    { link: '/logout', name: 'logout', id: 'logout' },
                ]
            })
        }
        fs.unlink(path.join(__dirname,'../../'+file.path), async (err)=>{
            if(err) {
                next(err)
            } else {
                await file.remove()
                res.redirect('/files')
            }
        })
    } catch (error) {
        next(error)
    }
}


module.exports.dangerousDelete = async (req, res, next) => {
    try {
        const files = await File.deleteMany({})
        fs.readdir(path.join(__dirname,'../../files'), (err, filesDic) => {
            if(err) {
                throw err
            } else {
                for (const file of filesDic) {
                    fs.unlink(path.join(path.join(__dirname,'../../files'), file), async (err) => {
                        if(err) {
                            throw err
                        }
                    })
                }
            }
          })
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
}