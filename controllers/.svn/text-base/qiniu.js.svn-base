var Config = require('../config');
var qiniu = require('qiniu');
var qiniuService = {};
module.exports = qiniuService;
qiniu.conf.ACCESS_KEY = Config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = Config.qiniu.SECRET_KEY;
/**
 * 服务端生成 上传凭证
 * @returns {*|Object}
 */
var uptoken = function (bucketName) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketName);
    putPolicy.returnBody= "{\"name\": $(fname),\"size\": \"$(fsize)\",\"w\": \"$(imageInfo.width)\",\"h\": \"$(imageInfo.height)\",\"key\":$(key)}";
//  putPolicy.returnBody= "{\"name\": $(fname),\"size\": \"$(fsize)\",\"w\": \"$(imageInfo.width)\",\"h\": \"$(imageInfo.height)\",\"key\":$(etag)}";
    return putPolicy.token();
};

qiniuService.get_qiniu_token = function* (){
    var bucketName = this.params.buckName;
    var token = uptoken(bucketName);
    yield this.body = {
        uptoken :token
    }
};

qiniuService.bufferUpload = function* (body, key){
    var token = uptoken(Config.ueditor_qiniu.domin);
    var extra = new qiniu.io.PutExtra();
    return new Promise(function(resolve,reject){
        qiniu.io.put(token, key, body, extra,function(err,data){
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
}