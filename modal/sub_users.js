var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Admin = require('./admin');
var Users = require('./users');
var Sub_users = sequelize.define('sub_users',{
    id:{type :Sequelize.BIGINT,primaryKey :true,autoIncrement:true,unique:true},
    parentId :{type:Sequelize.BIGINT,allowNull:false},
    userId :{type:Sequelize.BIGINT,allowNull:false}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'sub_users',
    timestamps :false
});
Admin.hasMany(Sub_users,{as:'sub_users',foreignKey:'parentId'});
Sub_users.belongsTo(Admin,{as:'admin',foreignKey:'parentId'});

Sub_users.belongsTo(Users,{as:'users',foreignKey:'userId'});
module.exports = Sub_users;