const User = require("../models/user")
const authenticateOTP = async (req, res, next) => {
    const {email, otp} = req.body
    const user = await User.findOne({email})
    // console.log(user)
    if(otp === user.otp){
        req.user = user
        next()
    } else {
        return res.json({
            success: false,
            message: 'otp validation failed.'
        })
    }
}

module.exports = authenticateOTP