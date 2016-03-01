var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Dic_tags = sequelize.define('dict_tags',{
  id:{type :Sequelize.BIGINT,primaryKey:true,autoIncrement:true,unique:true},
  key :{type:Sequelize.UUIDV1,unique:true,defaultValue:Sequelize.UUIDV1},
  value :{type:Sequelize.STRING(20),allowNull:false},
  version :{type:Sequelize.INTEGER,allowNull:false},
  type :{type:Sequelize.STRING(10)},
  createTime :{type:Sequelize.STRING(15)}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'dict_tags',
  timestamps :false
});

module.exports = Dic_tags;