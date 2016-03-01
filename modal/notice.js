var Sequelize = require('sequelize');
var sequelize = require('./sequelize');


var Notice = sequelize.define('notice',{
  id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
  title :{type :Sequelize.STRING(30)},
  image :{type :Sequelize.STRING(300)},
  url :{type :Sequelize.STRING(50)},
  content :{type :Sequelize.STRING(300)},
  isClose :{type :Sequelize.BOOLEAN,allowNull :false},
  createTime :{type :Sequelize.STRING(15),allowNull :false}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'notice',
  timestamps :false
});

module.exports = Notice;