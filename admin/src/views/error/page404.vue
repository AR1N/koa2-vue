<template>
    <div class="com-error">
        <img :src="require('../../static/img/error-404.png')" />
        <div class="tips c-flex-center">
            <p class="tip-text">抱歉，你访问的页面不存在</p>
            <p>
<router-link :to="{name:'home'}">
                <el-button type="primary">返回首页</el-button>
            </router-link>
            </p>

        </div>
    </div>
</template>

<script>
export default {
    name: "Error"
};
</script>

<style lang="scss" scoped>
.com-error {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 400px;
    }

    .tips {
        margin-left: 20px;
        .tip-text {
            padding-bottom: 20px;
        }
        p {
            font-size: 22px;
            color: #888;
        }
    }
}
</style>
