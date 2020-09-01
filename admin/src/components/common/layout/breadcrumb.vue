<template>
    <div class="breadcrumb c-flex-align" v-if="list.length>0">
         <div class="tip">当前位置：</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in list" :key="index">{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list:[]
        };
    },
    created(){
        this.getRoutes();
    },
    methods:{
        getRoutes(){
            let allRoute = this.$route.matched.filter(item=>{
                 return item.meta && item.meta.title
            })
            this.list = allRoute.map(item=>{
                return {title:item.meta.title}
            })
        }
    },
    watch:{
        $route(){
            this.getRoutes();
        }
    }
};
</script>

<style lang='scss' scoped>
.breadcrumb{
    .tip{
        color: #409eff;
        font-size: 14px;
    }
    margin-bottom: 20px;
}
</style>
