const userDB = require('../database/models/user')
const argon2 = require('argon2')
const sequelize = require('sequelize')
const  Op = sequelize.Op

const user = {
    async userEdit(ctx) {
        let data = ctx.request.body
        let pwd = data.password || '123456'
        let secretPWD = await argon2.hash(pwd)//密码加密
        const account = await userDB.findOne({
            where: {account: data.account}
        })

        if(data.id){
            if (!data.username || !data.account) {
                ctx.body = {
                    code: 0,
                    msg: '缺失参数'
                }
                return
            }
            if(account && data.id != account.id){
                ctx.body = {
                    code: 202,
                    msg: '账号已存在'
                }
                return
            }
            await userDB.update({username: data.username,account:data.account}, {
                where: {id: data.id}
            }).then(res => {
                if (res == 1) {
                    ctx.body = {
                        code: 1,
                        msg: '操作成功'
                    }
                }
            }).catch(err => {
                ctx.body = {
                    code: 0,
                    msg: '操作失败',
                    data: err,
                    account:account
                }
            })
        }else {
            if (account) {
                ctx.body = {
                    code: 202,
                    msg: '账号已存在'
                }
                return
            }
            await userDB.create({
                username: data.username,
                account: data.account,
                password: secretPWD
            }).then(res => {
                ctx.body = {
                    code: 1,
                    msg: '操作成功'
                }
            }).catch(err => {
                ctx.body = {
                    code: 0,
                    msg: '操作失败',
                    data: err
                }
            })
        }
    },
    async userDel(ctx) {
        let data = ctx.request.body
        if (!data.id) {
            ctx.body = {
                code: 0,
                msg: '缺少参数：id',
            }
            return
        }
        await userDB.destroy({
            where: {
                id: data.id
            }
        }).then(res => {
            if(res==1){
                ctx.body = {
                    code: 1,
                    msg: '操作成功',
                    data: res
                }
            }else {
                ctx.body = {
                    code: 0,
                    msg: '操作失败'
                }
            }
        })
    },
    async userItem(ctx){
        const query = ctx.query
        await userDB.findOne({
            where:{
                id:query.id
            },
            attributes: ['id', 'account', 'username']
        }).then(res=>{
            ctx.body = {
                code: 1,
                msg: '获取成功',
                data:res
            }
        })
        // await next()
    },
    async userList(ctx) {
        const query = ctx.query
        await userDB.findAndCountAll({
            where:{
                username:{
                    [Op.like]:`%${query.username || ''}%`//模糊查询
                },
                id:{
                    [Op.ne]:1//id不为1
                }
            },
            offset: (Number(query.page) - 1) * query.limit,
            limit: Number(query.limit),
            attributes: ['id', 'account', 'username'],
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(res => {
            ctx.body = {
                code: 1,
                msg: '获取成功',
                data: res
            }
        }).catch(err => {
            ctx.body = {
                code: 0,
                msg: '获取失败',
                data: err
            }
        })
    },
    async modifyPWD (ctx){
        let data = ctx.request.body
        let secretPWD = await argon2.hash(data.password)
        await userDB.update({password: secretPWD}, {
            where: {id: ctx.state.user.id}
        }).then(res=>{
            ctx.body = {
                code: 1,
                msg: '修改成功'
            }
        }).catch(err=>{
            ctx.body = {
                code: 0,
                msg: '操作失败',
                data: err
            }
        })
    }
}

module.exports = user