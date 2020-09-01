const { Sequelize, DataTypes } = require('sequelize')
const sequelizeDB = require('../db')

const User = sequelizeDB.define('user', {
    id:{
        type: Sequelize.INTEGER(255),
        primaryKey: true,            // 主键
        autoIncrement: true,         // 自动递增
        unique: true
    },
    account:{
        type: Sequelize.STRING(10),
        unique: true,
        validate: {
            // 限制长度范围
            min: 3,
            max: 15
        },
    },
    username: {
        type: Sequelize.STRING(10),
        allowNull: false
        // unique: true
    },
    password: {
        type:Sequelize.STRING(255),
        allowNull: false
    },
    // sex:{
    //     type:Sequelize.TEXT('tiny'),
    //     allowNull: false
    // }
}, 
{ 
    // tableName: 'user',//对应表名
	freezeTableName: true,
	timestamps: true
});
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。
//freezeTableName,为true, 参数停止 Sequelize 执行自动复数化.

//创建表，默认是false，true则是删除原有表，再创建
//  User.sync({ 
//     force: false 
// });

module.exports = User; 