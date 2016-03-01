var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Users = require('./users');
var Topics = require('./topics');
var Cards = sequelize.define('cards',{
    id :{type :Sequelize.BIGINT,autoIncrement:true,primaryKey :true,unique:true},
    topicId :{type :Sequelize.BIGINT,allowNull:false},
    content :{type :Sequelize.STRING(100)},
    image :{type :Sequelize.STRING(50)},
    userId :{type :Sequelize.BIGINT},
    isClose :{type :Sequelize.BOOLEAN,allowNull :false},
    createTime :{type :Sequelize.STRING(15),allowNull :false}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'cards',
    timestamps :false
});
Users.hasMany(Cards,{as :'cards',foreignKey :'userId'});
Cards.belongsTo(Users,{as :'users',foreignKey:'userId'});

Topics.hasMany(Cards,{as :'cards',foreignKey:'topicId'});
Cards.belongsTo(Topics,{as :'topics',foreignKey:'topicId'});
module.exports = Cards;