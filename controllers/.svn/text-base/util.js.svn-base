var m_crypto = require('crypto');
var $ = require('underscore');

var algorithms=['bf', 'blowfish', 'aes-128-cbc'];
var outputEncoding='hex'
var inputEncoding= 'utf8';


exports.encrypt = function (plaintext,key) {
    return $.reduce(algorithms, function (memo, a) {
        var cipher = m_crypto.createCipher(a, key);
        return cipher.update(memo, inputEncoding, outputEncoding)
            + cipher.final(outputEncoding)
    }, plaintext, this);
};

exports.decrypt = function (crypted,key) {
    try {
        return $.reduceRight(algorithms, function (memo, a) {
            var decipher = m_crypto.createDecipher(a, key);
            return decipher.update(memo, outputEncoding, inputEncoding)
                + decipher.final(inputEncoding);
        }, crypted, this);
    } catch (e) {
        return;
    }
};