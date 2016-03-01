var moment = require('moment');
var CachedService = require('../service/cached_redis');

var type_map = {
    'topic' :'卡片',
    'outlink' :'外链',
    'innerlink' :'内链'
}
var list = {
    'admin': function (data) {
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.username = data[i].username;
            item.isSuper = data[i].isSuper;
            item.isClose = data[i].isClose;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'users': function (data,tagList,sexList) {
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.account = data[i].account;
            item.nickname = data[i].nickname;
            item.avatar = data[i].avatar;
            item.hideTag = modifyTag(data[i].hideTag,tagList);
            item.sexAge = modifyTag(data[i].sexAge,sexList);
            item.accountType = data[i].accountType;
            item.isClose = data[i].isClose;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.updateTime = new moment(stringTo_Num(data[i].updateTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'cards':function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.topicId =data[i].topicId;
            item.title = data[i]['topics'].title;
            item.content = data[i].content;
            item.image = data[i].image;
            item.userId = data[i].userId;
            item.isClose = data[i].isClose;
            item.nickname = data[i]['users'].nickname;
            item.accountType = data[i]['users'].accountType;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.publishTime = new moment(stringTo_Num(data[i].publishTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'topics' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.title = data[i].title;
            item.count = data[i].count;
            item.time = new moment(stringTo_Num(data[i].time)).format("YYYY/M/D HH:mm:ss") ;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'dict_tags' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.key = data[i].key;
            item.value = data[i].value;
            item.version = data[i].version;
            item.type = data[i].type;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'dict_sexAge' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.key = data[i].key;
            item.value = data[i].value;
            item.version = data[i].version;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'dict' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.key = data[i].key;
            item.name = data[i].name;
            item.version = data[i].version;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'card_report' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.description = data[i].description;
            item.userId = data[i].userId;
            item.cardId = data[i].cardId;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.nickname = data[i]['users']['nickname'];
            item.content = data[i]['cards']['content'];
            item.image = data[i]['cards']['image'];
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'app_report' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.description = data[i].description;
            item.userId = data[i].userId;
            item.nickname = data[i]['users']['nickname'];
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'banner' :function(data){
        var result = [];
        for (i in data) {
            var item = {};
            item.id = data[i].id;
            item.image = data[i].image;
            item.width = data[i].width;
            item.height = data[i].height;
            item.type = type_map[data[i].type];
            item.content = data[i].content;
            item.isClose = data[i].isClose;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    },
    'notice' :function(data){
        var result = [];
        for(i in data){
            var item = {};
            item.id = data[i].id;
            item.title = data[i].title;
            item.url = data[i].url;
            item.isClose = data[i].isClose;
            item.createTime = new moment(stringTo_Num(data[i].createTime)).format("YYYY/M/D HH:mm:ss") ;
            item.id = data[i].id;
            result.push(item);
        }
        return result;
    }

};

/**
 *  列表数据过滤
 */
exports.list = function (model, data,tagList,sexList) {
    if (!list[model])
        return data;
    return result = list[model](data,tagList,sexList);
};


var modifyTag = function(tags,tagList){
    var resultArray = [];
    if(tags){
        var tagsArray = tags.split(',');
        if(tagsArray.length>0 && tagList.length>0){
            for(var key of tagsArray){
                for(var obj of tagList){
                    if(key == obj.key){
                        resultArray.push(obj.value);
                        break;
                    }
                }
            }
        }
    }
    return resultArray;
};

var stringTo_Num = function(time){
    if(time){
        time = Number(time);
    }
    return time;
}