var Cards = require('../modal/cards');
var Topics = require('../modal/topics');
var Users = require('../modal/users');
var Notes = require('../modal/notes');
var Card_report = require('../modal/card_report');
var Note_Likes = require('../modal/note_likes');
var read_service = require('../service/read_file');
var card_service = require('../service/cards');
var user_log_service = require('../service/user_logs');
var cards = {};
module.exports = cards;
/**
 * 验证此标题是否已经存在
 * findCreateFind
 * @param title_name
 */
var validate_title = function* (title_name){
    //var max = yield  Topics.max('id');
    var result = yield Topics.findCreateFind({
        where :{
            title :title_name
        },
        defaults :{
            //id :max+1,
            count :0,
            time :new Date().getTime(),
            createTime :new Date().getTime()
        }
    });
    return result;
};

/**
 * 打卡添加（post）
 */
cards.add = function* (){
    var ip = this.ip;
    var body = this.request.body.str;
    var obj = JSON.parse(body);
    var title_name = obj.title;
    var topicId = obj.topicId;
    var count = obj.topic_count;
    if(!topicId){
        var title_obj = yield validate_title(title_name);
        obj.topicId = title_obj[0].id;
        count = title_obj[0].count;
    }
    yield Topics.update({
        count :Number(count)+1,
        time :new Date().getTime()
    },{
        where :{
            id :obj.topicId
        }
    })
    delete obj.title;
    delete obj.topic_count;
    var result = yield Cards.create(obj);
    yield user_log_service.sendCard(result.userId,'card',result.id,obj.topicId,ip);//纪录日志
    yield  this.body = {
        error:false,
        msg :'添加成功!'
    }
};

/**
 * 纸条添加
 */
cards.addNote = function* (){
    var ip = this.ip;
    var body = this.request.body;
    var card_userId = body.card_userId;
    var str = body.str;
    var obj = JSON.parse(str);
    var result = yield Notes.create(obj);
    yield user_log_service.send(obj.userId,card_userId,'note',result.id,result.cardId,ip);
    yield this.body = {
        error:false,
        msg:'添加成功!',
        obj :result
    }
}
/**
 * 点击话题进入话题所属的打卡列表页(get)
 */
cards.detail = function* () {
    var modal = this.params.modal;
    var id = this.params.id;
    var back = this.params.back;
    //var topic = yield Topics.findById(id);
    yield this.render('/detail/'+modal, {
        layout: false,
        //obj: topic,
        sSearch :id,
        iDisplayStart:0,
        iDisplayLength:10,
        back: back});
};
/**
 * 显示打卡信息以及纸条信息(get)
 */
cards.cardDetail = function* (){
    var id = this.params.id;
    var back = this.params.back;
    var cards = yield Cards.findById(id,{
        include :[
            {model:Users,as:'users',attributes:['id','account','nickname','avatar'],required:true},
            {model:Topics,as:'topics',attributes:['id','title','count'],required:true}
        ]
    });
    yield this.render('/view/cards',{
        layout:false,
        obj :cards,
        back:back
    })
};
/**
 * 打卡中的所有纸条信息(post)
 */
cards.noteList = function* (){
    var cardId = this.params.id;
    var pageSize = Number(this.params.pageSize);
    var pageNo = Number(this.params.pageNo);
    var noteArray = yield Notes.findAll({
        where:{cardId:cardId,isClose:false},
        include :[{model:Users,as:'users',attributes:['id','avatar','nickname']}],
        order :[['createTime','desc']],
        limit :pageSize,
        offset :pageNo*pageSize
    });
    yield this.body = {
        error:false,
        noteArray :noteArray
    }
};

/**
 * 点赞功能
 */
cards.like = function* (){
    var ip = this.ip;
    var str = this.request.body.str;
    var obj = JSON.parse(str);
    var noteId = obj.noteId;
    try{
        var note_like_obj = yield Note_Likes.findOne({where :{userId :obj.userId,noteId :noteId}});
        if(note_like_obj){
            yield this.body = {
                error :true,
                msg :'点赞失败,已经赞过了'
            }
        }else{
            var noteObj = yield Notes.findById(noteId);
            var likeCount = Number(noteObj.likeCount)+1;
            yield Notes.update({likeCount :likeCount},{where:{id :noteId}});
            var result = yield Note_Likes.create(obj);
            yield user_log_service.send(result.userId,noteObj.userId,'like',noteId,noteObj.cardId,ip);
            yield this.body = {
                error :false,
                msg :'点赞成功'
            }
        }

    }catch(e){
        yield this.body = {
            error :false,
            msg :'点赞失败'
        }
    }

};

/**
 * 删除打卡
 */
cards.delete = function* (){
    var obj = this.request.body;
    var topicId = obj.topicId;
    var cardId = obj.cardId;
    yield Cards.destroy({where :{id:cardId}});
    yield Notes.destroy({where :{cardId :cardId}});
    yield changeCount(topicId,-1);
    yield this.body={
        error:false,
        msg:'删除成功！'
    }
};

/**
 * 改变某个话题中打卡数量的变化
 * @param topicId 某个话题的id
 * @param num
 */
var changeCount = function*(topicId,num){
    var result = yield Topics.findById(topicId);
    var count = Number(result.count)+Number(num);
    yield Topics.update({count :count},{where:{id:topicId}});
};

/**
 * 批量删除打卡
 */
cards.batch_del = function* (){
    var value = this.request.body;
    var objArray = value.idArray;
    try{
        for(var obj of objArray){
            var topicId = obj.topicId;
            var cardId = obj.cardId;
            yield Cards.destroy({where:{id:cardId}});
            yield Notes.destroy({where :{cardId :cardId}});
            yield changeCount(topicId,-1);
        }
        yield this.body={
            error:false,
            msg:'批量删除成功!'
        }
    }catch(e){
        yield this.body={
            error:false,
            msg:'批量删除失败!'
        }
    }

};
/**
 * 批量增加打卡
 */
cards.batch_add = function* (){
    var obj = this.request.body;
    var strArray = obj.str;
    var sub_users = obj.idArray;
    var titleName = obj.title;
    try{
        var result = yield validate_title(titleName);
        var topicId = result[0].id;
        yield card_service.batch_service(strArray,topicId,sub_users);
        var len = strArray.length;
        yield changeCount(topicId,len);
        yield this.body = {
            error:false,
            msg :'批量增加打卡成功!'
        }
    }catch(e){
        yield this.body = {
            error:true,
            msg :'批量增加打卡失败!'
        }
    }

};

/**
 * 删除note的方法(get)
 */
cards.del_note = function* (){
    var noteId = this.params.id;
    yield Notes.destroy({where :{id:noteId}});
    yield this.body={
        error:false,
        msg :'删除成功!!'
    }
};

/**
 * 删除举报所对应的打卡纪录(get)
 */
cards.delete_report = function* (){
    var cardId = this.params.id;
    try{
        var cardObj = yield Cards.findById(cardId);
        var topicId = cardObj.topicId;
        yield Cards.destroy({where :{id :cardId}});
        yield Card_report.destroy({where :{cardId :cardId}});
        yield changeCount(topicId,-1);
        yield Notes.destroy({where :{cardId :cardId}});
        yield this.body = {
            error :false,
            msg :'删除成功!!'
        }
    }catch(e){
        yield this.body = {
            error :true,
            msg :e.message
        }
    }
}
