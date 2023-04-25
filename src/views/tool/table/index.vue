/*
创建者：xx
模块名称：表格
备注：xxxx
*/
<template>
    <!-- {{ _this.postList }} -->
    <!-- {{ _this.formParams.status }} -->
    <dialoForm v-if="dialogVisible" :title="title" v-model:dialogVisible="dialogVisible"
        v-model:formInfo="_this.modelParams.formInfo" v-model:formParams="_this.formParams" @confirm="confirm">
        <template #form-deptId="scope">
            <el-dropdown ref="dropdown1" trigger="contextmenu">
                <div>
                    {{ scope.form.deptId }}
                    <el-input placeholder="请选择所属部门" class="el-dropdown-link" @click="dropdown1.handleOpen()"></el-input>
                </div>
                <template #dropdown>
                    <el-tree style="padding: 10px" :data="_this.deptList" :props="defaultProps" show-checkbox
                        @node-click="handleNodeClick">
                        <template #default="{ node, data }">
                            <span class="custom-tree-node">
                                <span
                                    @click="(node.children && node.children.length) ? '' : scope.form.deptId = node.label">
                                    {{ node.label }}
                                </span>
                            </span>
                        </template>
                    </el-tree>
                </template>
            </el-dropdown>
        </template>
    </dialoForm>
    <tab :modelParams="_this.modelParams" url="/system/user/list" :attributes="{ 'align': 'center' }">
        <template #form-deptId="scope">
            99999
        </template>
        <template #query-status="scope"></template>
        <template #list-postIds="scope">
            <el-tag v-for="(item, i) in getPostName(scope.row.postIds)" :key="i">{{ item }}</el-tag>
        </template>
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
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';

const defaultProps = {
    children: 'children',
    label: 'label',
    value: "value"
}
const handleNodeClick = (data) => {
    console.log(data, 1111)
}

let dropdown1 = ref(null);
let GW = {
    label: "岗位",
    value: "postIds",
    elType: "list,form",
    type: "select",
    multiple: true,
    attributes: {
        width: "200px"
    },
    formSort: 7,
    slotName: "postIds",
    option: []
};
let dialogVisible = ref(false);
let title = ref("");
let _this = reactive({
    postList: [],
    deptList: [],
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
                type: "selectTree",
                formCol: 12,
                formSort: 2,
                slotName: "deptId",
                tree: [
                    {
                        label: 'Level one 1',
                        children: [
                            {
                                label: 'Level two 1-1',
                                children: [
                                    {
                                        label: 'Level three 1-1-1',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Level one 2',
                        children: [
                            {
                                label: 'Level two 2-1',
                                children: [
                                    {
                                        label: 'Level three 2-1-1',
                                    },
                                ],
                            },
                            {
                                label: 'Level two 2-2',
                                children: [
                                    {
                                        label: 'Level three 2-2-1',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Level one 3',
                        children: [
                            {
                                label: 'Level two 3-1',
                                children: [
                                    {
                                        label: 'Level three 3-1-1',
                                    },
                                ],
                            },
                            {
                                label: 'Level two 3-2',
                                children: [
                                    {
                                        label: 'Level three 3-2-1',
                                    },
                                ],
                            },
                        ],
                    },
                ]
            },
            GW,
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
                        value: '0'
                    },
                    {
                        label: "女",
                        value: '1'
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
                        value: '0'
                    },
                    {
                        label: "停用",
                        value: '1'
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
        pageSize: 20
    },
    formParams: {}
})
const edit = (e) => {
    title.value = "编辑";
    dialogVisible.value = true;
    $fetch.get(`/system/user/${e.userId}`).then(res => {
        let { user, postIds, posts, roleIds } = res.data;
        GW.option = posts.map(e => {
            return {
                label: e.postName,
                value: e.postId
            }
        })
        _this.formParams = { ...res.data.user, postIds };

    })
}
const confirm = (e) => {
    console.log(e, 333333333)
}
// 获取岗位名称
const getPostName = (posts) => {
    if (posts?.length) {
        return posts.map(e => {
            if (_this.postList.length) {
                let arr = _this.postList.filter((e2) => {
                    return e == e2.value
                })
                return arr[0].label
            }
        })
    } else {
        return ""
    }
}
// 获取岗位列表
const getPostList = (e) => {
    $fetch.get("/system/post/list", { pageNum: 1, pageSize: 999 }).then(res => {
        _this.postList = res.rows.map(e => {
            return {
                label: e.postName,
                value: e.postId
            }
        })
    })
}
const getDeptList = () => {
    $fetch.get("/system/dept/list", { pageNum: 1, pageSize: 999 }).then(res => {
        let changeTree = (arr, parentId = '') => {
            const newArr = []
            arr.forEach(item => {
                item.label = item.deptName;
                item.value = item.deptId;
                if (item.parentId === parentId) {
                    // 找一级，pid相同的item添加到新数组
                    newArr.push(item)
                    // 找二级，再次调用函数
                    const children = changeTree(arr, item.deptId)
                    // console.log(children);
                    if (children.length) {
                        item.children = children
                    }
                }
            })
            return newArr
        }
        _this.deptList = changeTree(res.data, 0)
    })

}

// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
onMounted(() => {
    // getPostList(); // 获取岗位列表
    // getDeptList(); // 获取部门列表
})
</script>

<style lang="scss" scoped></style>
