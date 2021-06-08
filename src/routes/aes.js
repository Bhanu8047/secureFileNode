const crypto = require('crypto')
const path = require('path')

const iv = "5183666c72eec9e4"
var algorithm = 'aes-256-ctr'

function encrypt(buffer, password) {
    var cipher = crypto.createCipheriv(algorithm, password,iv)
    // var crypted = cipher.update(val,'utf8', 'base64')+cipher.final('base64')
    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()])
    return crypted
}

function decyrpt(encrypted, password) {
    var decipher = crypto.createDecipheriv(algorithm, password,iv)
    decipher.setAutoPadding(false)
    // var mystr = decipher.update(encrypted, 'base64', 'utf8');
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return result
}

const fs = require('fs')
function encryption(filepath, password){
  const dir = path.join(__dirname, '../../files/')
  // console.log(dir)
   fs.readFile(dir+filepath ,(err, data) => {
        if (err) {
          console.error(err)
        } 
        const bufferString = encrypt(Buffer.from(data), password)
        fs.writeFile(dir+filepath , bufferString,{ flag: 'w+' } , err => {
            if (err) {
              console.error(err)          
            } else {
            }
          })
      })
      return true
}

function decryption(filepath, password, extension, cb1) {
  const dir = path.join(__dirname, '../../files/')
  fs.readFile(dir+filepath, (err, data) => {
      if(err){
        cb1(err)
      } else {
        const bufferString = decyrpt(data, password)
        fs.writeFile(dir+'download'+extension,bufferString,{ flag: 'w+' } , (err) => {
          if (err) {
            cb(err)
          }
          cb1(null,true)
        })
      }
    })
}


module.exports = {
  encryption,
  decryption
}