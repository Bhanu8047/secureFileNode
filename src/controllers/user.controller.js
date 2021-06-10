const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { resetPassword } = require('../api/mail')
const { nanoid } = require('nanoid')

module.exports.createUser = async (req, res, next) => {
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
}

module.exports.sendOtp = async (req, res, next) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message: 'email not found.'
            })
        }
        const OTP = nanoid(6)
        user.otp = OTP
        await user.save()
        const query = await resetPassword(user.name, user.email, OTP)
        if(!query.accepted) {
            return res.json({
                success: false,
                message: 'email could not sent.'
            })
        }
        res.json({
            success: true,
            message: 'otp sent to your mail.'
        })
    } catch (error) {
        next(error)
    }
}

module.exports.forgotPassword = async (req, res, next) => {
    const { password } = req.body
    try {
        req.user.password = password
        await req.user.save()
        res.json({
            success: true,
            message: 'password reset successfully.'
        })
    } catch (error) {
        next(error)
    }
}

module.exports.readUser = async (req, res ,next) => {
    req.user ? res.render('user',{
        user: req.user,
        title: 'Profile',
        navbar: [
            { link: '/', name: 'file-box', id: 'file-box' },
            { link: '/upload/file', name: 'upload', id: 'upload' },
            { link: '', name: 'dump file-box', id: 'deleteAll' },
            { link: '/logout', name: 'logout', id: 'logout' },
        ],
    }) : res.redirect('/login')
}

module.exports.addFile = async(req, res, next) => {
    res.render('upload',{
        navbar: [
            { link: '/', name: 'file-box', id: 'file-box' },
            { link: '/profile', name: 'profile', id: 'profile' },
        ],
    })
}