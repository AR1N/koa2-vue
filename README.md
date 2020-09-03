## koa2+vue

### 前端
* `vue-cli`
* `vue-router`
* `vuex`
* `axios`
* `element-ui`
  
### 后端
* `koa2`
* `koa-router`
* `mysql=>ORM(sequelize)`
* `jsonwebtoken`
* `crypto-js`加密

### 起步
> * 搭建一个简单的koa服务
```
    const Koa = require('koa')
    const app = new Koa()
    app.listen(3000, () => {
        console.info('koa服务已启动~')
    })
```
* **解决跨域问题**
```
    const cors = require('koa2-cors')
    app.use(cors({
        origin: function (ctx) {
            return 'http://localhost:8080'; // 允许 http://localhost:8080 这个域名的请求
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    }));
```
* **获取请求参数**
```
    const koabody = require('koa-body')
    app.use(koabody({
        multipart: true,
        formidable: {
            maxFileSize: 10 * 1024 * 1024  //设置上传文件大小最大限制，最大10M，默认2M
        }
    }))
```
> * `get`请求参数通过`ctx.query`
> 
>*  `post`请求参数通过`ctx.request.body`

### MODEL（模型）

> * 通过`sequelize`来作`mysql`的ORM

```
    //db.js
    const Sequelize = require('sequelize')
    const config = require('./config')//mysql相关配置

    const sequelize = new Sequelize(config.sql.database, config.sql.username, config.sql.password, {
        host: config.sql.host, //数据库地址
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
```
> * 建立数据模型

```
    //userModel.js
    const { Sequelize, DataTypes } = require('sequelize')
    const sequelizeDB = require('./db')

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
        }
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
```

### 路由
> * 路由分为通用无需权限路由及受保护的需权限路由
>
>* 受保护路由通过JWT中间件来限制
```
    const Router = require('koa-router')
    const koajwt = require('koa-jwt')
    const jwt = require('jsonwebtoken')
    const userDB = require('./models/userModel')
    const jwtKey = 'AREN_KEY'

    const CommonRoute = new Router()//通用路由
    const ProtectedRoute = new Router()//受保护路由

    //登录
    CommonRoute.post('/common/login',async (ctx,next)=>{
        const req = ctx.request.body
        const userData = await userDB.findOne({
           where:{account:req.account}
       })
        if(!userData){
             ctx.body = {
                 code:201,
                 msg:'账号不存在'
             }
             return
         }
        ctx.state = {user:userData}
        ctx.body= {//签发token
            code:1,
            data:{
                id:userData.id,
                account:userData.account,
                username:userData.username,
                token: jwt.sign({ id: userData.id }, jwtKey,{ expiresIn: '12h',issuer:'Aren'} )
            },
           msg:'登录成功'
        }
    })
    //用户信息
    ProtectedRoute.post('/user/item',async (ctx,next)=>{
       const query = ctx.query
        await userDB.findOne({
            where:{
                id:query.id
            },
            attributes: ['id', 'account', 'username']
        }).then(res=>{
            if(res){
                ctx.body = {
                    code: 1,
                    msg: '获取成功',
                    data:res
                }
            }else {
                ctx.body = {
                    code: 101,
                    msg: '记录不存在'
                }
            }
        })
    })

    app.use(CommonRoute.routes()).use(CommonRoute.allowedMethods());
    app.use(koajwt({secret: jwtKey}));
    app.use(ProtectedRoute.routes()).use(ProtectedRoute.allowedMethods());

```

### 异常捕获/处理
> * 在入口统一处理错误

```
    app.use(async (ctx, next) => {
        let status = 0
        let errMsg = '发生未知错误'
        try {
            await next()
            status = ctx.status;
        } catch (err) {
            console.log(err)
            status =  err.statusCode || err.status || 500
            if(err.message){
                errMsg = err.message
            }
            if (err.message.startsWith('maxFileSize exceeded')){
                status = 406
                errMsg = '上传文件过大'
            }
            if(status == 401){
                errMsg = '无效令牌'
            }
        }
        ctx.response.status = 200
        if(status >= 400){
            if(status == 405){
            errMsg = 'Method Not Allowed'
           }
            ctx.body = {
                code:status,
                msg:errMsg
            }
        }
    })
```