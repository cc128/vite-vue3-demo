/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="canvas-box">
        <move v-if="index == 0"></move>
    </div>
</template>

<script setup>
import move from "./move.vue"
import { ref, reactive, getCurrentInstance } from 'vue';

import { useRouter, useRoute } from 'vue-router'
const { ctx } = getCurrentInstance()
let index = ref(0)
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped>
.canvas-box {
    width: 100%;
    height: 100%;
    .btn {
        position: absolute;
        z-index: 1;
        right: 5%;
        top: 5%;
    }
}
</style>
