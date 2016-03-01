var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Banner = sequelize.define('banner',{
  id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
  image :{type :Sequelize.STRING(100),allowNull:false},
  width :{type :Sequelize.INTEGER,allowNull :false},
  height :{type :Sequelize.INTEGER,allowNull :false},
  type :{type :Sequelize.STRING(10),allowNull :false},
  content :{type :Sequelize.STRING(100),allowNull :false},
  isClose :{type :Sequelize.BOOLEAN,allowNull :false},
  createTime :{type :Sequelize.STRING(15)}

},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'banner',
  timestamps :false
})

module.exports = Banner;