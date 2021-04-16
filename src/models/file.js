const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // owner: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    path: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('File', fileSchema)