const Config = require('./src/config/nodeConfig')

if(process.env.NODE_ENV==='development'){
    module.exports = {
        devServer: {
            // proxy:'http://localhost:3000'
            host: 'localhost',
            port: 8080,
            https: false,
            proxy: {//配置跨域
                [Config.devApiAlias]: {
                    target: Config.devUrl,//真实的后台接口
                    ws: true,
                    changOrigin: true,//允许跨域
                    pathRewrite: {
                        ['^'+Config.devApiAlias]: ''
                    }
                }
            }
        }
    }
}

