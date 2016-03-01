var $ = require('underscore');

var request = require('request');

var obj2 = [ { position: 'params', prop: 'cardId', type: 'int' },
  { position: 'params', prop: 'pageStart', type: 'int' },
  { position: 'params', prop: 'pageSize', type: 'int' } ];
//var listArray = [1,3,4,5];

var RULE_REG = /^(\w+)\s?(\w+)?\s?(\w+)?$/;
var objList = {
  'cardId params int':['required'],
  'pageStart params int':['required'],
  'pageSize params int':['required']
};
//(function main(){
//  //var objArray = $.map(objList,function(v,k){
//  //  console.log('v '+v+' k '+k);
//  //  return parseRuleKey(k);
//  //})
//  //console.log(objArray);
//  var actionParam = $.map(obj2,function(p){
//    return p.prop;
//  })
//  console.log(actionParam);
//}())


function parseRuleKey(key) {
  var match = key.match(RULE_REG);
  if (!match)
    throw new Error('规则不正确: '+key);
  return {
    position:match[2],
    prop: match[1],
    type: match[3] || 'string'
  };
}

(function main(){
  var option = {
    url :'http://192.168.1.58:2665/api/group/topics/1/viewpoints/1/10',
    method :'get',
    headers :{
      system :'web',
      version :1
    }
  }
  request(option,function(err,response,body){
    console.log(body);
  })
}())