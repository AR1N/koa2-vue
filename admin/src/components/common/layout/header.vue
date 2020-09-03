<template>
    <div class="layout-header c-flex-between" :style="{ 'background-color': setting.headerBg }">
        <div class="c-flex-align">
            <img src="../../../static/img/logo.png" alt="logo" class="logo" />
            <div class="app-name" :style="{ color: setting.appColor }">{{appName}}</div>
        </div>
        <div class="setting">
            <div
                class="iconfont"
                :class="[isFull?'ren-icon-quanping1':'ren-icon-quanping3']"
                :title="tipTitle"
                @click="onFullscreen"
            ></div>
            <div class="theme iconfont ren-icon-shezhi1" title="设置" @click="openDrawer"></div>
            <el-dropdown @command="handleCommand">
                <div class="user c-flex-align">
                    <img src="../../../static/img/author.png" alt="头像" />
                    <div>您好，{{username}}</div>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-key" command="editPWD">修改密码</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-switch-button" command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-drawer
            title="主题设置"
            :visible.sync="drawerShow"
            direction="rtl"
            size="380px"
            custom-class="drawer-box"
        >
            <el-form label-position="left" label-width="200px">
                <el-form-item label="顶部背景色">
                    <el-color-picker v-model="setting.headerBg" @change='saveSet' size="medium"></el-color-picker>
                </el-form-item>
                <el-form-item label="顶部标题颜色">
                    <el-color-picker v-model="setting.appColor" @change='saveSet' size="medium"></el-color-picker>
                </el-form-item>
                <el-form-item label="菜单背景色">
                    <el-color-picker v-model="setting.navBg" @change='saveSet' size="medium"></el-color-picker>
                </el-form-item>
                <el-form-item label="菜单文字颜色">
                    <el-color-picker v-model="setting.navColor" @change='saveSet' size="medium"></el-color-picker>
                </el-form-item>
                <el-form-item label="菜单选中颜色">
                    <el-color-picker v-model="setting.actNavColor" @change='saveSet' size="medium"></el-color-picker>
                </el-form-item>
                <el-form-item label="菜单展示">
                    <el-switch
                        v-model="setting.isCollapse"
                        active-color="#909399"
                        inactive-color="#13ce66"
                        active-text="收起"
                        inactive-text="展开"
                        @change="saveSet"
                    ></el-switch>
                </el-form-item>
            </el-form>
            <div class="c-flex-between">
                <el-button type="info" plain class="act-btn" @click="resetSet">恢复默认</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import Config from '@/config/index'
import Screenfull from "screenfull";
export default {
    props: {
        defaultset:{
            type:Object
        }
    },
    data() {
        return {
            appName:'',
            usernameL:'',
            drawerShow: false,
            isFull: false,
            tipTitle: "全屏显示",
            setting: {
                // headerBg: "#434a50",
                // appColor: "#ffffff",
                // navBg: "#434a50",
                // navColor: "#cccccc",
                // actNavColor: "#ffc54e",
                // isCollapse: false
            }
        };
    },
    created() {
        this.appName = Config.appName;
        this.username = this.$store.getters.user_info.username
        console.log(this.$store.getters.user_info)
        let setting = localStorage.getItem("userSetting");
        if (setting) {
            this.setting = JSON.parse(setting);
        }
    },
    watch:{
        defaultset:{
            handler(val){
                this.setting = val
            },
            immediate:true,
            deep:true
        }
    },
    methods: {
        openDrawer() {
            this.drawerShow = true;
        },
        onFullscreen() {
            if (!Screenfull.isEnabled) {
                this.$message({
                    message: "当前浏览器不支持全屏操作",
                    type: "error"
                });
                return false;
            }
            Screenfull.toggle();
            this.isFull = !this.isFull;
            if (this.isFull) {
                this.tipTitle = "退出全屏";
            } else {
                this.tipTitle = "全屏显示";
            }
        },
        handleCommand(command) {
            if(command==='logout'){
                this.$confirm("您确定要退出吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$store.dispatch('handleLogout')
                }).catch(()=>{})
            }
            if(command==='editPWD'){
                this.$prompt('请输入新密码','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value})=>{
                    this.$api.user.modifyPwd(value).then(res=>{
                        if(res.code==1){
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        }
                    })
                }).catch(()=>{
                })
            }
        },
        saveSet() {
            let data = JSON.stringify(this.setting);
            localStorage.setItem("userSetting", data);
            this.$emit("changeSet");
        },
        resetSet() {
            this.setting = {
                headerBg: "#434a50",
                appColor: "#ffffff",
                navBg: "#434a50",
                navColor: "#cccccc",
                actNavColor: "#ffc54e",
                isCollapse: false
            };
            let data = JSON.stringify(this.setting);
            localStorage.setItem("userSetting", data);
            this.$emit("changeSet");
        }
    }
};
</script>

<style lang="scss">
.layout-header {
    width: 100%;
    height: 66px;
    padding: 0 30px 0 20px;
    color: #ffffff;
    box-sizing: border-box;
    .logo {
        height: 50px;
        margin-right: 20px;
    }
    .app-name {
        font-size: 22px;
        font-weight: bold;
        max-width: 450px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .setting {
        display: flex;
        align-items: center;
        .iconfont {
            margin: 0 15px;
            cursor: pointer;
        }
        .user {
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            text-shadow: 1px 2px 3px#409eff;
            img {
                height: 48px;
                width: 48px;
                border-radius: 50%;
                margin: 0 10px 0 30px;
                box-shadow: 0 0 8px 3px #fffffff8;
            }
        }
    }
    .drawer-box {
        padding: 20px;
        outline: none;
        .el-drawer__header {
            font-weight: bold;
            text-align: center;
            margin-bottom: 66px;
            & > :first-child {
                outline: none;
            }
            .el-drawer__close-btn{
              outline: none;
            }
            .el-icon-close{
                outline: none;
            }

        }
        .el-drawer__body {
            margin: 0 auto;
            overflow: auto;
            & /deep/ .el-form-item {
                margin-bottom: 10px;
            }
        }
        .act-btn {
            width: 88%;
            margin: 0 auto;
            margin-top: 50px;
        }
    }
}
</style>
