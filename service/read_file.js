var fs = require('fs');
var iconv = require('iconv-lite');
var exception = require('./exception');
var read = {};
module.exports = read;
read.readFile = function(file){
    return function(cb){
        fs.readFile(file,function(err,data){
            if(err){
                //throw err;
                console.log(err);
                return cb(exception(exception.DBError,'此路径有错，没有发现此文本'));
            }else{
                var str = iconv.decode(data,'utf8');
                cb(null,str);
            }
        })
    }
}