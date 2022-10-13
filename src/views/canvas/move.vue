/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="canvas-move">
        <div class="pot" :style="{left: S.x + 'px', top: S.y + 'px'}"></div>
        <div style="position: absolute;">{{ S.moveXY }}</div>
        <div class="btn">
            <el-button type="primary" @click="beganToDraw">绘制轨迹</el-button>
            <el-button type="primary" @click="potMove">移动</el-button>
        </div>
        <canvas :class="{'cursor-crosshair': type == 1}" @mousemove="mousemove"></canvas>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';

import { useRouter, useRoute } from 'vue-router'
const { ctx } = getCurrentInstance();
let type = ref(0)
let S = reactive({
    canvas: null,
    ctx: null,
    x: 0,
    y: 0,
    s: 1
})
let moveXY = []
let btnS = reactive({
    
})
onMounted(() => {
    S.canvas = document.getElementsByTagName("canvas")[0];
    S.ctx = S.canvas.getContext("2d");
    S.canvas.width = S.canvas.parentNode.clientWidth;
    S.canvas.height = S.canvas.parentNode.clientHeight;
    S.ctx.lineWidth = 1;
})

// 开启绘制功能
let beganToDraw = () => {
    type.value = 1
    // S.ctx.beginPath();
    // S.ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    // S.ctx.stroke();
}
// 鼠标移动
let mousemove = (e) => {
    if (e.buttons == 1 && type.value == 1) {
        moveXY.push([e.layerX, e.layerY])
        S.ctx.lineTo(e.layerX, e.layerY);
        S.ctx.stroke();
    }
}
let potMove = () => {
    let l = moveXY.length;
    let n = 0;
    let SI = setInterval(() => {
        if (moveXY[n]) {
            S.x = moveXY[n][0]
            S.y = moveXY[n][1]
            n += 1;
        } else {
            clearInterval(SI);
            n = 0;
            return
        }
    }, 200);
}
// // 初始化
// let init = () => {
//     this.canvas = document.querySelector("#myCanvas");
//
//     this.canvas.height = this.height || this.canvas.parentNode.clientHeight;
//
//     this.ctx.lineWidth = 1;
// }
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
</script>

<style lang="scss" scoped>
.canvas-move {
    width: 100%;
    height: 100%;
    position: relative;

    canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .btn {
        position: absolute;
        z-index: 1;
        right: 5%;
        top: 5%;
    }

    .pot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: red;
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
    }

    .cursor-crosshair {
        cursor: crosshair;
    }
}
</style>
