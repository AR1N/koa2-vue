<template>
    <div class="menu-item">
        <div v-for="(item,index) in authRoutes" :key="index">
            <template v-if="!item.isMenu">
                <el-menu-item :index="item.path">
                    <i :class="item.icon"></i>
                    <span slot="title" class="title">{{item.title}}</span>
                </el-menu-item>
            </template>
            <template v-else>
                <el-submenu :index="item.path">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span slot="title" class="title">{{item.title}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item :index="sub.path" v-for="(sub,subIndex) in item.child" :key="subIndex">{{sub.title}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "MenuItem",
    props:{
        authRoutes:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data() {
        return {
        };
    }
};
</script>

<style lang='scss' scoped>
.menu-item{
    .title{
        margin-left: 15px;
    }
    i{
        color: inherit;
    }
}
</style>
