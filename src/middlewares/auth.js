const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const {
    APP_SECRET
} = process.env

function encodeToken(tokenData) {
    return jwt.sign(tokenData, APP_SECRET)
}
function decodeToken(token) {
    return jwt.verify(token, APP_SECRET)
}

module.exports.jwtLogin = async (req, res, next) => {
    try {
        const { emailUsername, password } = req.body
        let user = await User.findOne({username: emailUsername})
        if(!user) {
            user = await User.findOne({email: emailUsername})
            if(!user) {
                return res.json({
                    success: false,
                    resCode: 404,
                    message: 'not a valid user.'
                })
            }
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.json({
                success: false,
                resCode: 401,
                message: 'could not authenticate.'
            })
        }
        const token = encodeToken({_id: user._id.toString()})
        user.tokens = user.tokens.concat({token})
        await user.save()
        req.session.token = token
        res.json({
            success: true,
            resCode: 200,
            _id: user._id
        })
    } catch (error) {
        next(error)
    }
}

module.exports.jwtAuthenticationMiddlewares = async (req, res, next) => {
    try {
        let token = req.session.token
        if(!token) return next()
        token = token.replace('Bearer ','')
        const { _id } = decodeToken(token)
        const user = await User.findOne({_id, 'tokens.token': token})
        if(user) {
            req.user = user
            req.token = token
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports.isAuthenticatedMiddlewares = (req, res, next) => {
    req.user ? next() : res.redirect('/login')
}

module.exports.jwtLogout = (req, res, next) => {
    try {
        req.session.destroy( async err => {
            if(err){
                res.redirect('/')
            }
            req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
            await req.user.save()
            res.clearCookie('connectID')
            res.json({
                success: true,
                message: 'you have logged out.',
            })
        })
    } catch (error) {
        next(error)
    }
}

module.exports.jwtLogoutAll = (req, res, next) => {
    try {
        req.session.destroy( async err => {
            if(err){
                res.redirect('/')
            }
            req.user.tokens = []
            await req.user.save()
            res.clearCookie('connectID')
            res.json({
                success: true,
                message: 'you have logged out.',
            })
        })
    } catch (error) {
        next(error)
    }
}