/*
创建者：xx
模块名称：表格
备注：xxxx
*/
<template>
    {{ _this.formParams.status }}
    <dialoForm :title="title" v-model:dialogVisible="dialogVisible" v-model:formInfo="_this.modelParams.formInfo" v-model:formParams="_this.formParams" @confirm="confirm"></dialoForm>
    <tab v-model:modelParams="_this.modelParams" url="/prod-api/system/user/list">
        <template #list-communistParty="scope">
            <span v-if="scope.row.userExt && scope.row.userExt.communistParty">党员</span>
            <span v-else>非党员</span>
        </template>
        <template #list-status="scope">
            <div style="width: 0px;height:0px;overflow: hidden;">{{ scope.row.status = !!scope.row.status }}</div>
            <el-switch v-model="scope.row.status" class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </template>
        <template #list-edit="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="primary" size="small">删除</el-button>
        </template>
    </tab>
</template>

<script setup>
import tab from "./tab.vue"
import dialoForm from "./dialoForm.vue"
import { ref, reactive, getCurrentInstance } from 'vue';

let dialogVisible = ref(false);
let title = ref("")
let _this = reactive({
    modelParams: {
        formInfo: [
            {
                label: "登录账号",
                value: "userName",
                formCol: 12,
                elType: "list,query",
            },
            {
                label: "姓名",
                value: "nickName",
                elType: "list,form",
                formCol: 12,
                required: true,
                formSort: 1,
            },
            {
                label: "部门",
                value: "dept.deptName",
                elType: "list"
            },
            {
                label: "所属部门",
                value: "dept.deptName",
                elType: "list",
            },
            {
                label: "所属部门",
                value: "deptId",
                elType: "form",
                formCol: 12,
                formSort: 2,
            },
            {
                label: "岗位",
                value: "postIds",
                elType: "list,form",
                formSort: 7,
            },
            {
                label: "角色",
                value: "roleName",
                elType: "form",
                formSort: 8,
            },
            {
                label: "备注",
                value: "remark",
                type: 'textarea',
                elType: "form",
                formCol: 24,
                formSort: 9,
            },
            {
                label: "手机号码",
                value: "phonenumber",
                elType: "list,query,form",
                formCol: 12,
                formSort: 3,
            },
            {
                label: "邮箱",
                value: "email",
                elType: "form",
                formCol: 12,
                formSort: 4,
            },
            {
                label: "用户性别",
                value: "sex",
                elType: "form",
                slotName: "sex",
                type: "select",
                formCol: 12,
                required: true,
                option: [
                    {
                        label: "男",
                        value: 0
                    },
                    {
                        label: "女",
                        value: 1
                    }
                ],
                formSort: 5,
            },
            {
                label: "是否党员",
                value: "userExt.communistParty",
                slotName: "communistParty",
                elType: "list"
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
                ],
                elType: "query"
            },
            {
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
                ],
                elType: "query,list,form",
                slotName: "status",
                formCol: 12,
                formSort: 6,
            },
            {
                label: "创建时间",
                value: "createTime",
                type: "date",
                elType: "query,list"
            },
            {
                label: "操作",
                value: "edit",
                slotName: "edit",
                elType: "list"
            }
        ],
        pageNum: 1,
        pageSize: 10
    },
    formParams: {}
})
const edit = (e) => {
    title.value = "编辑";
    dialogVisible.value = true;
    $fetch.get(`/prod-api/system/user/${e.userId}`).then(res => {
        _this.formParams = res.data.user;
        console.log(res.data.user, 111111)
    })
}
const confirm = (e) => {
    console.log(e, 333333333)
}



// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped></style>
