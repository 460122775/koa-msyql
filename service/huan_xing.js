var Config = require('../config');
var request = require('request');
var token = '';
var client_id =Config.huang_xing.client_id;
var client_secret = Config.huang_xing.client_secret;
var appId = Config.huang_xing.id;
var appName = Config.huang_xing.app_name;
var h_x = {};
h_x.http_request = function(data,path,method){
    data = data || {};
    method = method ||'get';
    var options = {
        uri :'https://a1.easemob.com/'+appId+'/'+appName+path ,
        method :method,
        headers:{
            'Content-Type' :'application/json',
            'Authorization' :'Bearer '+token  //Barer 与token中间有个空格
        },
        json :data
    };
   return function(cb){
       request(options,function(err,response,body){
           if(err){
               throw err;
           }else{
               cb(null,body);
           }
       })
   }

}

/**
 * 获取密匙
 */
h_x.get_token = function* (){
    var data = {
        grant_type :'client_credentials',
        client_id :client_id,
        client_secret :client_secret
    }
    var body = yield this.http_request(data,'/token','POST');
    token = body.access_token;
    console.log(token);
};
/**
 * 批量插入用户
 * @param obj （数组）
 */
h_x.insert_user = function *(obj){
    if(!token){
        yield this.get_token();
    }
    yield this.http_request(obj,'/users','POST');
};
/**
 * 删除用户
 * @param id
 */
h_x.dele_user = function *(id){
    if(!token){
        yield this.get_token();
    }
    yield this.http_request(null,'/users/'+id,'DELETE');
};
/**
 * 发送消息（环信）
 * @param target 目标用户 account 数组
 * @param msg 消息
 * @param from  发消息者
 */
h_x.sendMessage = function *(target,msg,from){
    var data = {
        'target_type' :'users',
        'target' :target,
        'msg' :{
            'type' :'txt',
            'msg' :msg
        },
        'from' :from,
        'ext' :{
                contentType :'hello',
                content :{
                    chatId :from
            }
        }
    }
    if(!token){
        yield this.get_token();
    }
    yield this.http_request(data,'/messages','POST');
};

/**
 * 是否禁用与解禁环信中的用户
 * @param account
 * @param value
 */
h_x.isActive_user = function* (id,value){
    if(!token){
        yield this.get_token();
    }
    var path = '';
    if('true'==value){
        path = '/users/'+id+'/deactivate'
    }else{
        path = '/users/'+id+'/activate'
    }
    yield this.http_request(null,path,'POST');
}

h_x.sendNotice = function *(target,val,from){
    var data = {
        'target_type' :'users',
        'target' :target,
        'msg' :{
            'type' :'txt',
            'msg' :'系统消息'
        },
        'from' :from,
        'ext' :{
            contentType :'notice',
            content :{
                title :val.title,
                image :val.image,
                url :val.url
            }
        }
    }
    if(!token){
        yield this.get_token();
    }
    yield this.http_request(data,'/messages','POST');
};
module.exports = h_x;