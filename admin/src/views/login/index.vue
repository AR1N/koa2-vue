<template>
    <div class="login">
        <div class="login-header" id="login-header">
            <canvas id="animation"></canvas>
            <div class="input-area">
                <fieldset class="c-flex-center">
                    <legend>{{loginform.appName}}</legend>
                    <el-form
                        ref="loginform"
                        :rules="rules"
                        label-position="left"
                        :model="loginform"
                        label-width="50px"
                    >
                        <el-form-item label="账号" prop='account'>
                            <el-input clearable placeholder="请输入账号" v-model="loginform.account"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop='password'>
                            <el-input
                                clearable
                                show-password
                                password
                                placeholder="请输入密码"
                                v-model="loginform.password"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" class="login-btn" @click="handleLogin('loginform')">登录</el-button>
                </fieldset>
            </div>
        </div>
        <a
            href="https://kcren.gitee.io/contactme"
            title="技术支持"
            class="author"
        >Designed and powered by Aren</a>
    </div>
</template>

<script>
import Config from "@/config/index";
import animaCanvas from "@/util/animaCanvas";

export default {
    data() {
        return {
            loginform: {
                appName: "",
                account: "",
                password: "",
            },
            rules: {
                account: [
                    { required: true, message: "请输入账号", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            },
        };
    },
    created() {
        this.loginform.appName = Config.appName;
    },
    mounted() {
        animaCanvas.bgInit();
    },
    methods: {
        handleLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch("handleLogin",this.loginform)
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style lang='scss' scoped>
.login {
    height: 100%;
    width: 100%;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(67, 74, 80, 1);
    #animation {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }
    .input-area {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        fieldset {
            color: #409eff;
            width: 320px;
            height: 200px;
            padding: 30px;
            border-radius: 5px;
            z-index: 99;
            background-color: rgba(64, 158, 255, 0.1);
            border: 1px solid #409eff;
            box-shadow: 0 2px 10px #409eff;
            legend {
                padding: 0 5px;
                text-align: center;
                color: #fff;
                font-size: 20px;
                font-weight: bold;
            }
        }
        &::v-deep .el-form-item__label {
            color: #ffffff;
            font-weight: bold;
            &::before{
                content: '';
            }
        }
        .login-btn {
            width: 270px;
            margin: 30px 0 0 auto;
            box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.5);
        }
    }
    .author {
        position: absolute;
        bottom: 10px;
        color: #f8f8f87c;
        cursor: pointer;
        &:hover {
            color: #409eff;
            border-bottom: 1px solid #409eff;
        }
    }
}
</style>
