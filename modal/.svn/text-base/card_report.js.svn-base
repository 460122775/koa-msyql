var Sequelize = require('sequelize');
var sequelize = require('./sequelize');
var Users = require('./users');
var Cards = require('./cards');
var Card_report = sequelize.define('card_report',{
    id :{type :Sequelize.BIGINT,primaryKey :true,autoIncrement:true,unique:true},
    userId :{type :Sequelize.INTEGER,allowNull:false},
    cardId :{type :Sequelize.INTEGER,allowNull :false},
    description:{type :Sequelize.STRING(100)},
    createTime :{type :Sequelize.STRING(15),allowNull :false}
},{
    freezeTableName :true,//默认false修改表名为复数，true不修改表名，与数据库同步
    tableName:'card_report',
    timestamps :false
});

Users.hasMany(Card_report,{as :'card_report',foreignKey :'userId'});
Card_report.belongsTo(Users,{as :'users',foreignKey:'userId'});

Cards.hasMany(Card_report,{as:'card_report',foreignKey:'cardId'});
Card_report.belongsTo(Cards,{as :'cards',foreignKey:'cardId'});

module.exports = Card_report;