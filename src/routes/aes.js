const crypto = require('crypto')
const path = require('path')

const iv = "5183666c72eec9e4"
var algorithm = 'aes-128-cbc'

function encrypt(val, password) {
    var cipher = crypto.createCipheriv(algorithm, password, iv);
    var crypted = cipher.update(val,'utf8', 'base64')+cipher.final('base64');
    return crypted;
}

function decyrpt(encrypted, password) {
    var decipher = crypto.createDecipheriv(algorithm, password,iv);
    var mystr = decipher.update(encrypted, 'base64', 'utf8');
    return (mystr+decipher.final('utf8'));
}

const fs = require('fs')
function encryption(filepath, password){
  const dir = path.join(__dirname, '../../files/')
  // console.log(dir)
   fs.readFile(dir+filepath, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
        } 

        fs.writeFile(dir+filepath, encrypt(data, password),{ flag: 'w+' } , err => {
            if (err) {
              console.error(err)          
            } else {
            }
          })
      })
      return true
}

function decryption(filepath, password, extension) {
  const dir = path.join(__dirname, '../../files/')
  fs.readFile(dir+filepath,'utf-8',(err, data) => {
    if(err){
      console.error(err)
    } else {
      const dec = decyrpt(data, password)
      fs.writeFile(dir+'temp'+extension, dec,{ flag: 'w+' } , err => {
        if (err) {
          console.error(err)
        }
      })
    }
  })  
  return true
}


module.exports = {
  encryption,
  decryption
}