const jwt = require('jsonwebtoken')
const config = require('../../config')
const userDB = require('../database/models/user')
const argon2 = require('argon2')


const Common = { 
   async register(ctx){
       let data = ctx.request.body
       const account = await userDB.findOne({
           where:{account:data.account}
       })
        if(account){
            ctx.body = {
                code:202,
                msg:'账号已存在'
            }
            return
        }
        let pwd = data.password || '123456'
       let secretPWD = await argon2.hash(pwd)//密码加密
       await userDB.create({
           username:data.username,
           account:data.account,
           password:secretPWD
       }).then(res=>{
           ctx.body = {
               code:1,
               msg:'操作成功'
           }
       }).catch(err=>{
           ctx.body = {
               code:0,
               msg:'操作失败',
               data:err
           }
       })

    },
    async login(ctx) {
        const user = ctx.request.body
        const userData = await userDB.findOne({
            where:{account:user.account}
        })

         if(!userData){
             ctx.body = {
                 code:201,
                 msg:'账号不存在'
             }
             return
         }
        const verify = await argon2.verify(userData.password,user.password)
        if(!verify){
            ctx.body = {
                code:203,
                msg:'密码错误'
            }
            return
        }
        ctx.body= {
            code:1,
            data:{
                id:userData.id,
                account:userData.account,
                username:userData.username,
                token: jwt.sign({ id: userData.id }, config.jwtKey,{ expiresIn: '12h',issuer:'Aren'})
            },
           msg:'登录成功'
        }
    }

}


module.exports = Common