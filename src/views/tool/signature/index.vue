/*
创建者：xx
模块名称：签名
备注：xxxx
*/
<template>
    <div class="signature">
        <div class="tool-box">
            <el-button type="primary" @click="storage">保存签名</el-button>
            <el-button type="primary" @click="clearCanvas">清空画布</el-button>
            &nbsp;&nbsp;
            <el-color-picker v-model="color" />
            &nbsp;&nbsp;
            <el-input v-model="selWidth" placeholder="线条粗细" style="width: 50px" />
        </div>
        <canvas @mousedown="mousedownF" @mousemove="mousemove" @mouseup="mouseupF"></canvas>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
let selWidth = ref(5);
let isDown = ref(false);
let color = ref("#000000");
// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
let _this = reactive({
    form: {},
    canvas: null,
    ctx: null,
    x: 0,
    y: 0,
    s: 1
})
let moveXY = []

onMounted(() => {
    _this.canvas = document.getElementsByTagName("canvas")[0];
    _this.ctx = _this.canvas.getContext("2d");
    _this.canvas.width = _this.canvas.parentNode.clientWidth;
    _this.canvas.height = _this.canvas.parentNode.clientHeight;

    let imgData = _this.ctx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
    let data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 255) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
        }
    }
    _this.ctx.putImageData(imgData, 0, 0);
    _this.ctx.lineWidth = 1;

    _this.ctx.globalAlpha = 0.3; // 透明度
    _this.ctx.font = "bold 16px '字体','字体','微软雅黑','宋体'"; //设置字体
    _this.ctx.fillStyle = "#409eff"; //设置线的颜色状态
    // _this.ctx.textBaseline = 'hanging'; //在绘制文本时使用的当前文本基线
    let t = "我是水印";
    let level = parseInt(_this.canvas.width / (t.length * 16));
    let vertical = parseInt(_this.canvas.height / 16 / 5.5);
    // console.log(vertical)
    let num = 1;
    for (let k = 0; k < vertical; k++) {
        for (let i = 0; i < level; i++) {
            if (i % 2 == 0) {
                _this.ctx.fillText(t, t.length * 16 * i, 16 * num); //设置文本内容
            } else {
                _this.ctx.fillText(t, t.length * 16 * i, 16 * (num + 3)); //设置文本内容
            }
        }
        num += 6;
    }
})
// 鼠标按下
let mousedownF = (e) => {
    //左键
    if (e.which === 1) {
        _this.ctx.globalAlpha = 1; // 透明度
        _this.ctx.beginPath();
        _this.ctx.lineWidth = selWidth.value; //设置线宽状态
        _this.ctx.strokeStyle = color.value;; //设置线的颜色状态
        _this.ctx.lineCap = 'round';
        _this.ctx.lineJoin = "round";
        _this.ctx.moveTo(e.layerX, e.layerY);
        isDown.value = true;
    }
}
// 鼠标移动
let mousemove = (e) => {
    if (e.buttons == 1 && isDown.value) {
        moveXY.push([e.layerX, e.layerY]);
        _this.ctx.lineTo(e.layerX, e.layerY);
        _this.ctx.stroke();
    }
}
//鼠标松开
let mouseupF = () => {
    isDown.value = false;
}
// 清空画布
let clearCanvas = () => {
    _this.ctx.beginPath();
    _this.ctx.clearRect(0, 0, _this.canvas.parentNode.clientWidth, _this.canvas.parentNode.clientHeight);
    _this.ctx.closePath(); //可加入，可不加入
}
// 保存签名
let storage = () => {
    let url = _this.canvas.toDataURL("image/png", 1);
    let a = document.createElement("a");
    a.download = "签名.png";
    a.href = url;
    a.click();
    a.remove();
}


</script>

<style lang="scss" scoped>
.signature {
    width: 100%;
    height: 100%;
    position: relative;

    canvas {
        cursor: crosshair;
    }

    .tool-box {
        width: 800px;
        // width: max-content;
        display: flex;
        position: absolute;
        top: 10px;
        left: 10px;
    }
}
</style>
