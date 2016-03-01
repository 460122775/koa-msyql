var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Admin = sequelize.define('admin',{
    id:{type :Sequelize.BIGINT,primaryKey :true,autoIncrement:true,unique:true},
    username :{type:Sequelize.STRING(50),unique:true},
    password :{type:Sequelize.STRING(50),allowNull:false},
    isClose :{type:Sequelize.BOOLEAN,allowNull:false},
    isSuper :{type:Sequelize.BOOLEAN,allowNull:false},
    token :{type:Sequelize.STRING(100)},
    createTime :{type :Sequelize.STRING(15)}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'admin',
    timestamps :false
});

module.exports = Admin;