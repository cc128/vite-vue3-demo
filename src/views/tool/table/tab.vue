/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="tab-box">
        <el-table :data="tabData" style="width: 100%" height="calc(50% - 42px)">
            <el-table-column v-for="(item, i) in row" :key="i" :prop="item.value" :label="item.label" />
        </el-table>
        <div class="el-pagination">
            <el-pagination background layout="prev, pager, next" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                :total="total" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
defineProps({
    tabData: Array,
    row: Array,
    pageSize: {
        type: Number,
        default: 10
    },
    total: {
        type: Number,
        default: 0
    },
})
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
</script>

<style lang="scss" scoped>
.tab-box {
    width: 100%;
    height: 100%;

    .el-pagination {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
