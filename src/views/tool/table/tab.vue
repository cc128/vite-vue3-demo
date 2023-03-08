/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="tab-box">
        <div style="flex: 1;height: calc(100% - 32px);">
            <el-form ref="form" :inline="true" :model="_this.formParams" class="form-box">
                <el-row>
                    <colForm :formInfo="modelParams.formInfo" v-model:formParams="_this.formParams">
                        <template #default="scope">
                            <slot :name="scope.row" :form="scope.form" :placeholder="scope.placeholder"></slot>
                        </template>
                    </colForm>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
                            <el-button :icon="Refresh" plain @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button :icon="Plus" plain type="primary" @click="add">新增</el-button>
                            <el-button :icon="Download" plain type="warning" @click="exportFile">导出</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="_this.tableData" :style="{ width: '100%', height: height }" class="tab"
                :header-cell-style="{ background: '#e7f9f9', color: '#333' }" v-bind="attributes || {}">
                <el-table-column v-for="(item, i) in _this.tableHead" :key="i" :prop="item.value" :label="item.label"
                    v-bind="item.attributes || {}" :align="item.align || attributes.align">
                    <template #default="scope">
                        <slot v-if="!!useSlots()['list-' + item.slotName]" :name="('list-' + item.slotName)"
                            :row="scope.row" :key="scope.$index">
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-pagination">
            <el-pagination v-model:current-page="modelParams.pageNum" v-model:page-size="modelParams.pageSize"
                :page-sizes="pageSizes" background layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="sizeChange" @current-change="currentChange" />
        </div>
        <dialoForm :title="title" v-model:dialogVisible="dialogVisible" v-model:formInfo="modelParams.formInfo"
            v-model:formParams="_this.dialoFormParams" @confirm="confirm">
            <template #default="scope">
                <slot :name="scope.row" :form="scope.form" :placeholder="scope.placeholder"></slot>
            </template>
        </dialoForm>
    </div>
</template>

<script setup>
import { Search, Refresh, Download, Plus } from '@element-plus/icons-vue';
import { ref, reactive, getCurrentInstance, onMounted, render, useSlots } from 'vue';
import colForm from "./colForm.vue";
import dialoForm from "./dialoForm.vue"

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
let dialogVisible = ref(false);
let title = ref("");
let props = defineProps({
    modelParams: { type: Object, default: {} },
    url: { type: String, default: "" },
    pageSizes: { type: Array, default: [10, 20, 50, 100] },
    attributes: { type: Object, default: {} }, // el-table表格属性
    fileUrl: { type: String, default: "" },
})

// let emit = defineEmits(["update:modelParams","update:pageNum", "update:pageSize"])
let emit = defineEmits(["confirm"])


let height = ref("0px")
let form = ref(null);
let total = ref(0);
let _this = reactive({
    tableData: [], //表格数据
    tableHead: [], // 表格头部
    formParams: {},
    dialoFormParams: {}
})
// 获取参数
const getParams = () => {
    let p = {};
    let forMP = { ...props.modelParams, ..._this.formParams }
    for (const key in forMP) {
        let dataType = forMP[key];
        if (key != 'formInfo' && (dataType || dataType === 0 || dataType === false)) {
            p[key] = dataType
        }
    }
    return p
}
// 列表数据
const getList = () => {
    $fetch.get(props.url, getParams()).then(res => {
        _this.tableData = res.rows;
        total.value = Number(res.total);
    })
}
// 新增
const add = () => {
    title.value = '新增';
    dialogVisible.value = true;
}
// 确定
const confirm = (e) => {
    emit("confirm", _this.dialoFormParams)
}

// 搜索
const search = () => {
    // emit("update:pageNum", 1);
    props.modelParams.pageNum = 1;
    getList();// 列表数据
}
// 重置
const resetForm = () => {
    props.modelParams.pageNum = 1;
    form.value.resetFields();
    getList();// 列表数据
}
// 每页条数
const sizeChange = (val) => {
    props.modelParams.pageNum = 1;
    props.modelParams.pageSize = val;
    getList();// 列表数据
}
// 当前页
const currentChange = (val) => {
    props.modelParams.pageNum = val;
    // emit("update:pageNum", val)
    getList();// 列表数据
}
const exportFile = () => {
    $fetch.post(props.fileUrl, getParams())
}


onMounted(() => {
    getList();// 列表数据
    _this.tableHead = props.modelParams.formInfo.filter((e) => {
        return (!e.elType || (e.elType && e.elType.includes("list")))
    })
    // 计算表格高度
    let geth = () => {
        let h = document.querySelector(".form-box");
        if (h) {
            return h.clientHeight
        } else {
            return 0
        }
    }
    height.value = `calc(100% - ${geth() + 10}px)`;
    window.addEventListener("resize", () => {
        height.value = `calc(100% - ${geth() + 10}px)`;
    });
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
