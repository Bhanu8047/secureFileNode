const router = require('express').Router()
const File = require('../models/file')

router.post('/addFile', async (req, res, next) => {
    // console.log(req.body)
    const file = new File(
        req.body
    )
    try {
        await file.save()
        res.json({
            success: true,
            file
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'file chud gyi bhaiiji.',
            _error: error._message
        })
    }
})
router.get('/getAllFiles', async (req, res, next) => {
    try {
        const files = await File.find({})
        if(!files) return res.json({
            message: 'TU NALLA PAAV H.'
        })
        return res.json({
            files,
            message:' NOICE'
        })
    } catch (error) {
        return res.json({
            message:'kuch toh gadbad h daya',
            _error: error._message
        })
    }
})

module.exports = router