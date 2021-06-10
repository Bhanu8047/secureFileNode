const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    path: {
        type: String,
        required: true
    },
    extension: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    shared: [{
        email: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('File', fileSchema)