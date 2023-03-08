/*
创建者：xx
模块名称：表单组件
备注：xxxx
*/
<template>
    <!--  -->

    <el-col v-for="(item, i) in _this.formQuery" :key="i"
        :span="(type == 'form') ? (item.formCol || 12) : (item.queryCol || 4)">
        <el-form-item :label="item.label" :prop="item.value"
            :label-width="item.labelWidth || (type == 'form' ? '80px' : '')">
            <slot :row="type + '-' + item.value" :form="formParams" :placeholder="item.label">
                <el-date-picker v-if="item.type && item.type.includes('date')" v-model="formParams[item.value]"
                    :type="item.type" :placeholder="'请选择' + item.label" clearable value-format="YYYY-MM-DD"
                    :style="item.style || { width: '100%' }"></el-date-picker>
                <el-select v-else-if="item.type && item.type == 'select'" v-model="formParams[item.value]"
                    :multiple="item.multiple" :placeholder="'请选择' + item.label" clearable
                :style="item.style || { width: '100%' }">
                    <el-option v-for="item in item.option" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <!-- <slot v-else-if="!!useSlots()[type + '-' + item.value]" :name="type + '-' + item.value" :form="formParams"
                        :placeholder="item.label"></slot> -->
                <el-input v-else v-model="formParams[item.value]" :type="item.type" :placeholder="'请输入' + item.label"
                    clearable :style="item.style || { width: '100%' }" />
            </slot>
        </el-form-item>
    </el-col>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, useSlots, onMounted, watch } from 'vue';
import { ArrowDown, Check, CircleCheck, CirclePlus, CirclePlusFilled, Plus, } from '@element-plus/icons-vue'
let props = defineProps({
    formInfo: { type: Array, default: [] },
    type: { type: String, default: "query" },
    formParams: { type: Object, default: {} },
})
let _this = reactive({
    formQuery: [], // 表格显示数据
})
const setMsg = () => {
    _this.formQuery = props.formInfo.filter((e) => {
        return (!e.elType || (e.elType && e.elType.includes(props.type)))
    })
    if (props.type == 'form') {
        _this.formQuery.sort((a, b) => {
            return a.formSort - b.formSort
        })
    }
}
// import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
// const { ctx } = getCurrentInstance()
// defineProps({})
// watch(props.formInfo, async (v1, v2) => {
//     setMsg()
// })
// computed(() => { return })

onMounted(() => {
    setMsg();
})
</script>

<style lang="scss" scoped></style>
