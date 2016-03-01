module.exports = {
    key :'my_script',
    mysql :{ //本机
        host :'127.0.0.1',
        user :'',
        password :'123456',
        database :'mysql',
        port :'3306'
    },

    cookie :{
        maxage :30 * 60 * 1000
    },
    port :5252,
    huang_xing :{ //本机
        id :'378',
        app_name :'webchat',
        client_id :'',
        client_secret :''

    },
    qiniu :{
        ACCESS_KEY :'',
        SECRET_KEY :''
    },
    jpush :{
        URL :'https://api.jpush.cn/v3/push',
        METHOD :'POST',
        appKey :'',
        masterSecret :''
    },

    ueditor_qiniu  : {//正式
        domin :'',
        url :''
    },
    users :{
        comm_pwd :'123456'
    },
    notice_url :'',
    app_name :'',
    redis :{
        host :'127.0.0.1',
        port :6379,
        pwd :'root'
    },
    greet :[
        '我想跟你一起逛漫展',
        '我想请你吃正宗切糕'
    ]
}
