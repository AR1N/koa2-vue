const Router = require('koa-router')
const CommonRoute = new Router()//通用接口
const Route = new Router()//需权限接口

const Common = require('./controllers/common')
CommonRoute.post('/common/add',Common.register)
CommonRoute.post('/common/login',Common.login)



const user = require('./controllers/user')
Route.post('/user/del',user.userDel)
Route.post('/user/edit',user.userEdit)
Route.get('/user/item',user.userItem)
Route.get('/user/list',user.userList)
Route.post('/user/modifyPWD',user.modifyPWD)




module.exports = {CommonRoute,Route}