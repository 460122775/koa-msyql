var User_logs = require('../modal/user_logs');
var Users = require('../modal/users');
var jpush_service = require('./jPush');
var user_logs = {};
module.exports = user_logs;

var action_map = {
  card:'发表了卡片',
  note:'发表小纸条',
  like:'赞了小纸条'
};
var msg_map = {
  note :'发表了小纸条',
  like :'点赞了你发表的小纸条'
}
var doPositive = function* (obj){
  yield User_logs.create(obj);
}
/**
 * 发表纸条与点赞
 * @param userId
 * @param toUserId
 * @param action
 * @param direct_actionFor
 * @param indirect_actionFor
 * @param ip
 */
user_logs.send = function* (userId,toUserId,action,direct_actionFor,indirect_actionFor,ip){
   var obj = {
    userId :userId,
    toUserId:toUserId,
    action :action,
    direct_actionFor:direct_actionFor,
    indirect_actionFor:indirect_actionFor,
    description :action_map[action],
    ip :ip,
    createTime :new Date().getTime()
  };
  yield doPositive(obj);
  if(userId !=toUserId){
    var userObj = yield Users.findOne({attributes :['nickname'],where :{id :userId}});
    var nickname = userObj.nickname;
    var msg = nickname+msg_map[action];
    var param = {
      contentType :'comment',
      content :{
        nickname : nickname,
        time :new Date().getTime(),
        description :action_map[action]
      }
    };
    //if('like' == action){
    //  param = {contentType: 'comment',content:{likeId :direct_actionFor}}
    //}else if('note' == action){
    //  param = {contentType: 'comment',content:{noteId :direct_actionFor}}
    //}
    yield jpush_service.sendSingleMessage([toUserId],msg,param);
  }
};

/**
 * 打卡
 * @param userId
 * @param action
 * @param direct_actionFor
 * @param indirect_actionFor
 * @param ip
 */
user_logs.sendCard = function* (userId,action,direct_actionFor,indirect_actionFor,ip){
  var obj = {
    userId :userId,
    action :action,
    direct_actionFor:direct_actionFor,
    indirect_actionFor:indirect_actionFor,
    description :action_map[action],
    ip :ip,
    createTime :new Date().getTime()
  };
  yield doPositive(obj)
};


