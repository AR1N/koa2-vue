
const config = {
     jwtKey : 'AREN_KEY',
     aes:{
         key:'qwerdfabcdefghij',
         iv:'0123456789qwerdf'
     },
     sql:{
        // host: '192.168.1.27', //主机名
        host: 'localhost', //主机名
        database: 'node_demo', //数据库名
        username: 'root',//账号
        password: 'superadmin',//密码   
        port: 3306, //端口号，mysql默认3306
     }
}

module.exports = config