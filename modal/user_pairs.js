var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Users = require('./users');
var User_pairs = sequelize.define('user_pairs',{
    id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
    userId :{type:Sequelize.BIGINT,allowNull:false},
    targetUserId :{type:Sequelize.BIGINT,allowNull:false},
    isMatch :{type:Sequelize.BOOLEAN},
    createTime :{type :Sequelize.STRING(15)}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'user_pairs',
    timestamps :false
});

Users.hasMany(User_pairs,{as :'user_pairs',foreignKey :'targetUserId'});
User_pairs.belongsTo(Users,{as :'users',foreignKey:'targetUserId'});

module.exports = User_pairs;