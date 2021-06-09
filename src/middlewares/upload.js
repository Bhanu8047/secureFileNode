const multer = require('multer')
const path = require('path')

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
        // const owner = req.user._id
        const owner = 'user1'
        const extension = path.extname(file.originalname).toLowerCase()
        const filePath = owner+'-'+ getDateTime()
        req.extension = extension
        req.originalPath = filePath
        req.filePath = './files/' + filePath
        callback(null, filePath)
    }
})
const maxFileSize = 5 * 1000 * 1000;

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
})

module.exports = upload