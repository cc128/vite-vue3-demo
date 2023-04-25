/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <router-view></router-view>
</template>

<script setup>
import { baset64toFile, downloadImg, downloadFile, watermark } from "@/Tools/index.js"
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
onMounted(() => {
    watermark()
})
</script>

<style lang="scss" scoped></style>
