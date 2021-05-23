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
            message: 'Nahi aise nahi hoga.',
            _message: error._message
        })
    }
})

module.exports = router