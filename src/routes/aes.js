let crypto = require('crypto');


// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex')
const iv = "5183666c72eec9e4";   //(null) iv 
var algorithm = 'aes-128-cbc';
// var password = 'a4e1112f45e84f78';//5358bb86ba750f48';//key password for cryptography
var password = crypto.randomBytes(8).toString('hex')


console.log(password)

function encrypt(val) {
    var cipher = crypto.createCipheriv(algorithm, password, iv);
    var crypted = cipher.update(val,'utf8', 'base64')+cipher.final('base64');
    return crypted;
}

function decyrpt(encrypted) {
    var decipher = crypto.createDecipheriv(algorithm, password,iv);
    var mystr = decipher.update(encrypted, 'base64', 'utf8');
    return (mystr+decipher.final('utf8'));
}

console.log(encrypt('TextToEncrypt'))
console.log(decyrpt(encrypt(("My sdasdasdasdasdadasdasdasdliuhvadfougyfegbhiuosDFiyuogsFiusFguySDAfiuog is manik"))));
