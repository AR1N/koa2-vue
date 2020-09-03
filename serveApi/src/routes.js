const Router = require('koa-router')
const CommonRoute = new Router()//通用接口
const ProtectedRoute = new Router()//需权限接口

const Common = require('./controllers/common')
CommonRoute.post('/common/add',Common.register)
CommonRoute.post('/common/login',Common.login)

//上传
CommonRoute.post('/common/uploadFile',Common.uploadFile)



const user = require('./controllers/user')
ProtectedRoute.get('/user/profile',user.userProfile)
ProtectedRoute.post('/user/del',user.userDel)
ProtectedRoute.post('/user/edit',user.userEdit)
ProtectedRoute.get('/user/item',user.userItem)
ProtectedRoute.get('/user/list',user.userList)
ProtectedRoute.post('/user/modifyPWD',user.modifyPWD)




module.exports = {CommonRoute,ProtectedRoute}