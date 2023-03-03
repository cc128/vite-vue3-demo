/*
创建者：xx
模块名称：表格
备注：xxxx
*/
<template>
    <!-- <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table> -->
    <tab :tabData="tableData" :row="row" :total="500"></tab>
</template>

<script setup>
import tab from "./tab.vue"
import { ref, reactive, getCurrentInstance } from 'vue';
const row = [
    {
        label: "姓名",
        value: "name"
    },
    {
        label: "时间",
        value: "date",
        width: ""
    },
    {
        label: "地址",
        value: "address"
    }
]
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]
// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped></style>
