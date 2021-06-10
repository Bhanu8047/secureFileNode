const mongoose = require('mongoose')
const hash = require('bcryptjs')
const validator = require('validator')
const File = require('./file')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('invalid email!')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8,'must be greater than 8'],
        validate(value) {
            if(value.toLowerCase().includes('password')) throw new Error('something went wrong.')
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    otp:{
        type: String,
        minlength: 6,
        maxlength: 6
    }
}, {
    timestamps: true
})


userSchema.virtual('files', {
    ref: 'Files',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) user.password = await hash.hash(user.password, 10)
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await File.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User