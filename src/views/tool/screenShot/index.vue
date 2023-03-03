/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="screen-shot">
        <div>
            <el-button type="primary" @click="screenShot">开启截屏</el-button>
            <input type="file" multiple name="" id="" @change="downloadFile">
        </div>
        <div class="img-box">
            <div v-for="(item, i) in state.imgList" :key="i">
                <img :src="item" class="box-shadow" alt="" srcset="">
                <br>
                <el-button type="primary" @click="downloadImg(item)">下载</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import ScreenShot from "js-web-screen-shot";
import { baset64toFile, downloadImg, downloadFile } from "@/Tools/index.js"
const state = reactive({ imgList: [] })


// 开启截屏
let screenShot = () => {
    new ScreenShot({
        enableWebRtc: true,
        level: 999,
        loadCrossImg: true,
        showScreenData: true,
        cancelCallback: () => {
            // 取消或不支持录屏功能
            // alert("取消或不支持录屏功能")
        },
        completeCallback: (e) => {
            // 截图完成回调函数
            let formData = new FormData();
            formData.append("file", baset64toFile(e, "图片", "image/png"));
            state.imgList.push(URL.createObjectURL(formData.getAll("file")[0]))
        },
        closeCallback: () => {
            // 截图关闭回调函数
            // alert("截图关闭回调函数")
        }
    });
}

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped>
.screen-shot {
    .img-box {
        display: flex;
        flex-wrap: wrap;
        text-align: center;

        img {
            height: 150px;
            margin: 10px;
            margin-left: 0px;
        }
    }
}
</style>
