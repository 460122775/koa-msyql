var read_service = require('../service/read_file');
var user_service = require('../service/users');
var huan_xing_service = require('../service/huan_xing');
var cached_service = require('../service/cached_redis');
var jpush_service = require('../service/jPush');
var Users = require('../modal/users');
var User_pairs = require('../modal/user_pairs');
var Friendship = require('../modal/friendship');
var Sub_users = require('../modal/sub_users');
var Dict_tags = require('../modal/dict_tags');
var Dict_sexAge = require('../modal/dict_sexAge');
var MD5Tool = require('./MD5');
var Config = require('../config');
var greetArray = Config.greet;
var $ = require('underscore');
var Sequelize = require('sequelize');
var users = {};
module.exports = users;
/**
 *批量导入用户(过期)
 */
//users.batch = function* (){
//    var file_path = this.request.body.file_path;
//    try{
//        var str = yield read_service.readFile(file_path);
//        str = str.replace('\r\n','');
//        var strArray = str.split(';');
//        var parentId = this.session.id;
//        yield user_service.batchUser(strArray,parentId);
//        yield this.body = {
//            error :false,
//            msg :'导入成功'
//        }
//    }catch(e){
//        yield this.body = {
//            error :true,
//            msg :e.message
//        }
//    }
//
//};
/**
 * 批量导入
 */
users.batch = function* (){
    var body = this.request.body;
    var strArray = body.str;
    var parentId = body.parentId;
    try{
        yield user_service.batchUser(strArray,parentId);
        yield this.body = {
            error :false,
            msg :'导入成功'
        }
    }catch(e){
        yield this.body = {
            error :true,
            msg :e.message
        }
    }

};

/**
 * 添加单个用户
 */
users.add_post= function* (){
    var str = this.request.body.str;
    var obj = JSON.parse(str);
    obj.password = MD5Tool.MD5(obj.password);
    try{
        var result = yield Users.create(obj);
        var parentId = this.session.id;
        var user_new_id = result.id;
        var hx_user = {
            username :Config.app_name+'_'+user_new_id,
            password :MD5Tool.MD5(Config.app_name+'_'+user_new_id)
        };
        var sub = {
            parentId :parentId,
            userId :user_new_id
        };
        yield huan_xing_service.insert_user(hx_user);
        if('SYS' == obj.accountType){
            yield Sub_users.create(sub);
        }
        yield this.body = {
            error :false,
            msg :'添加用户成功!'
        }
    }catch(e){
        yield this.body = {
            error :true,
            msg :'添加用户失败'
        }
    }

}

/**
 * 删除用户
 */
users.del = function* (){
    var id = this.request.body.id;
    try{
        yield Users.destroy({where :{id :id}});
        yield Sub_users.destroy({where :{userId :id}});
        yield huan_xing_service.dele_user(Config.app_name+'_'+id);
        yield this.body = {
            error :false,
            msg :'删除成功'
        }
    }catch(e){
        yield this.body = {
            error :true,
            msg :'删除失败'
        }
    }

};

/**
 * 获取某一用户的子账号
 */
users.getSubUser = function* (){
    var parentId = this.params.id;
    var result = yield Sub_users.findAll({
        where:{parentId :parentId},
        include:[{model:Users,as:'users',attributes:['nickname','avatar','id','accountType'],required:true,where:{isClose:false}}]
    });
    var objList = [];
    if(result.length>0){
        for(var obj of result){
            var obj_new = {
                userId :obj.userId,
                nickname :obj.users.nickname,
                account :MD5Tool.MD5(Config.app_name+'_'+obj.users.id),
                avatar :obj.users.avatar,
                accountType :obj.users.accountType
            }
            objList.push(obj_new);

        }
    }
    yield this.body={
        error:false,
        obj:objList
    }
};

users.match = function* (){
    var id = this.params.id;
    var type = this.params.type;
    yield this.render('/detail/'+type,{id:id});
}

var user_match_id =[];
/**
 * 匹配用户(查询可以匹配的其他用户)
 */
users.match_other = function* (){
    var userId = Number(this.params.id);
    var pageNo = Number(this.params.pageNo);
    var pageSize = Number(this.params.pageSize);
    if(0==pageNo){ //第一次查询时候查询已经匹配的用户
        user_match_id=[userId];
        //var userArray_matched = yield User_pairs.findAll({
        //    attributes :['targetUserId'],
        //    where :{userId :userId}
        //});
        //if(userArray_matched.length>0){
        //    for(var user of userArray_matched){
        //        user_match_id.push(user.targetUserId);
        //    }
        //}
       user_match_id =  yield search_match(userId,user_match_id);
    }
    var option = {
        attributes :['id','nickname','account','avatar'],
        where :{accountType :'USER',id :{$notIn :user_match_id},isClose :false},
        limit :pageSize,
        offset :pageNo*pageSize
    }
    var result = yield Users.findAll(option);
    yield this.body = {
        error :false,
        obj :result
    }

};

var search_match = function* (userId,idArray){
    var date = new Date();
    date.setHours(23,59,59,999);
    var date_max = date.getTime();
    date.setDate(date.getDate()-2);
    date.setHours(0,0,0,0);
    var date_min = date.getTime();
    var userArray_matched_init = yield User_pairs.findAll({ //这两天主动匹配
        attributes :['targetUserId'],
        where :{userId :userId,createTime :{$gt :date_min,$lt :date_max}}
    });

    //var userArray_matched_pas = yield User_pairs.findAll({//这两天被动匹配
    //    attributes :['userId'],
    //    where :{targetUserId :userId,createTime :{$gt :date_min,$lt :date_max}}
    //});

    var userArray_friend_init = yield Friendship.findAll({ //已经主动添加成为好友
        attributes :['toUserId'],
        where :{userId :userId}
    });
    var userArray_friend_pas = yield Friendship.findAll({ //已经被动添加为好友
        attributes :['userId'],
        where :{'toUserId' :userId}
    })
    var matched_Array = filter_key(userArray_matched_init,'targetUserId');
    var friend_init_Array =  filter_key(userArray_friend_init,'toUserId');
    var friend_pas_Array =  filter_key(userArray_friend_pas,'userId');
    idArray = idArray.concat(matched_Array);
    idArray = idArray.concat(friend_init_Array);
    idArray = idArray.concat(friend_pas_Array);
    return yield delRepeat(idArray);

}

var filter_key = function(objArray,key){
    if(objArray.length>0){
        //return new Promise(function(resolve,reject){
        //    $.pluck(objArray,key,function(err,data){
        //        if(err){
        //            reject(err);
        //        }else{
        //            resolve(data);
        //        }
        //
        //    })
        //})
        return $.pluck(objArray,key);
    }else{
        return [];
    }
};
var delRepeat = function(idArray){
    if(idArray.length>0){
        //return new Promise(function(resolve,reject){
        //    $.uniq(idArray,true,function(data){
        //        resolve(data);
        //    })
        //})
        return $.uniq(idArray,true);
    }else{
        return [];
    }
}
/**
 * 匹配用户保存 用户对系统用户
 */
users.match_user = function* (){
    var bodyValue = this.request.body;
    var str = bodyValue.str;
    var parentId = bodyValue.parentId;
    var idArray = JSON.parse(str);
    var toUserArray = [];
    var app_name = Config.app_name;
    for(var obj of idArray){
        obj.createTime = new Date().getTime();
        obj.isMatch = true;
        toUserArray.push(app_name+'_'+obj.targetUserId);
    }
    try{
        yield User_pairs.bulkCreate(idArray);
        var len = greetArray.length;
        var random = Math.floor(Math.random()*len);
        var msg = greetArray[random];
        yield huan_xing_service.sendMessage(toUserArray,msg,app_name+'_'+parentId);
        yield this.body ={
            error:false,
            msg :'匹配成功!'
        }
    }catch(e){
        yield this.body = {
            error :true,
            msg :'匹配失败'
        }
    }

};

/**
 * 系统用户匹配  系统用户对用户
 */
users.match_sys_user = function* (){
    var appName = Config.app_name;
    var bodyValue = this.request.body;
    var targetId = bodyValue.toId;
    var idArray = bodyValue.str;
    var toId =[ appName+'_'+targetId];
    var len = greetArray.length;
    var pairArray = [];
    for(var i=0;i<idArray.length;i++){
        var random = Math.floor(Math.random()*len);
        var msg = greetArray[random];
        yield huan_xing_service.sendMessage(toId,msg,appName+'_'+idArray[i]);
        var pair = {
            userId :idArray[i],
            targetUserId: targetId,
            isMatch :true,
            createTime :new Date().getTime()
        };
        pairArray.push(pair);
    }
    yield User_pairs.bulkCreate(pairArray);
    yield this.body = {
        error :false,
        msg :'匹配成功'
    }

}

/**
 * 关闭或开启用户
 */
users.pub_isClose = function* (){
    var bodyValue = this.request.body;
    var id = bodyValue.id;
    var value = bodyValue.value;
    yield Users.update({isClose :value},{where :{id :id}});
    //var hx_id = Config.app_name+'_'+id;
    //yield huan_xing_service.isActive_user(hx_id,value);
    if('true'==value){
        var param = {
            contentType :'exit',
            content :{}
        };
        yield jpush_service.sendSingleMessage([id],'你已经违规!!',param);
    }
    yield this.body = {
        error:false,
        msg :'修改状态成功!'
    }
};

/**
 * 用户点击编辑跳转
 */
users.edit = function* (){
    var id = this.params.id;
    var back = this.params.back;
    var result = yield Users.findById(id);
    var tagList = yield Dict_tags.findAll();
    //var sexAgeList = yield Dict_sexAge.findAll();
    var sexAgeList = yield cached_service.getByKey('dict_sexAge');
    var tags = result.tags;
    var tagArray_new = [];
    if(tags){
        tagArray_new = modifyTag(tags,tagList);
        result.tags = tagArray_new;
    }
    if(result.hideTag){
        tagArray_new = modifyTag(result.hideTag,tagList);
        result.hideTag = tagArray_new;
    }
    yield this.render('/edit/users',{obj :result,sexAgeList :sexAgeList,back:back});
};

var modifyTag = function(tags,tagList){
    var resultArray = [];
    var tagsArray = tags.split(',');
    if(tagsArray.length>0 && tagList.length>0){
        for(var key of tagsArray){
            for(var obj of tagList){
                if(key == obj.key){
                    var val = {
                        key :key,
                        value :obj.value
                    };
                    resultArray.push(val);
                    break;
                }
            }
        }
    }
    return resultArray;
};

/**
 * 验证用户信息中的account 与nickname唯一
 */
users.validate_only = function* (){
    var type = this.params.type;
    var str = this.request.body.str;
    var option={};
    option[type] = str;
    var result = yield Users.findOne({where :option});
    var isNotExit = true;
    if(result){
        isNotExit = false;
    }
    yield this.body = {
        error :isNotExit,
        obj :result
    }
};

/**
 * 查询某一个用户的好友关系
 */
users.findFriendById = function* (){
    var id = this.params.id;
    var appName = Config.app_name;
    Users.hasMany(Friendship,{as :'friendship',foreignKey :'toUserId'});
    Friendship.belongsTo(Users,{as :'users',foreignKey:'toUserId'});
    var result1 = yield Friendship.findAll({
        where :{userId :id},
        include :[{model :Users,as :'users',attributes :['id','nickname','avatar']}]
    });
    Users.hasMany(Friendship,{as :'friendship',foreignKey :'userId'});
    Friendship.belongsTo(Users,{as :'users',foreignKey:'userId'});
    var result2 = yield Friendship.findAll({
        where :{toUserId :id},
        include :[{model :Users,as :'users',attributes :['id','nickname','avatar']}]
    });
    var objList = [];
    if(result1){
        for(var obj1 of result1){
            var objOne1 = {
                userId : appName+'_'+obj1.toUserId,
                nickname : obj1.users.nickname,
                avatar :obj1.users.avatar
            }
            objList.push(objOne1);
        }
    }
    if(result2){
        for(var obj of result2){
            var objOne = {
                userId : appName+'_'+obj.userId,
                nickname : obj.users.nickname,
                avatar :obj.users.avatar
            }
            objList.push(objOne);
        }
    }
    objList = unique_obj(objList,'userId');
    yield this.body = {
        error :false,
        obj :objList
    }
};
var unique_obj = function(objList,key){
    var arr = [];
    var json = {};
    for(var i=0;i<objList.length;i++){
        if(!json[objList[i][key]]){
            json[objList[i][key]] = true;
            arr.push(objList[i]);
        }
    }
    return arr;
}
/**
 * 根据id查询用户
 */
users.findUsersById = function* (){
    var id = this.params.id;
    var result = yield Users.findById(id,{attributes :['id','nickname','avatar']});
    var obj_new  = {
        userId :Config.app_name+'_'+result.id,
        nickname :result.nickname,
        avatar :result.avatar
    }
    yield this.body = {
        error :false,
        obj :obj_new
    }
};

users.add_friend = function* (){
    var modal = this.params.modal;
    var str = this.request.body.str;
    var obj = JSON.parse(str);
    yield Friendship.create(obj);
    //var user_pair_obj = {
    //    userId :obj.userId,
    //    targetUserId :obj.toUserId,
    //    isMatch:true,
    //    createTime :new Date().getTime()
    //};
    //yield User_pairs.create(user_pair_obj);
    yield this.body={
        error :false,
        msg :'添加成功!!'
    }

}
/**
 * 查询某个用户已经匹配过系统用户的数据
 */
users.matched = function* (){
    var userId = this.params.id;
    var result = yield User_pairs.findAll({
        attributes :['targetUserId'],
        where :{userId :userId},
        include :[{model :Users,as :'users',attributes :['nickname','avatar','id','accountType'],required :true}]
    });
    var objList = [];
    if(result.length>0){
        for(var obj of result){
            var obj_new = {
                userId :obj.userId,
                nickname :obj.users.nickname,
                account :MD5Tool.MD5(Config.app_name+'_'+obj.users.id),
                avatar :obj.users.avatar,
                accountType :obj.users.accountType
            }
            objList.push(obj_new);

        }
    }
    yield this.body = {
        error :false,
        obj :objList
    }
};

/**
 * 删除某个用户的好友关系(get)
 */
users.del_friends = function* (){
    var id = this.params.id;
    yield Friendship.destroy({where :{userId :id}});
    yield Friendship.destroy({where :{toUserId :id}});
    yield this.body = {
        error :false,
        msg :'删除成功!!'
    }
}

var del_repeat = function (result,result1){
    return new Promise(function(resolve,reject){
        $.union(result,result1,function(err,data){
            if(err){
                reject(err);
            }else{
                resolve(data);
            }

        })
    })
}

/**
 * 跳转到批量添加用户(get)
 */
users.bat_add_get = function* (){
    var dict = yield cached_service.getByKey('dict_sexAge');
    yield this.render('/add/user_hx',{dict :dict});
};

/**
 * 获取颜龄标签
 */
users.get_dict = function* (){
    var dict = yield cached_service.getByKey('dict_sexAge');
    yield this.body = {
        error :false,
        obj :dict
    }
}

/**
 * 重置密码
 */
users.reset = function* (){
    var id = this.request.body.id;
    var comm_pwd = MD5Tool.MD5('im123456');
    yield Users.update({password :comm_pwd},{where :{id :id}});
    yield this.body = {
        error :false,
        msg :'重置成功!!'
    }
}

