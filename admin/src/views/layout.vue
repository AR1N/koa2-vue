<template>
    <div class="layout">
        <el-container>
            <el-header height="66px">
                <Header :defaultset='userSet' @changeSet="changeSetting"></Header>
            </el-header>
            <el-container>
                <el-aside width="220px">
                    <Aside :userSetting="userSet"></Aside>
                </el-aside>
                <el-main>
                    <Breadcrumb></Breadcrumb>
                    <div class="main">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Header from "@/components/common/layout/header";
import Aside from "@/components/common/layout/aside";
import Breadcrumb from "@/components/common/layout/breadcrumb";

export default {
    name: "layout",
    components: {
        Header,
        Aside,
        Breadcrumb
    },
    data() {
        return {
            userSet: {
                 headerBg: "#434a50",
                appColor: "#ffffff",
                navBg: "#434a50",
                navColor: "#cccccc",
                actNavColor: "#ffc54e",
                isCollapse: false
            }
        };
    },
    created() {
        let setting = localStorage.getItem("userSetting");
        if (setting) {
            this.userSet = JSON.parse(setting);
        }
    },
    methods: {
        changeSetting() {
            let setting = localStorage.getItem("userSetting");
            this.userSet = JSON.parse(setting);
        }
    }
};
</script>

<style scoped lang='scss'>
.layout {
    & /deep/ .el-header {
        padding: 0;
    }
}
</style>
