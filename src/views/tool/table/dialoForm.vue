/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <el-dialog v-model="dialogVisible" title="编辑" width="30%" draggable destroy-on-close :close-on-click-modal="false"
        :close-on-press-escape="false">
        <span>11111</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
// defineProps({
//     dialogVisible: { type: Boolean, default: true }
// })
let dialogVisible = ref(true)

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped></style>
