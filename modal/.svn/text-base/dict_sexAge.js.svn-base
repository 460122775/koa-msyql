var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Dic_sexAge = sequelize.define('dict_sexAge',{
  id:{type :Sequelize.BIGINT,primaryKey:true,autoIncrement:true,unique:true},
  key :{type:Sequelize.UUIDV1,unique:true,defaultValue:Sequelize.UUIDV1},
  value :{type:Sequelize.STRING(20),allowNull:false},
  version :{type:Sequelize.INTEGER,allowNull:false},
  createTime :{type:Sequelize.STRING(15)}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'dict_sexAge',
  timestamps :false
});

module.exports = Dic_sexAge;