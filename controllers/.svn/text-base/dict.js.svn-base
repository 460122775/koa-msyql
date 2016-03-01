var Dict_tags = require('../modal/dict_tags');
var Dict_sexAge = require('../modal/dict_sexAge');
var Dict = require('../modal/dict');
var CachedService = require('../service/cached_redis');
var Modal_Map = {
  dict_tags :Dict_tags,
  dict_sexAge :Dict_sexAge,
  dict :Dict
};
var dict = {};
module.exports = dict;
/**
 * 验证字典key的唯一值
 */
dict.validate_key = function* (){
  var modal = this.params.modal;
  var str = this.request.body.str;
  var result = yield Modal_Map[modal].findOne({where :{key :str}});
  var isTrue = false;
  if(!result){
    isTrue = true;
  }
  yield this.body = {
    error :isTrue
  }
};

/**
 * 添加字典功能
 */
dict.add_dict = function* (){
  var modal = this.params.modal;
  var str = this.request.body.str;
  var obj = JSON.parse(str);
  yield Modal_Map[modal].create(obj);
  if('dict_sexAge'==modal){
    yield updateCatch();
  }
  yield this.body = {
    error:false,
    msg:'添加成功!'
  }
};

/**
 * 编辑修改
 */
dict.edit_dict = function* (){
  var modal = this.params.modal;
  var str = this.request.body.str;
  var obj = JSON.parse(str);
  var id = obj.id;
  yield Modal_Map[modal].update(obj,{where :{id :id}});
  if('dict_sexAge'==modal){
    yield updateCatch();
  }
  yield this.body={
    error:false,
    msg :'修改成功'
  }
};

/**
 * 验证唯一,如果没有就保存
 */
dict.validate_value_insert = function* (){
  var modal = this.params.modal;
  var strArray = this.request.body.str;
  var objArray = [];
  for(str of strArray){
    var result = yield Modal_Map[modal].findCreateFind({
      where :{
        value :str
      },
      defaults :{
          version :1,
          type :'USER',
          createTime :new Date().getTime()
      }
    });
    var obj = {
      key :result[0].key,
      value :str
    };
    objArray.push(obj);
  }
  yield this.body = {
    error :false,
    obj :objArray
  }
};
/**
 * 删除字典
 */
dict.delete_dic = function* (){
  var modal = this.params.modal;
  var id = this.request.body.id;
  yield Modal_Map[modal].destroy({where :{id :id}});
  if('dict_sexAge' == modal){
    yield updateCatch();
  }
  yield this.body={
    error:false,
    msg :'删除成功!!'
  }
}


var updateCatch = function *(){
  var result = yield Dict_sexAge.findAll({attributes :['id','key','value']});
  yield CachedService.setKey('dict_sexAge',result);
};

/**
 * 数据放到redis中
 */
dict.release = function* (){
  var objList = {};
  var result = yield Dict.findAll();
  for(var obj of result){
    objList[obj.key] = obj.version;
  }
  var str = JSON.stringify(objList);
  yield CachedService.hSetKey('sysDict','sysDictVersion',str);
  yield this.body = {
    error :false,
    msg :'发布成功!'
  }
}