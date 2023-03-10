/*
创建者：xx
模块名称：xxxx
备注：xxxx
*/
<template>
    <el-dialog v-model="props.dialogVisible" title="编辑" width="30%" draggable destroy-on-close :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form ref="dialogForm" :model="props.formParams" class="form-box" :rules="_this.rules">
            <el-row>
                <colForm colType="form" :formInfo="props.formInfo" v-model:formParams="props.formParams">
                    <template #default="scope">
                        <slot v-if="isName" :name="scope.row" :form="scope.form" :placeholder="scope.placeholder"></slot>
                        <slot v-else-if="!isName" :row="scope.row" :form="scope.form" :placeholder="scope.placeholder"></slot>
                    </template>
                </colForm>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogForm.resetFields()">重置</el-button>
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue';
import colForm from "./colForm.vue";

let props = defineProps({
    dialogVisible: { type: Boolean, default: false },
    formInfo: { type: Object, default: {} },
    formParams: { type: Object, default: {} },
    isName: { type: Boolean, default: true }, // 跨组件传值-用于区分slot
})

const getRules = () => {
    let arr = props.formInfo.filter((e) => {
        return e.required
    })
    if (arr.length) {
        let obj = {};
        arr.map(e => {
            obj[e.value] = [
                {
                    required: true,
                    message: e.message || e.label + "不能为空",
                    trigger: e.trigger || "change"
                }
            ]
            return obj
        })
        return obj
    }
    return []
}

let _this = reactive({
    rules: getRules(),
})

let emit = defineEmits(["update:dialogVisible", "confirm", "close"])
let dialogForm = ref(null);
// 确定
const confirm = () => {
    dialogForm.value.validate((valid, fields) => {
        if (valid) {
            emit("confirm", props.formParams)
            // emit("update:dialogVisible", false)
        } else {
            console.log('error submit!', fields)
        }
    })
}
// 关闭
const close = () => {
    dialogForm.value.resetFields();
    emit("close", "");
    emit("update:dialogVisible", false);
}
// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch(props.formInfo, async (v1, v2) => {})
// computed(() => { return })

// onMounted(() => {})
</script>

<style lang="scss">
.el-dialog__body {
    padding-bottom: 0px !important;
}
</style>
