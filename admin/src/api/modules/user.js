import {get,post} from '@/util/request'
const user = {
    //注册
    register(data){
        return post('/common/add',data)
    },
    //登录
    login(data){
        return post('/common/login',data)
    },
    //新增
    // addUser(data){
    //     return post('/user/add',data)
    // },
    //删除
    delUser(id){
        return post('/user/del',{id:id})
    },
    //编辑
    editUser(data){
        return post('/user/edit',data)
    },
    userItem(id){
        return get('/user/item',{id:id})
    },
    //列表
    userList(data){
        return get('/user/list',data)
    },
    modifyPwd(pwd){
        return post('/user/modifyPWD',{password:pwd})
    }
}



export default user
