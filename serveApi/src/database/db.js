const Sequelize = require('sequelize')
const config = require('../../config')


const sequelize = new Sequelize(config.sql.database, config.sql.username, config.sql.password, {
    host: config.sql.host, //数据库地址
    port:3306,
    dialect: 'mysql', //指定连接的数据库类型
    pool: {
        max: 5, //连接池最大连接数量
        min: 0, //最小连接数量
        idle: 10000, //如果一个线程 10秒内没有被使用过的话，就释放
    },
    dialectOptions: {//格式化时间格式
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true
    },
    timezone: '+08:00', //改为标准时区
    logging: false, // 执行过程会log一些SQL的logging，设为false不显示
})

// sequelize.authenticate().then(()=>{
//     console.log('测试成功')
// }).catch(err=>{
//     console.log(err)
// })
//  sequelize.sync({ force: true });  
sequelize.sync();  
console.log("所有模型均已成功同步."); 

module.exports = sequelize