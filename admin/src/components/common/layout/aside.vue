<template>
    <div class="layout-menu">
        <el-menu
            :default-active="$route.path"
            router
            class="menu-root"
            :collapse="setting.isCollapse"
            :background-color="setting.navBg"
            :text-color="setting.navColor"
            :active-text-color="setting.actNavColor"
        >
            <menu-item :authRoutes='authRoutes'></menu-item>
        </el-menu>
    </div>
</template>

<script>
import MenuItem from './menu-item'
export default {
    name: "Aside",
    components:{
        MenuItem
    },
    props: {
        userSetting: {
            type: Object
        },
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            setting: null,
            authRoutes: [
                { isMenu:false, path: "/home", icon: "ren-icon-yibiaopan",title: "首页"},
                { isMenu:true, path: "/test", icon: "el-icon-s-grid",title: "一级菜单",child:[{path:'/test/index',title:'测试1'},{path:'/test/test',title:'测试2'}]},
                { isMenu:false, path: "/member", icon: "ren-icon-chengyuanyonghuguanli",title: "人员管理"},
                { isMenu:false, path: "/permission", icon: "ren-icon-jiaosequanxian",title: "权限管理"},
                { isMenu:false, path: "/error/page404", icon: "el-icon-menu",title: "404"}
            ]
        };
    },
    methods: {},
    watch: {
        userSetting: {
            handler: function(val) {
                this.setting = val;
            },
            immediate: true,
            deep: true
        }
    }
};
</script>

<style lang='scss' scoped>
.layout-menu {
    .menu-root {
        height: calc(100vh - 66px);
        width: 220px;
        overflow-x: hidden;
        box-sizing: border-box;
    }
    .el-menu--collapse {
        width: 64px;
    }
}
</style>
