var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var User_logs = sequelize.define('user_logs',{
  id :{type :Sequelize.BIGINT,primaryKey :true,autoIncrement:true,unique:true},
  userId :{type:Sequelize.BIGINT,allowNull :false},
  toUserId :{type :Sequelize.BIGINT},
  action :{type :Sequelize.STRING(15)},
  direct_actionFor :{type :Sequelize.BIGINT,defaultValue :0},
  indirect_actionFor :{type :Sequelize.BIGINT,defaultValue :0},
  description :{type :Sequelize.STRING(15)},
  ip :{type :Sequelize.STRING(15)},
  location :{type :Sequelize.STRING(100)},
  createTime :{type :Sequelize.STRING(15)}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'user_logs',
  timestamps :false
});

module.exports = User_logs;