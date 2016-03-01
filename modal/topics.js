var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Topics = sequelize.define('topics',{
    id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
    title :{type :Sequelize.STRING(100),allowNull:false},
    count :{type:Sequelize.BIGINT,defaultVaule :0},
    time :{type:Sequelize.STRING(15)},
    createTime :{type :Sequelize.STRING(15),allowNull :false}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'topics',
    timestamps :false
});

module.exports = Topics;