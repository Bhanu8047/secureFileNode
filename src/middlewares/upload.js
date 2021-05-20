const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./files")
    },
    filename: function(req, file, callback) {
        const fileName = req.body.filename
        const owner = req.user._id
        const extension = path.extname(file.originalname).toLowerCase()
        const filePath = fileName + '-' + owner + extension
        req.filePath = './files/' + filePath
        callback(null, filePath)
    }
})
const maxFileSize = 5 * 1000 * 1000;

const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize },
    fileFilter: function (req, file, callback) {
        let fileTypes = /jpeg|png|jpg|pdf|txt/
        let mimetype = fileTypes.test(file.mimetype)
        let extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        mimetype && extname ? callback(null, true) : callback("Error: File type not matched. Allowed types - "+fileTypes)
    }
})

module.exports = upload