var redis = require('redis');
var Config = require('../config');
var rds_pwd = {auth_pass :Config.redis.pwd};
var cached = {};
module.exports = cached;
var redisClient = redis.createClient(Config.redis.port,Config.redis.host,rds_pwd);

/**
 * 根据key查询
 * @param key
 * @returns {Promise}
 */
cached.getByKey = function(key){
  return new Promise(function(resolve,reject){
    redisClient.get(key,function(err,val){
      if(err){
        return reject(err);
      }else{
        var obj = JSON.parse(val);
        return resolve(obj);
      }
    })
  })
};
/**
 * 将key与val插入到redis
 * @param key
 * @param val
 * @returns {Promise}
 */
cached.setKey = function(key,val){
  var str = JSON.stringify(val);
  return new Promise(function(resolve,reject){
    redisClient.set(key,str,function(err,val){
      if(val){
        return resolve(val);
      }else if(err){
        return reject(err);
      }
    });

  })
};

/*
根据key删除
 */
cached.delKey = function(key){
  return new Promise(function(resolve,reject){
    redisClient.del(key,function(err,val){
        if(val){
          return resolve(val);
        }else if(err){
          return reject(err);
        }
    })
  })
};

cached.hSetKey = function(key,secondKey,val){
  return new Promise(function(resolve,reject){
    redisClient.hset(key,secondKey,val,function(err,result){
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}