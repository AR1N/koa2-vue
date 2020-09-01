const jwt = require('jsonwebtoken')
const config = require('../../config')
const userDB = require('../database/models/user')
const argon2 = require('argon2')
const fs = require('fs')
const path = require('path')

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
                token: jwt.sign({ id: userData.id }, config.jwtKey,{ expiresIn: '12h',issuer:'Aren'} )
            },
           msg:'登录成功'
        }
    },
    async uploadFile(ctx){
        const file = ctx.request.files.file
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../../public/upload/') + `/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        reader.on('end',()=>{
             ctx.body = {
                code:1,
                msg:"上传成功！"
            };
        })

        reader.on('err', function(err){
             ctx.body = {
                code:0,
                msg:"上传失败！",
                data:err
            };
        })
    }

}


module.exports = Common