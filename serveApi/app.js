const Koa = require('koa')
const koabody = require('koa-body')
const cors = require('koa2-cors')
const jwt = require('koa-jwt')
const verifyAuth = require('./src/utils/authHeader')
const config = require('./config')
const {CommonRoute, Route} = require('./src/routes')

const app = new Koa()


app.use(cors({
    origin: function (ctx) {
        return 'http://localhost:8080'; // 只允许 http://localhost:8080 这个域名的请求
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'CLIENT-TYPE', 'USER-TOKEN']
}));


app.use(koabody({multipart: true}))


//无需token路由
app.use(CommonRoute.routes()).use(CommonRoute.allowedMethods());
//token验证中间件
app.use(async (ctx, next) => {
    const token = ctx.headers.authorization;
    if (!token) {
        ctx.body = {
            code: 402,
            msg: '缺少令牌'
        }
        return
    }
    await verifyAuth.verify(token).then(res => {
        ctx.state = {//请求的用户id即为ctx.state.user.id
            data: res
        };
    }).catch(err => {
        // ctx.status = 401
        ctx.body = {
            code: 401,
            msg: '无效令牌',
            data: 'dd:'+err,
            req: ctx.request
        }
        return
    })
    await next()

})
app.use(async (ctx, next) =>{
    await next().catch((err) => {//统一错误处理
        if (err.status == 401) {
            ctx.body = {
                code: err.status,
                msg: '无效令牌',
                data: err,
                req: ctx.request
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '服务器错误：' + err
            }
        }

    });
})

app.use(jwt({secret: config.jwtKey}));
// 需token路由
app.use(Route.routes()).use(Route.allowedMethods());


app.on('error', function(err, ctx){
    console.log('server error', err);
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

app.listen(3000, () => {
    console.info('koa服务已启动~')
})

