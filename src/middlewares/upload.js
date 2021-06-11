const multer = require('multer')
const path = require('path')
require('dotenv').config()

const getDateTime = ()=>{
    var date = new Date()
    const fullDate = {
        date: date.getDate(),
        month: date.getMonth()+1,
        year: date.getFullYear(),
        time: {
            hh: date.getHours(),
            mm: date.getMinutes(),
            ss: date.getSeconds()
        }
    }
    
    return `${fullDate.year}-${fullDate.month}-${fullDate.date}T${fullDate.time.hh}-${fullDate.time.mm}.${fullDate.time.ss}Z`
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./files")
    },
    filename: function(req, file , callback) {
        // const fileName = filename
        // console.log(fileName)
        const owner = req.user.username
        const extension = path.extname(file.originalname).toLowerCase()
        const filePath = owner+'-'+ getDateTime()
        req.extension = extension
        req.originalPath = filePath
        req.filePath = './files/' + filePath
        callback(null, filePath)
    }
})
const maxFileSize = process.env.MAX_UPLOAD_SIZE

const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize },
    fileFilter: function (req, file, callback) {
        // let fileTypes = /.txt/
        // let mimetype = fileTypes.test(file.mimetype)
        // let extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        // mimetype && extname ? callback(null, true) : callback("Error: File type not matched. Allowed types - "+fileTypes)
        callback(null, true)
    }
}).single('filetoupload')



module.exports.fileUpload = async (req, res, next) =>{
    upload(req, res, err => {
        if(err) {
            if(err.code == 'LIMIT_FILE_SIZE') {
                return res.json({
                    success: false,
                    message: 'File size Large. Expected < 5MB'
                })
            }
        }
        next()   
    })
}