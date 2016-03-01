var Sequelize = require('sequelize');
var Config = require('../config');

module.exports = sequelizeDB = new Sequelize(
    Config.mysql.database,
    Config.mysql.user,
    Config.mysql.password,
    {
        host :Config.mysql.host,
        port :Config.mysql.port,
        dialect:'mysql',
        define:{timestamps:false},
        native :false
    }
);