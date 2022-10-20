/*
创建者：xx
模块名称：贴图展示
备注：xxxx
*/
<template>
    <div v-if="state.isShow" class="model-box" v-loading="state.loading" :element-loading-text="state.loadingText"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="tool-box">
            <!-- {{ state.Texture }} -->
            <el-form :model="state.Texture" label-width="140px">
                <el-form-item label="上传模型">
                    <el-button type="primary" @click="deleModel">删除模型</el-button>
                    <el-button type="primary" @click="addM">加载模型</el-button>
                </el-form-item>
                <el-form-item label="上传模型">
                    <input class="ipt" name="up" type="file" @change="upImg($event)">
                </el-form-item>
                <el-form-item label="上传材质">
                    <input class="ipt" name="up" type="file" @change="upImg2($event)">
                </el-form-item>
                <el-form-item label="速度(0-1)">
                    <el-input v-model="state.Texture.moveS" placeholder="Please input" size="mini"
                        @change="setTexture" />
                </el-form-item>
                <el-form-item label="方向：">
                    <el-radio-group v-model="state.Texture.moveD" @change="setTexture">
                        <el-radio border label="x" />
                        <el-radio border label="y" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="x偏移值(0-1)：">
                    <el-input v-model="state.Texture.offsetX" placeholder="Please input" size="mini"
                        @change="setTexture" />
                </el-form-item>
                <el-form-item label="y偏移值(0-1)：">
                    <el-input v-model="state.Texture.offsetY" placeholder="Please input" size="mini"
                        @change="setTexture" />
                </el-form-item>
                <el-form-item label="x方向图片平铺个数">
                    <el-input v-model="state.Texture.repeatX" placeholder="Please input" size="mini"
                        @change="setTexture" />
                </el-form-item>
                <el-form-item label="y方向图片平铺个数">
                    <el-input v-model="state.Texture.repeatY" placeholder="Please input" size="mini"
                        @change="setTexture" />
                </el-form-item>
            </el-form>

            <!-- {{ state.Texture }} -->
            <div>
                <!-- <el-button type="primary" @click="setTexture">确定修改</el-button> -->
                <el-button type="primary" @click="isGo">{{ state.isStop ? "继续动画" : "暂停动画" }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';
import threeModel from "../three.js"

const state = reactive({
    isShow: true,
    isStop: false,
    Texture: {},
    three: null,
    loading: false,
    loadingText: "",
    // lowerCaseUsername: computed(() => state.username.toLowerCase()), //计算属性
})

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
onMounted(() => {
    initThree();
})
// 初始化3d场景
let initThree = () => {
    state.three = new threeModel(document.getElementsByClassName("model-box")[0], 0.21);
    // addModel("http://192.168.2.121:8083/GW.glb", "蜜蜂");
    // addM()
}
let addM = () => {
    addModel("http://192.168.3.216/file/area/7d1919079dfd4be4b2c384917d349a6f.glb", "aaa");
    addModel("http://192.168.3.216/file/area/b849cb07ae6645a9bf4c8c5565068595.glb", "aaa");
    addModel("http://192.168.3.216/file/area/993b9d3c147f41eaa40cfeda3f26a7fd.glb", "aaa");
    addModel("http://192.168.3.216/file/area/52c82c993714462e9709ebada3f227d0.glb", "aaa");
    addModel("http://192.168.3.216/file/area/f6df7075f9494192b2918e3b8f18435f.glb", "aaa");
    addModel("http://192.168.3.216/file/area/2d147757cf6a4d83bfbee8fabaf37ef8.glb", "aaa");
    addModel("http://192.168.3.216/file/area/73c38d3833e54e9797a580d4426326c2.glb", "aaa");
    addModel("http://192.168.3.216/file/area/9a266844bcdc4aa48c9df8b4b4a606b3.glb", "aaa");
}
let addModel = (url, name) => {
    state.three.loadModel(url, name, (progress, model) => {
        state.loading = true;
        progress = (progress ? progress-- : progress)
        if (model) {
            state.Texture = { ...state.three.getTextureP() }
            // progress = 100;
            state.loading = false;
            // state.loadingText = `模型加载${parseInt(progress)}%`;
            let { x, y, z } = state.three.getObjectHalfSize(model)
            // state.three.setXYZ(0, y * 2, 0);
        }
    }); // 加载模型
}
let upImg = (e) => {
    addModel(URL.createObjectURL(e.target.files[0]), e.target.files[0].name);
    // let div = document.createElement('div');
    // let img = document.createElement('img');
    // img.onclick = replaceImg;
    // div.appendChild(img)
    // img.src = URL.createObjectURL(e.target.files[0]);
    // let box = document.getElementsByClassName("img-box")[0];
    // box.appendChild(div);
}
let upImg2 = (e) => {
    state.three.setModeTexture({ url: URL.createObjectURL(e.target.files[0]) });
}
let setTexture = () => {
    state.three.setTextureP(state.Texture);
    state.Texture = { ...state.three.getTextureP() };
}
let isGo = () => {
    state.isStop = state.three.setStop();
}
let deleModel = () => {
    // state.isShow = false;
    let arr = state.three.getAllModel();
    arr.forEach(m => {
        state.three.removerModel(m)
    });
    // state.three = null;
    // state.three.deleM();
}


// 组件销毁前
onBeforeUnmount(() => {
    state.scene = null;
})
</script>

<style lang="scss" scoped>
.model-box {
    height: 100%;
    width: 100%;
    position: relative;
    .tool-box {
        position: absolute;
        top: 20px;
        right: 50px;
        z-index: 10;
    }

    .btn {
        width: 200px;
        padding: 20px 0;
        text-align: center;
        font-size: 16px;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 0 6px #fff;
        cursor: pointer;
        position: relative;

        .ipt {
            background: red;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            cursor: pointer;
        }
    }
}
</style>
