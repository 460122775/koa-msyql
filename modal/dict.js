var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Dict = sequelize.define('dict',{
  id :{type :Sequelize.BIGINT,primaryKey :true,autoIncrement:true,unique:true},
  key :{type:Sequelize.STRING(30),allowNull :false,unique :true},
  name :{type :Sequelize.STRING(30),allowNull:false},
  version :{type :Sequelize.INTEGER,allowNull:false},
  createTime :{type :Sequelize.STRING(15)}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'dict',
  timestamps :false
});

module.exports = Dict;