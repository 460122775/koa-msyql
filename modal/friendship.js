var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Users = require('./users');
var Friendship = sequelize.define('friendship',{
  id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
  userId :{type:Sequelize.BIGINT,allowNull:false},
  toUserId :{type:Sequelize.BIGINT,allowNull:false},
  createTime :{type :Sequelize.STRING(15)}
},{
  freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
  tableName:'friendship',
  timestamps :false
});


//Users.hasMany(Friendship,{as :'friendship',foreignKey :'toUserId'});
//Friendship.belongsTo(Users,{as :'users',foreignKey:'toUserId'});

module.exports = Friendship;