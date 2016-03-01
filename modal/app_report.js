var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Users = require('./users');
var App_report = sequelize.define('app_report',{
  id:{type :Sequelize.BIGINT,primaryKey :true,autoIncrement:true,unique:true},
  userId :{type:Sequelize.BIGINT,allowNull :false},
  description :{type:Sequelize.STRING(255)},
  createTime :{type :Sequelize.STRING(15)}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'app_report',
  timestamps :false
});

App_report.belongsTo(Users,{as :'users',foreignKey :'userId'});
Users.hasMany(App_report,{as :'app_report',foreignKey :'userId'});

module.exports = App_report;