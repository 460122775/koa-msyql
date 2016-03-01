var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Users = require('./users');
var Cards = require('./cards');

var Notes = sequelize.define('notes',{
    id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
    cardId :{type :Sequelize.BIGINT,allowNull:false},
    userId :{type :Sequelize.BIGINT,allowNull:false},
    content :{type :Sequelize.STRING(40)},
    likeCount:{type:Sequelize.BIGINT},
    isClose :{type :Sequelize.BOOLEAN,allowNull :false},
    createTime :{type :Sequelize.STRING(15),allowNull :false}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'notes',
    timestamps :false
});

Users.hasMany(Notes,{as:'notes',foreignKey:'userId'});
Notes.belongsTo(Users,{as:'users',foreignKey:'userId'});

Cards.hasMany(Notes,{as:'notes',foreignKey:'cardId'});
Notes.belongsTo(Cards,{as:'cards',foreignKey:'cardId'});
module.exports = Notes;