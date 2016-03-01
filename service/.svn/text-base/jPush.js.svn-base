var co_request = require('co-request');
var Config = require('../config');
var AppKey = Config.jpush.appKey;
var ApiSecret = Config.jpush.masterSecret;
var PUSH_METHOD = Config.jpush.METHOD;
var PUSH_URL = Config.jpush.URL;
var jpush = {};
module.exports = jpush;
var AuthorizationStr = "Basic " + new Buffer(AppKey + ':' + ApiSecret).toString('base64');
var sendMessage = function* (content){
  var options = {
    method: PUSH_METHOD,
    uri: PUSH_URL,
    headers: {
      "content-type": "application/json",
      "Authorization": AuthorizationStr
    },
    body: content
  };
  yield co_request(options);

};

jpush.sendSingleMessage = function* (alias,msg,params){
  var content = {
    "platform":"all",//推送平台  "android", "ios", "winphone"
    "audience":{     //推送设备对象
      alias:alias
    },
    "notification":{
      "alert":msg,
      "android":{
        "extras":params
      },
      "ios":{
        "extras":params
      }
    },
    'message' :{
      "msg_content":msg,
      "extras":params
    },
    "options":{
      "time_to_live":86400
      //"apns_production": false
    }
  };
  yield sendMessage(JSON.stringify(content));
}
