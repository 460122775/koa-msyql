var Admin = require('../modal/admin');
var MD5Tool = require('./MD5');
var admin = {};
module.exports = admin;

/**
 * 添加系统管理员
 */
admin.add_post = function* (){
  var str = this.request.body.str;
  var obj = JSON.parse(str);
  obj.password = MD5Tool.MD5(obj.password);
  yield Admin.create(obj);
  yield this.body = {
    error :false,
    msg :'添加成功'
  }

};

/**
 * 修改密码(get)view
 */
admin.modify = function* (){
  var id = this.session.id;
  var result = yield Admin.findById(id);
  if(result){
    yield this.render('/view/changePwd',{layout :false});
  }else{
    this.redirect('/loginOut');
  }

}

/**
 * 修改管理员密码
 */
admin.update_password = function* (next){
  var str = this.request.body.str;
  var obj = JSON.parse(str);
  obj.password = MD5Tool.MD5(obj.password);
  delete obj.repassword;
  var id = obj.id;
  yield Admin.update(obj,{where :{id :id}});
  yield this.body={
    error :false,
    msg :'修改成功!!!'
  };
  yield next;
};