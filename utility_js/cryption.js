const crypto = require('crypto');
const { AsyncLocalStorage } = require('async_hooks');

const randSalt = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}

const encrypt = function(password,salt){
    var cipher = crypto.createCipher('aes-128-cbc',salt);
    var hashedPassword = cipher.update(password,'utf8','hex');
    hashedPassword += cipher.final('hex');
    return hashedPassword;
}


const decrypt = function(password,salt){
    var decipher = crypto.createDecipher('aes-128-cbc',salt);
    var dehashedPassword = decipher.update(password,'hex','utf8');
    dehashedPassword += decipher.final('utf8');
    return dehashedPassword; 
}


module.exports = {
    encrypt : encrypt,
    randSalt : randSalt,
    decrypt : decrypt
}
