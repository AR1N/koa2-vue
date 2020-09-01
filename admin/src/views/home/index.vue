<template>
    <div class="home">
        <img :src="homeBg" alt="" class="home_bg">
        <img :src="animatImg" alt="" class="animat-img">
    </div>
</template>

<script>
    import homeBg from '@/static/img/home_bg.png'
    import animatImg from '@/static/img/illustrator.png'
    export default {
        data () {
             return {
                 homeBg:homeBg,
                 animatImg:animatImg
             }
        }
    }
</script>

<style lang='scss' scoped>
    .home{
        position: relative;

        .home_bg{
            height: calc(100vh - 150px);
            width: 100%;
            border-radius: 10px;
        }
        .animat-img{
            position: absolute;
            top: 45px;
            right: 80px;
            width: 350px;
            height: 350px;
            // transform-style: preserve-3d;
            //    transform: skew(90deg);
            //    transform: rotateZ(90deg);
            //    transform: rotateX(90deg);
            transform: rotateY(180deg);
            // animation: rotateImg 15s linear infinite;
            &:hover{
                animation-play-state: paused;
            }
        }
        @keyframes rotateImg {
            0%{transform: rotateZ(0deg);}
            100%{transform: rotateZ(360deg);}
        }
    }
</style>
