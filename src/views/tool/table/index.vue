/*
创建者：xx
模块名称：表格
备注：xxxx
*/
<template>
    <tab v-model:formParams="_this.fromParams" url="/prod-api/system/user/list" :row="row">
        <!-- <template #caozuo>
                                <h1>Here might be a page title</h1>
                            </template> -->
        <template #caozuo="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="primary" size="small">删除</el-button>
        </template>
    </tab>
</template>

<script setup>
import tab from "./tab.vue"
import { ref, reactive, getCurrentInstance } from 'vue';
const row = [
    {
        label: "登录账号",
        value: "userName"
    },
    {
        label: "姓名",
        value: "nickName",
    },
    {
        label: "部门",
        value: "dept.deptName"
    },
    {
        label: "岗位",
        value: "postIds"
    },
    {
        label: "手机号码",
        value: "phonenumber"
    },
    {
        label: "是否党员",
        value: "userExt.communistParty"
    },
    {
        label: "状态",
        value: "status"
    },
    {
        label: "创建时间",
        value: "createTime"
    },
    {
        label: "操作",
        openSlot: "caozuo"
    }
]
let _this = reactive({
    fromParams: {
        userName: "",
        phonenumber: "",
        pageNum: 1,
        pageSize: 20
    },
})
const edit = (e) => {
    console.log({ ...e }, 11111)
}


// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped></style>
