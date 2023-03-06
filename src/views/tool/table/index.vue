/*
创建者：xx
模块名称：表格
备注：xxxx
*/
<template>
    <dialoForm v-if="dialogVisible"></dialoForm>
    <tab v-model:formParams="_this.fromParams" url="/prod-api/system/user/list" :row="row">
        <template #tab-communistParty="scope">
            <span v-if="scope.row.userExt && scope.row.userExt.communistParty">党员</span>
            <span v-else>非党员</span>
        </template>
        <template #tab-status="scope">
            <div style="width: 0px;height:0px;overflow: hidden;">{{ scope.row.status = !!scope.row.status }}</div>
            <el-switch v-model="scope.row.status" class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </template>
        <template #tab-edit="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="primary" size="small">删除</el-button>
        </template>
    </tab>
</template>

<script setup>
import tab from "./tab.vue"
import dialoForm from "./dialoForm.vue"
import { ref, reactive, getCurrentInstance } from 'vue';
const row = [
    {
        label: "登录账号",
        value: "userName",
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
        value: "userExt.communistParty",
        openSlot: "communistParty"
    },
    {
        label: "状态",
        value: "status",
        openSlot: "status"
    },
    {
        label: "创建时间",
        value: "createTime"
    },
    {
        label: "操作",
        value: "edit",
        openSlot: "edit"
    }
]
let dialogVisible = ref(false);
let _this = reactive({
    fromParams: {
        form: [
            {
                label: "登录账号",
                value: "userName",
            },
            {
                label: "手机号码",
                value: "phonenumber",
            },
            {
                label: "是否党员",
                value: "communistParty",
                type: "select",
                style: {
                    width: "100%"
                },
                option: [
                    {
                        label: "党员",
                        value: true
                    },
                    {
                        label: "非党员",
                        value: false
                    }
                ]
            },
            {
                // labelWidth: "80px",
                label: "状态",
                value: "status",
                type: "select",
                style: {
                    width: "100%"
                },
                option: [
                    {
                        label: "正常",
                        value: 0
                    },
                    {
                        label: "停用",
                        value: 1
                    }
                ]
            },
            {
                label: "创建时间",
                value: "createTime",
                col: 5,
                type: "date"
            }
        ],
        pageNum: 1,
        pageSize: 10
    },
})
const edit = (e) => {
    dialogVisible.value = true;
    // console.log({ ...e }, 11111)
}
const aaa = (e) => {
    console.log(e, 11111111)
}



// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped></style>
