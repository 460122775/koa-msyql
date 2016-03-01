var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var Note_Likes = sequelize.define('note_likes',{
    id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
    userId :{type :Sequelize.BIGINT,allowNull:false},
    noteId :{type :Sequelize.BIGINT,allowNull:false},
    createTime :{type:Sequelize.STRING(15),allowNull:false}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'note_likes',
    timestamps :false
});

module.exports = Note_Likes;