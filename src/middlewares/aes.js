const crypto = require('crypto')
const path = require('path')
require('dotenv').config()

const {
  CIPHER_AlGO,
  CIPHER_IV
} = process.env

function encrypt(buffer, password) {
    var cipher = crypto.createCipheriv(CIPHER_AlGO, password, CIPHER_IV)
    // var crypted = cipher.update(val,'utf8', 'base64')+cipher.final('base64')
    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()])
    return crypted
}

function decyrpt(encrypted, password) {
    var decipher = crypto.createDecipheriv(CIPHER_AlGO, password, CIPHER_IV)
    decipher.setAutoPadding(false)
    // var mystr = decipher.update(encrypted, 'base64', 'utf8');
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return result
}

const fs = require('fs')
function encryption(filepath, password, callback){
   fs.readFile(path.join(__dirname, '../../files/') + filepath ,(err, data) => {
        if (err) {
          callback(err)
        } else {
          fs.writeFile(path.join(__dirname, '../../files/') + filepath, encrypt(Buffer.from(data), password), { flag: 'w+' } , err => {
            if (err) {
              callback(err)
            } else {
              callback(null, true)
            }
          })
        }
      })
}

function decryption(filepath, password, extension, callback) {
  fs.readFile(path.join(__dirname, '../../files/') + filepath, (err, data) => {
      if(err){
        callback(err)
      } else {
        const bufferString = decyrpt(data, password)
        fs.writeFile(path.join(__dirname, '../../files/') + 'download'+extension,bufferString,{ flag: 'w+' } , (err) => {
          if (err) {
            callback(err)
          } else {
            callback(null,true)
          }
        })
      }
    })
}


module.exports = {
  encryption,
  decryption
}