/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <div class="nav-top">
        <div class="toolbar">
            <el-radio-group v-model="isCollapse" style="margin-right: 20px;">
            <el-radio-button :label="false">打开</el-radio-button>
            <el-radio-button :label="true">关闭</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="getMsg">请求接口</el-button>
        <!-- <el-dropdown>
                <el-icon style="margin-right: 8px; margin-top: 1px">
                    <setting />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>View</el-dropdown-item>
                        <el-dropdown-item>Add</el-dropdown-item>
                            <el-dropdown-item>Delete</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <span>Tom</span> -->
        </div>
    </div>
    <div class="menu-box">
        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" router :collapse="isCollapse"
            @open="handleOpen" @close="handleClose">
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <Brush />
                    </el-icon>
                    <span>画布</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="canvas">移动的小球</el-menu-item>
                </el-menu-item-group>

            </el-sub-menu>
            <el-menu-item index="three">
                <el-icon>
                    <icon-menu />
                </el-icon>
                <template #title>模型</template>
            </el-menu-item>
            <el-sub-menu index="2">
                <template #title>
                    <el-icon>
                        <Tools />
                    </el-icon>
                    <span>工具</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="screenShot">截屏</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="signature">签名</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="table">表格</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>

        </el-menu>
        <div class="content-box">
            <router-view></router-view>
        </div>
    </div>
</template>
  

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
import { Menu as IconMenu, Brush, Setting, Tools } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRoute();
const isCollapse = ref(false);
const defaultActive = ref(router.name);
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}

let url = "/v1/warning/serialnumber/KU2XbJhqzcwIm6FqYq5D";
let p = {
    end_time: null,
    start_time: null
}
let h = {
    'X-Center-Authentication': 'v=1;id=9;n=hqrmhn5u;x=0;expiry=2121-08-07T13:45:53+08:00;hmac=HpkkL1fUZCvHTCAcEGe7Z75goLE75fV_y8LRBFZecy8='
}
const state = reactive({
    list: []
})


const getMsg = () => {
    $fetch.post(url, p, h).then(res => {
        console.log(res, "接口返回数据")
        state.list = res;
    })
}


// const { ctx } = getCurrentInstance()
// defineProps({})
// watch('let', async (v1, v2) => { })
// computed(() => { return })
// onMounted(() => { })
</script>

<style lang="scss" scoped>
.nav-top {
    width: 100%;
    height: 60px;

    .toolbar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        right: 20px;
    }
}

.menu-box {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .content-box {
        width: calc(100% - 200px);
        flex: 1;
        height: calc(100% - 40px);
        padding: 20px;
        box-shadow: inset 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
}
</style>
