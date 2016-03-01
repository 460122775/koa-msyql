var Users = require('../modal/users');
var Cards = require('../modal/cards');
var Topics = require('../modal/topics');
var Notes = require('../modal/notes');
var Notice = require('../modal/notice');
var Admin = require('../modal/admin');
var Banner = require('../modal/banner');
var Friendship = require('../modal/friendship');
var Card_report = require('../modal/card_report');
var Dict_tags = require('../modal/dict_tags');
var Dict_sexAge = require('../modal/dict_sexAge');
var App_report = require('../modal/app_report');
var Dict = require('../modal/dict');
var Filter = require('./filter');
var randExp = require('randexp');
var Md5 = require('./MD5');
var Util = require('./util');
var Admin_Service = require('../service/admin');
var cached_Service = require('../service/cached_redis');
var _ = require('underscore');
var Modal_Map = {
    users :Users,
    cards :Cards,
    topics :Topics,
    notes :Notes,
    dict_tags:Dict_tags,
    dict_sexAge:Dict_sexAge,
    admin :Admin,
    card_report :Card_report,
    app_report :App_report,
    dict :Dict,
    banner:Banner,
    friendship :Friendship,
    notice :Notice
};
var comm = {};

/**
 * 登录跳转
 * @param next
 */
comm.login = function *(next){
    yield this.render('login');
};
/**
 * 进入主页
 */
comm.index = function* (){
    var admin = yield Admin.findById(this.cookies.get('id'));
    yield this.render('index',{user:admin});
};
/**
 * 登录
 */
comm.login_post = function* (){
    var obj = this.request.body;
    var username = obj.username;
    var password = Md5.MD5(obj.password);
    //var password = obj.password;
    var token = new randExp('[a-zA-Z0-9]{60,64}').gen();
    var admin = yield Admin_Service.login(username,password,token);
    if(admin.isTrue){
        var ip = this.ip;
        var tokenNum=  Util.encrypt(token,ip);
        this.session.username = username;
        this.session.id = admin.admin.id;
        this.session.isSuper = admin.admin.isSuper;
        this.cookies.set('im',tokenNum);
        this.cookies.set('username',username);
        this.cookies.set('id',admin.admin.id);
        this.cookies.set('httpOnly',true);
        this.redirect('/index');
    }else{
        this.redirect('/login');
    }
};
comm.loginOut = function* (){
    this.session = {};
    this.cookies.set('im','');
    this.cookies.set('username','');
    this.cookies.set('id','');
    this.redirect('/login');
    return;
}
/**
 * 列表跳转的方法(get)
 */
comm.list = function *(){
    var modal = this.params.modal;
    var back = this.params.back;
    var _value = {
        layout :false,
        back :back,
        iDisplayStart :0,
        iDisplayLength :10,
        sSearch :''
    }
    yield this.render('list/'+modal,_value);
};
/**
 * 点击编辑跳转页面(post)
 */
comm.edit= function *(){
    var modal = this.params.modal;
    var id = this.params.id;
    var back = this.params.back;
    var result = {};
    if('cards'==modal){
        var options = {
            include :[{model :Topics,as :'topics',attributes :['title','count'],required :true},
                {model :Users,as :'users',attributes :['id','nickname'],required :true}]
        };
        result = yield Modal_Map[modal].findById(id,options);
    }else{
        result = yield Modal_Map[modal].findById(id);
    }
    yield this.render('/edit/'+modal,{obj :result,back:back});
};

comm.add = function* (){
    var modal = this.params.modal;
    var option = {layout :false};
    if('users' == modal){
        var sexAgeList = yield cached_Service.getByKey('dict_sexAge');
        option.sexAgeList = sexAgeList;
    }
    yield this.render('/add/'+modal,option);
};
/**
 * 公共添加方法(post)
 */
comm.add_post = function* (){
    var modal = this.params.modal;
    var str = this.request.body.str;
    var obj = JSON.parse(str);
    yield Modal_Map[modal].create(obj);
    yield this.body = {
        error:false,
        msg:'添加成功!'
    }
};
comm.edit_post = function* (){
    var modal = this.params.modal;
    var str = this.request.body.str;
    var obj = JSON.parse(str);
    var id = obj.id;
    yield Modal_Map[modal].update(obj,{where :{id :id}});
    yield this.body={
        error:false,
        msg :'修改成功'
    }
};

comm.delete_post = function* (){
    var modal = this.params.modal;
    var obj = this.request.body;
    var id = obj.id;
    yield Modal_Map[modal].destroy({where :{id :id}});
    yield this.body = {
        error :false,
        msg :'删除成功!'
    }
}
/**
 * 上下架或其它true.false的方法(post)
 */
comm.publish = function* (){
    var modal = this.params.modal;
    var type = this.params.type;
    var body = this.request.body;
    var id = body.id;
    var values ={};
    var value = body.value;
    values[type] = value;
    yield Modal_Map[modal].update(values,{where :{id :id}});
    yield this.body = {
        error:false,
        msg :'修改成功!'
    }
};
/**
 * 查询调转（get）
 */
comm.search = function* (){
    var modal = this.params.modal;
    yield this.render('search/'+modal,{layout:false,model:modal});
};
comm.search_post = function* (){
    var modal = this.params.modal;
    var pageSize = this.params.pageSize;
    var pageNo = this.params.pageNo;
    var value = this.request.body.value;
    var options = {};
    if('topics' == modal){
        options = {
            where :{
                title :{$like :'%'+value+'%'}
            }
        }
    }
    if('cards' == modal){
        options = {
            attributes :['id','content','image','createTime'],
            where :{
                content :{$like :'%'+value+'%'},
                isClose :false
            }
        }
    }
    //var count = yield Modal_Map[modal].count(options);
    options.limit = Number(pageSize);
    options.offset = Number(pageSize *pageNo);
    var result = yield Modal_Map[modal].findAndCount(options);
    var count = result.count;
    var objArray = result.rows;
    this.body = {
        error :false,
        count :count,
        obj :objArray
    }
};

comm.back = function* (){
    var modal = this.params.modal;
    var type = this.params.type;
    var start = 0;
    var length = 10;
    var search = '';
    if(this.session && this.session.session && this.session.session[modal]){
        start = this.session.session[modal].iDisplayStart;
        length = this.session.session[modal].iDisplayLength;
        search = this.session.session[modal].sSearch;
    }
    yield this.render(type+'/'+modal,{
        layout:false,
        iDisplayStart :start,
        iDisplayLength :length,
        sSearch :search
    });
};

comm.back_detail = function* (){
    var modal = this.params.modal;
    var back_type = this.params.type;
    var start = 0;
    var length = 10;
    var search = '';
    if(this.session && this.session.session && this.session.session[modal]){
        start = this.session.session[modal].iDisplayStart;
        length = this.session.session[modal].iDisplayLength;
        search = this.session.session[modal].sSearch;
    }
    yield this.render('detail/'+modal,{
        layout:false,
        iDisplayStart :start,
        iDisplayLength :length,
        sSearch :search,
        back :back_type
    });
};

var table_map = {
    'users' :['id','account','nickname','avatar','hideTag','sexAge','accountType','isClose','createTime','updateTime','id'],
    'cards' :['id','content','image','createTime','isClose','userId','topicId'],
    'topics' :['id','title','count','time','createTime'],
    'dict_tags' :['id','key','value','version','type','createTime'],
    'dict_sexAge' :['id','key','value','version','createTime'],
    'dict' :['id','key','name','version','createTime'],
    'admin' :['id','username','isSuper','isClose','createTime'],
    'card_report' :['id','description','userId','cardId','createTime'],
    'app_report' :['id','description','userId','createTime'],
    'banner' :['id','image','width','height','type','content','isClose','createTime'],
    'notice' :['id','title','url','createTime','isClose']
};

var table_include = {
    'cards' :[{
        model:Users,
        as :'users',
        attributes :['nickname','accountType'],
        required :true
    },{
        model:Topics,
        as :'topics',
        attributes :['title'],
        required :true
    }],
    'card_report' :[{
        model :Users,
        as :'users',
        attributes :['nickname'],
        required :true
    },{
        model :Cards,
        as :'cards',
        attributes :['content','image'],
        required :true
    }],
    'app_report' :[{
        model :Users,
        as :'users',
        attributes :['nickname'],
        required :true
    }]
};

var include_map = {
    'cards' :['nickname','accountType','title'],
    'card_report' :['nickname','content','image'],
    'app_report' :['nickname']
};
/**
 * 所有列表查询(post)
 */
comm.list_post = function* (){
    var modal = this.params.modal;
    this.request.body.iDisplayLength = this.request.body.iDisplayLength ||[];
    var session = this.session.session ||{};
    session[modal] = {};
    session[modal].iDisplayLength = this.request.body.iDisplayLength;
    session[modal].iDisplayStart = this.request.body.iDisplayStart;
    session[modal].sSearch = this.request.body.sSearch;
    this.session.session = session;
    var col = [];
    col = table_map[modal];
    dataTableFilter(this,col,modal);
    //var count =yield count_num(modal,this);
    var aaData = [];
    var result =yield list_modal(modal,this);
    var count = result.count;
    var aaDataArray = result.rows;
    var tagList = [];
    var sexList = [];
    if('users'==modal){
        tagList = yield Dict_tags.findAll();
        sexList = yield cached_Service.getByKey('dict_sexAge');
    }
    aaDataArray = Filter.list(modal,aaDataArray,tagList,sexList);
    if(table_include[modal]){
        col = col.concat(include_map[modal]);
    }
    for(var i=0;i<aaDataArray.length;i++){
        aaData[i] = [];
        var data = [];
        for(j in col){
            data.push(aaDataArray[i][col[j]]);
        }
        data.push(aaDataArray[i]['id'].toString());
        aaData[i] = data;
    }
    this.body = {
        iTotalRecords :count,
        iTotalDisplayRecords :count,
        aaData :aaData
    };
};
/**
 * 配置列表查询过滤条件
 * @param obj
 * @param col
 */
function dataTableFilter(obj, col,modal) {
    var req = obj.request;
    req.boyce = {};
    req.boyce.limit = Number(req.body.iDisplayLength);
    req.boyce.offset = Number(req.body.iDisplayStart);
    req.boyce.order = [];
    //if (req.body.sSortDir_0 == "asc") {
    //    var sort = [col[parseInt(req.body.iSortCol_0)],'asc'];
    //    req.boyce.order.push(sort);
    //}
    //if (req.body.sSortDir_0 == "desc") {
    //    var sort = [col[parseInt(req.body.iSortCol_0)],'desc'];
    //    req.boyce.order.push(sort);
    //}
    for(var i=0;i<col.length;i++){
        if(req.body['sSortDir_'+i]){
            var sort = [col[parseInt(req.body['iSortCol_'+i])],req.body['sSortDir_'+i]];
            req.boyce.order.push(sort);
        }else{
            break;
        }
    }
    req.boyce.where = {};
    req.boyce.attributes = [];
    if(table_include[modal]){
        req.boyce.include = [];
        req.boyce.include =table_include[modal];
    }
    req.boyce.where.$or = req.boyce.where.$or || [];
    req.boyce.where.$and = req.boyce.where.$and || [];
    for (i = 0; i < parseInt(req.body.iColumns); ++i) {
        if(col[i]){
            req.boyce.attributes.push(col[i]);
        }
        if (req.body.sSearch) {
            var key = "bSearchable_" + i;
            if (req.body[key] != "true")
                continue;
            var item = {};
            if(col[i] !='id' && 'topicId' !=col[i]){
                item[col[i]] = {$like :'%'+req.body.sSearch+'%'};
            }else{
                item[col[i]] = req.body.sSearch;
            }

            req.boyce.where.$or.push(item);
        }
    }
    if(req.body.startDate && req.body.endDate){
        var item = {};
        var start = req.body.startDate;
        var end = req.body.endDate;
        item['createTime'] = {
            '$gt': start,
            '$lt': end
        };
        req.boyce.where.$and.push(item);
    }
};
/**
 * 计算总数
 * @param modal
 * @param obj
 */
var count_num = function* (modal,obj){
    var boyce = obj.request.boyce;
    var condition = boyce.where;
    return yield Modal_Map[modal].count({where :condition});
};

var list_modal = function* (modal,obj){
    var boyce = obj.request.boyce;
    //if(boyce.include.length>0){
    //    return yield  Modal_Map[modal].findAndCount({attributes :boyce.attributes,include:boyce.include,where :boyce.condition,order :boyce.sort,limit:boyce.filter.limit,offset:boyce.filter.offset});
    //}
    //return yield  Modal_Map[modal].findAndCount({attributes :boyce.attributes,where :boyce.condition,order :boyce.sort,limit:boyce.filter.limit,offset:boyce.filter.offset});
    return yield  Modal_Map[modal].findAndCount(boyce);
};


module.exports = comm;