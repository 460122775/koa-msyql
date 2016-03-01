var Notice = require('../modal/notice');
var Co_fs = require('co-fs');
var path = require('path');
var Config = require('../config');
//var oppressor = require('oppressor');
var User = require('../modal/users');
var huan_xing_service = require('../service/huan_xing');
var defer = require('co-defer');
var co_request = require('co-request');
var notice = {};
module.exports = notice;

/**
 * 添加消息通知
 */
notice.add_notice = function* (){
  var bodyValue = this.request.body;
  var obj = JSON.parse(bodyValue.str);
  try{
    var result = yield Notice.create(obj);
    var notice_id = result.id;
    yield sendRequest(result);
    var url = Config.notice_url+notice_id;
    yield Notice.update({url :url},{where :{id :notice_id}});
    yield this.body = {
      'error' :false,
      'msg' :'添加成功'
    }
  }catch(err){
    yield this.body = {
      'error' :true,
      'msg' :'添加失败'
    }
  }

};

/**
 * 制作页面
 */
var makeDir_Notice = function* (result,obj){
  var id = result.id;
  var path_view = path.dirname(__dirname)+'/views/view/notice/'+id+'.ejs';
  var isExit = yield Co_fs.exists(path_view);
  if(isExit){ //如果存在
    yield Co_fs.rmdir(path_view);
  }
  var html = yield obj.render('/view/notice/index',{obj :result,writeResp :false});
  yield Co_fs.writeFile(path_view,html);
}

/**
 * 访问生成的通知
 */
notice.get_notice = function* (){
  var id = this.params.id;
  var path_view = path.dirname(__dirname)+'/views/view/notice/'+id+'.ejs';
  var contentType = "text/plain";
  this.header['Content-Type'] =  contentType;
  var ret = yield Co_fs.stat(path_view);
  var lastModified = ret.mtime.toUTCString();
  //var ifModifiedSince = "If-Modified-Since".toLowerCase();
  this.header['Last-Modified'] = lastModified;
  var stream = yield Co_fs.createReadStream(path_view);
  stream.pipe(oppressor(this)).pipe(this);

}

/**
 * 发送系统消息
 */
notice.send = function* (){
  var app_name = Config.app_name;
  var notice_id = this.request.body.id;
  var notice_obj = yield Notice.findById(notice_id);
  yield Notice.update({isClose :true},{where :{id :notice_id}});
  if(notice_obj.image){
    notice_obj.image = notice_obj.image.split(',')[0] || '';
  }
  var user = yield User.findOne({where :{accountType :'NOTICE',isClose :false}});
  var im_from = app_name+'_'+user.id;
  var userArray = yield User.findAll({attributes :['id'],where :{accountType :'USER',isClose :false}});
  //var len = userArray.length<15 ?userArray.length :15;
  var len = userArray.length;
  var im_toList = [];
  var im_toArray = [];
  for(var i=0;i<len;i++){
    var im_to = app_name+'_'+userArray[i].id;
    im_toList.push(im_to);
    if((i+1)%15==0 ||((len-(i+1)<15)&&im_toList.length ==((len)%15))){
      im_toArray.push(im_toList);
      im_toList = [];
    }
  }
  var j = 0;
  var de = defer.setInterval(function*(){
    //console.log('j  '+j +' time '+new Date().getTime());
    yield huan_xing_service.sendNotice(im_toArray[j],notice_obj,im_from);
    if(j == im_toArray.length){
      //console.log('end1');
      clearInterval(de);
    }
  },500,function(){
    j++;
    //console.log('end2');
  });
  yield this.body = {
    error :false,
    msg :'发行成功'
  }
}

/**
 * 通知编辑跳转(get)
 */
notice.edit = function* (){
  var id = this.params.id;
  var back = this.params.back;
  var result = yield Notice.findById(id);
  if(result.image){
    var imageList = result.image.split(',');
    result.content = setContent(result.content,imageList);
  }
  yield this.render('/edit/notice',{obj :result,back :back});
};

/**
 * 通知编辑保存（post）
 */
notice.edit_post = function* (){
  var bodyValue = this.request.body;
  var obj = JSON.parse(bodyValue.str);
  var notice_id = obj.id;
  yield Notice.update(obj,{where :{id :notice_id}});
  var result = yield Notice.findById(notice_id);
  yield sendRequest(result);
  yield this.body = {
    error :false,
    msg :'修改成功!!!'
  }
}

function setContent(content, imageList) {
  var reg = new RegExp('\\n', 'ig');
  for (var i in imageList) {
    var img = '<br/><img src=\'' + imageList[i] + '\' style="width: 280px"/>';
    content = content.replace('<IMIMG>', img);
  }
  return content.replace(reg, '<br/>');
  //return HtmlDiscode(content);
}

var sendRequest = function* (obj){
  var images = [];
  if(obj.image){
    images = obj.image.split(',');
  }
  var obj_new = {
    id :obj.id,
    title :obj.title,
    image :images,
    content :obj.content,
    createTime :obj.createTime
  }
  var options = {
    url :Config.notice_url+obj.id,
    method :'POST',
    form :obj_new
  };
  yield co_request(options);
}