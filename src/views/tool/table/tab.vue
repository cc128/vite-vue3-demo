/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="tab-box">
        <div style="flex: 1;height: calc(100% - 32px);">
            <el-form ref="form" :inline="true" :model="formParams" class="form-box">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="登录账号" prop="userName">
                            <el-input v-model="formParams.userName" placeholder="请输入登录账号" />
                        </el-form-item>
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="formParams.phonenumber" placeholder="请输入手机号码" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
                            <el-button :icon="Refresh" plain @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button :icon="Plus" plain type="primary" @click="exportList">新增</el-button>
                            <el-button :icon="Download" plain type="warning" @click="exportList">导出</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="_this.tableData" :style="{ width: '100%', height: height }" class="tab"
                :header-cell-style="{ background: '#efefef', color: '#333' }">
                <el-table-column v-for="(item, i) in row" :key="i" :prop="item.value" :label="item.label"
                    :align="item.align || 'center'" :width="item.width" :max-width="item.maxWidth">
                    <slot v-if="item.openSlot" :name="item.openSlot || 'default'" :row="_this.tableData[i]" :index="i"></slot>
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
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
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
    $fetch.get(props.url, { ...props.formParams }).then(res => {
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
// 导出
const exportList = () => {
    $fetch.post("/prod-api/party/due/export")
}
onMounted(() => {
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
        let h = document.querySelector(".form-box").clientHeight;
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
