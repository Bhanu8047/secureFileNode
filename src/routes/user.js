const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.post('/addNewUser', async (req, res, next) => {
    const user = new User(req.body)
    console.log(user);
    try {
        if(await User.findOne({email: req.body.email})) return res.json({
            message: 'user already exists.'
        })
        await user.save()
        return res.json({
            user,
            success: true,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: 'Something went wrong.',
            _message: error._message
        })
    }
})

router.get('/upload/file', async(req, res, next) => {
    res.render('upload',{
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s'
    })
})

module.exports = router