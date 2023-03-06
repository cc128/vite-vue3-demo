/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="tab-box">
        <div style="flex: 1;height: calc(100% - 32px);">
            <el-form ref="form" :inline="true" :model="formParams" class="form-box">
                {{ formParams }}
                <el-row>
                    <el-col :span="24">
                        <el-form-item v-for="(item, i) in formParams.form || []" :key="i" :label="item.label"
                            :prop="item.value" :label-width="item.labelWidth || ''">
                            <el-date-picker v-if="item.type && item.type.includes('date')" v-model="formParams[item.value]"
                                :type="item.type" :placeholder="'请选择' + item.label" clearable value-format="YYYY-MM-DD"
                                :style="item.style || { width: '200px' }"></el-date-picker>

                            <el-select v-else-if="item.type && item.type == 'select'" v-model="formParams[item.value]"
                                :placeholder="'请选择' + item.label" clearable :style="item.style || { width: '200px' }">
                                <el-option v-for="item in item.option" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>

                            <slot v-else-if="!!useSlots()['form-' + item.value]" :name="'form-' + item.value"
                                :form="formParams" :placeholder="item.label"></slot>

                            <el-input v-else v-model="formParams[item.value]" :type="item.type"
                                :placeholder="'请输入' + item.label" clearable :style="item.style || { width: '200px' }" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
                            <el-button :icon="Refresh" plain @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="false" :span="3">
                        <el-form-item label-width="10px">
                            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
                            <el-button :icon="Refresh" plain @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button :icon="Plus" plain type="primary">新增</el-button>
                            <el-button :icon="Download" plain type="warning">导出</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="_this.tableData" :style="{ width: '100%', height: height }" class="tab"
                :header-cell-style="{ background: '#e7f9f9', color: '#333' }">
                <el-table-column v-for="(item, i) in row" :key="i" :prop="item.value" :label="item.label"
                    :align="item.align || 'center'" :width="item.width" :max-width="item.maxWidth">
                    <template #default="scope">
                        <slot v-if="!!useSlots()['tab-' + item.openSlot]" :name="('tab-' + item.openSlot)"
                            :row="scope.row" :key="scope.$index">
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-pagination">
            <el-pagination :current-page="formParams.pageNum" :page-size="formParams.pageSize" :page-sizes="pageSizes"
                background layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChange"
                @current-change="currentChange" />
        </div>
    </div>
</template>

<script setup>
import { Search, Refresh, Download, Plus } from '@element-plus/icons-vue';
import { ref, reactive, getCurrentInstance, onMounted, render, useSlots } from 'vue';
// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()

let props = defineProps({
    formParams: { type: Object, default: {} },
    url: { type: String, default: "" },
    row: { type: Array, default: [] },
    pageSizes: { type: Array, default: [10, 20, 50, 100] },
})
// let emit = defineEmits(["update:formParams","update:pageNum", "update:pageSize"])


let height = ref("0px")
let form = ref(null);
let total = ref(0);
let _this = reactive({
    tableData: []
})

// 列表数据
let getList = () => {
    let p = {};
    let t = ['number', "boolean", "string"]
    for (const key in props.formParams) {
        let dataType = props.formParams[key];
        if (t.includes(typeof dataType)) {
            p[key] = props.formParams[key]
        }
    }
    console.log(p, 11111)
    // return
    $fetch.get(props.url, p).then(res => {
        _this.tableData = res.rows;
        total.value = res.total;
    })
}
getList();

// 搜索
const search = () => {
    // emit("update:pageNum", 1);
    getList();
}
// 重置
const resetForm = () => {
    props.formParams.pageNum = 1;
    form.value.resetFields();
    getList();
}
// 每页条数
const sizeChange = (val) => {
    props.formParams.pageNum = 1;
    props.formParams.pageSize = val;
    getList();
}
// 当前页
const currentChange = (val) => {
    props.formParams.pageNum = val;
    // emit("update:pageNum", val)
    getList();
}
onMounted(() => {
    render
    let geth = () => {
        let h = document.querySelector(".form-box");
        if (h) {
            return h.clientHeight
        } else {
            return 0
        }
    }
    height.value = `calc(100% - ${geth() + 10}px)`
    window.addEventListener("resize", () => {
        height.value = `calc(100% - ${geth() + 10}px)`
    });
    //         document.removeEventListener("click", AEL)

})

</script>

<style lang="scss" scoped>
.tab-box {
    width: 100%;
    height: 100%;
    // box-shadow: var(--el-box-shadow-dark);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .tab {}

    .bg {
        background: red;
    }

    .el-pagination {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
