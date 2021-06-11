const jwt = require('jsonwebtoken')
require('dotenv').config()
const {
    KEY_ENC_SECRET
} = process.env

module.exports.tokenizeKey = (hash) => {
    return jwt.sign(hash, KEY_ENC_SECRET)
}
module.exports.getHashedKey = (tokenizedKey) => {
    return jwt.verify(tokenizedKey, KEY_ENC_SECRET)
}