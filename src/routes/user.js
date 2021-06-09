const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.post('/addNewUser', async (req, res, next) => {
    const user = new User(req.body)
    try {
        const userExists = await User.findOne({email: req.body.email})
        if(userExists) {
            return res.json({
                success: false,
                resCode: 400,
                message: 'email already exists.'
            })
        }
        const usernameExists = await User.findOne({username: req.body.username})
        if(usernameExists) {
            return res.json({
                success: false,
                resCode: 400,
                message: 'username taken.'
            })
        }
        await user.save()
        return res.json({
            user,
            success: true,
            message: 'user added successfully. Please Login'
        })
    } catch (error) {
        return res.json({
            success: false,
            message: 'Something went wrong.',
            _message: error
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