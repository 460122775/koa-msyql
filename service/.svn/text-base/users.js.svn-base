var Users = require('../modal/users');
var Sub_users = require('../modal/sub_users');
var huan_xing_service = require('../service/huan_xing');
var MD5Tool = require('../controllers/MD5');
var Config = require('../config');
var app_name = Config.app_name;
var user = {};
module.exports =user;

user.batchUser = function* (strArray,parentId){
    var hx_user = [];
    var loc_user = [];
    var time = new Date().getTime();
    for(var i=0;i<strArray.length;i++){
        if(strArray[i]){
            var obj = strArray[i];
            obj.password =MD5Tool.MD5(obj.password);
            obj.isClose = obj.isClose || false;
            obj.accountType = 'SYS';
            obj.createTime = time;
            obj.updateTime = time;
            loc_user.push(obj);
        }
    }
    yield Users.bulkCreate(loc_user);
    var result = yield Users.findAll({where :{createTime :time,updateTime :time},attributes :['id','account']});
    var sub_user = [];
    for(var use of result){
        var id = use.id;
        var sub = {
            parentId :parentId,
            userId :id
        };
        var username =app_name+'_'+id;
        var hx_password = MD5Tool.MD5(username);
        var user = {
            username : username,
            password :hx_password
        };
        sub_user.push(sub);
        hx_user.push(user);

    }
    yield Sub_users.bulkCreate(sub_user);
    yield huan_xing_service.insert_user(hx_user);
}