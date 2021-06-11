const File = require('../models/file')
const User = require('../models/user')
const path = require('path')
const crypto = require('crypto')
const { nanoid } = require('nanoid')
const fs = require('fs')
const { tokenizeKey, getHashedKey } = require('../middlewares/keyEnc')

// MiddleWares
const { encryption, decryption } = require('../middlewares/aes')

module.exports.UploadFile = async (req, res, next) => {
    const file = new File()
    const key = crypto.createHash('sha256').update(String(nanoid(16))).digest('base64').substr(0, 32);
    file.password = tokenizeKey({_key_: key.toString()})
    file.path = req.filePath
    file.owner = req.user._id
    file.extension = req.extension
    try {
        encryption(req.originalPath, key, async (err,data)=>{
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
                { link: '/', name: 'file-box', id: 'file-box' },
                { link: '/logout', name: 'logout', id: 'logout' },
            ]
        })
        const { _key_ } = getHashedKey(file.password)
        decryption(file.path.split('/')[2], _key_, file.extension, (err,data)=>{
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
        return res.json({
            success: true,
            files: newFiles,
            message: 'files fetched'
        })
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            _error: error._message
        })
    }
}

module.exports.sharedFiles = async (req, res, next) => {
    try {
        const files = await File.find({'shared.email' : req.user.email})
        const newFiles = []
        files.forEach(file => {
            const fileObj = {
                filename: file.path.split('/')[2]+file.extension,
                _id: file._id,
                createdAt: file.createdAt
            }
            newFiles.push(fileObj)
        })
        return res.json({
            success: true,
            files: newFiles,
            message: 'files fetched'
        })
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            error: error._message
        })
    }
}

module.exports.shareFile = async (req, res, next) => {
    try {
        const { _id, email } = req.body
        const file = await File.findById(_id)
        const user = await User.findOne({email})
        if(!user) {
            return res.redirect('/')
        }
        file.shared = file.shared.concat({email})
        await file.save()
        res.redirect('/')
    } catch (error) {
        return res.json({
            message:'Something went wrong.',
            error: error
        })
    }
}

module.exports.deleteFileById = async (req, res, next) => {
    const { _id } = req.params
    try {
        const file = await File.findOne({ _id, owner: req.user._id })
        if(!file) {
            return res.status(404).render('404',{
                navbar: [
                    { link: '/profile', name: 'profile', id: 'profile' },
                    { link: '/upload/file', name: 'upload', id: 'upload' },
                    { link: '/', name: 'file-box', id: 'file-box' },
                    { link: '/logout', name: 'logout', id: 'logout' },
                ]
            })
        }
        fs.unlink(path.join(__dirname,'../../'+file.path), async (err)=>{
            if(err) {
                next(err)
            } else {
                await file.remove()
                res.redirect('/')
            }
        })
    } catch (error) {
        next(error)
    }
}


module.exports.dangerousDelete = async (req, res, next) => {
    try {
        const filestoDelete = await File.find({ owner: req.user._id })
        for (const file of filestoDelete) {
            fs.unlink(path.join(path.join(__dirname,'../../'), file.path), async (err) => {
                if(err) {
                    throw err
                }
            })
        }
        const files = await File.deleteMany({ owner: req.user._id })
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