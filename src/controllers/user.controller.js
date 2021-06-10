const User = require('../models/user')
const bcrypt = require('bcryptjs')

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


module.exports.readUser = async (req, res ,next) => {
    req.user ? res.render('user',{
        user: req.user,
        title: 'Profile',
        navbar: [
            { link: '/files', name: 'file-box', id: 'file-box' },
            { link: '/upload/file', name: 'upload', id: 'upload' },
            { link: '', name: 'dump file-box', id: 'deleteAll' },
            { link: '/logout', name: 'logout', id: 'logout' },
        ],
    }) : res.redirect('/login')
}

module.exports.addFile = async(req, res, next) => {
    res.render('upload',{
        title: 'Secure Node File Sharing.',
        footerNote: 'powered By Bits Ke PAPA\'s'
    })
}