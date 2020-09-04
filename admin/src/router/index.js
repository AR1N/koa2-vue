import Vue from "vue";
import VueRouter from "vue-router";
import Store from "@/store";
import Layout from "@/views/layout";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);


//解决报错Avoided redundant navigation to current location问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: "/",
        name: "index",
        component: Layout,
        redirect: "/home",
        children: [
            {
                path: "/home",
                name: "home",
                meta: {
                    title: "首页"
                },
                component: resolve => require(["@/views/home/index"], resolve) //懒加载路由
            },
            // {
            //     path: "/test",
            //     name: "test",
            //     // component: Layout,
            //     redirect: "/test/index",
            //     meta: {
            //         title: "测试"
            //     },
            //     children: [
            //         {
            //             path: "index",
            //             name: "testindex",
            //             meta: {
            //                 title: "测试首页"
            //             },
            //             component: resolve =>
            //                 require(["@/views/test/index"], resolve)
            //         }
            //     ]
            // },
            {
                path: "/member",
                name: "member",
                meta: {
                    title: "人员管理"
                },
                component: resolve => require(["@/views/member/index"], resolve)
            },
            {
                path: "/permission",
                name: "permission",
                component: resolve =>
                    require(["@/views/permission/index"], resolve)
            },
            {
                path: "/error/page404",
                name: "page404",
                meta: {
                    title: "404"
                },
                component: resolve =>
                    require(["@/views/error/page404"], resolve)
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/index") //初次就加载路由
    }
];
// let auth= [
//     { isMenu:false, path: "/home",name:'', icon: "ren-icon-yibiaopan",title: "不是菜单1"},
//     { isMenu:true, path: "/home1", name:'',icon: "el-icon-s-grid",title: "菜单1",child:[{path:'/test/index',name:'',title:'测试1'},{path:'/test',name:'',title:'测试2'}]},
//     { isMenu:true, path: "/home2", name:'',icon: "el-icon-loading",title: "菜单2",child:[{path:'/test',name:'',title:'测试1'},{path:'/test',name:'',title:'测试2'}]},
//     { isMenu:false, path: "/test/index",name:'', icon: "el-icon-menu",title: "不是菜单3"},
// ]

// function setAuthRoutes(authData=[]){
//     authData.forEach(item=>{
//         let authRoute = {
//             path:item.path,
//             name:item.name,
//             component:resolve => require([`@/views${item.path}`], resolve)
//         }
//         if(item.child){
//             setAuthRoutes(item.child);
//         }
//         routes[0].children.push(authRoute);
//     })
// }

// function resetRoutes(){
//     const newRouter = new router();
//     router.matcher = newRouter.matcher
// }

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
    scrollBehavior: () => ({ y: 0 })
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const token = Store.getters.user_token;
    if (token) {
        if (to.name === "login") {
            next({ name: "home" });
            NProgress.done();
        } else {
            const userInfo = Store.getters.user_info
            if(!userInfo){
                Store.dispatch('getUserProfile').catch(()=>{
                    Store.dispatch('handleLogout');
                })
            }else{
                next();
            }
            next();
            // const permissionData = Store.getters.user_permission;
            // if(permissionData.length == 0){
            //     Store.dispatch('getUserPermission').then(res=>{
            //         setAuthRoutes(res)
            //     }).catch(()=>{
            //         next({ path: "/login" });
            //         Store.dispatch('handleLogout');
            //         NProgress.done();
            //     })
            // }else{
            // next();
            // }
        }
    } else {
        if (to.name === "login") {
            next();
        } else {
            next({
                name: "login"
            });
        }
        NProgress.done();
    }
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
