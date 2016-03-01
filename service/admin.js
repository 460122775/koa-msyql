var Admin = require('../modal/admin');

var admin = {};
module.exports = admin;
admin.login = function* (username,password,token){
    var admin = yield Admin.findOne({where :{username :username,password:password,isClose :false}});
    var obj = {};
    if(admin){
        yield Admin.update({token:token},{where:{username:username,password:password}});
        obj = {
            isTrue :true,
            admin :admin
        }
    }else{
         obj = {
            isTrue :false,
            admin :{}
        };

    }
    return obj;
}