
var logger = require('koa-logger');
//var serve = require('koa-static');
var  staticCache = require('koa-static-cache');
var koa = require('koa');
var app = koa();

var path = require('path');
var router = require('koa-router')();
var routers = require('./routes');
var bodyParser = require('koa-bodyparser');
var render = require('koa-ejs');
//var session = require('koa-session');
var session_generic = require('koa-generic-session');
var MysqlStore = require('koa-mysql-session');

var Config = require('./config');
var Admin = require('./modal/admin');
// log requests

app.use(logger());//日志
app.use(bodyParser()); //解析post请求数据

//app.use(serve(__dirname + '/public')); //加载静态资源文件夹
app.use(staticCache(__dirname + '/public')); //加载静态资源文件夹缓存
//
app.use(function *(next){
    this; // is the Context
    this.request; // is a koa Request
    this.response; // is a koa Response
    yield  next;
});
app.env = process.env.NODE_ENV || 'development';
app.keys = [Config.key];
//app.use(function*(next){
//    if(this.status !=='404'){
//        return yield  next;
//    }
//    this.body = 'page not found';
//    yield next;
//});
//app.use(session(app));

app.use(session_generic({
    store: new MysqlStore(Config.mysql),
    rolling: true,
    cookie: {
        maxage:Config.cookie.maxage
    }
}));
app.use(function *(next) {
    //var admin = yield Admin.findById(this.cookies.get('id'));
    this.state.session = this.session;
    //console.log(this.session);
    yield next;
});
render(app,{ //跳转
    root :path.join(__dirname,'views'),
    layout:false,
    viewExt :'ejs'
});

routers(router,app);
app.use(router.routes());
//app.use(router.allowedMethods());
app.on('error',function(err){
    console.log(err);
})

// listen
app.listen(Config.port,function(){
    console.log('listening on port :'+Config.port);
});
