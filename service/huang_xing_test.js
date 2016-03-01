var Config = require('../config');
var request = require('request');
var token = '';
var client_id =Config.huang_xing.client_id;
var client_secret = Config.huang_xing.client_secret;
var http_request = function(data,path,method,callback){
    data = data || {};
    method = method ||'get';
    var options = {
        uri :'https://a1.easemob.com/'+Config.huang_xing.id+'/'+Config.huang_xing.app_name+path ,
        method :method,
        headers:{
            'Content-Type' :'application/json',
            'Authorization' :'Bearer '+token  //Barer 与token中间有个空格
        },
        json :data
    };
    request(options,function(err,response,body){
        callback(err,body);
    })

}


var get_token = function(callback){
    var data = {
        grant_type :'client_credentials',
        client_id :client_id,
        client_secret :client_secret
    }
    http_request(data,'/token','POST',function(err,data){
        token = data.access_token;
        if(callback){
            callback();
        }
    })
}



var message = function (target,msg,from){
    var data = {
        'target_type' :'users',
        'target' :target,
        'msg' :{
            'type' :'txt',
            'msg' :msg
        },
        'from' :from
    }
    if(token){
        http_request(data,'/messages','POST',function(err,result){
            if(err){
                console.log(err);
            }else{
                console.log('success1');
            }
        })
    }else{
        get_token(function(err){
            http_request(data,'/messages','POST',function(err,result){
                if(err){
                    console.log(err);
                }else{
                    console.log('success2');
                }
            })
        })
    }

}
message(['44444'],'hi','378101');