var qiniu = require('./qiniu');
var busboy = require('co-busboy');
var Buffer = require('buffer').Buffer;
var bufferhelper = require('bufferhelper');
var Config = require('../config');
var fs = require('co-fs');
var ue = {};
module.exports = ue;
ue.ue_up = function* (){
  var action = this.query.action;
  if('uploadimage' == action){
    var parts = busboy(this);
    var part;
    while(part = yield parts){
        if(!part.length){
          var filename = part.filename;
          var key = 'notice/' + (new Date()).getTime() + Math.floor(Math.random() * 100000)+'/'+filename;
          var buf = new bufferhelper();
          buf = yield stream_buf(part,buf);
          var result =yield qiniu.bufferUpload(buf.toBuffer(),key);
          var obj = {
            'url': Config.ueditor_qiniu.url + result.key+'?size='+result.w+'*'+result.h,
            'original': filename,
            'state': 'SUCCESS'
          }
          var str = JSON.stringify(obj);
          this.body =str;
        }
    }
  }else{
    this.header = {'Content-Type': 'application/json'};
    this.redirect('/ueditor/nodejs/config.json');
  }
}

var stream_buf = function (part,buf){
  return new Promise(function(resolve,reject){
    part.on('data',function(data){
      buf.concat(data);
    });
    part.on('end',function(){
      resolve(buf);
    })
  })
}