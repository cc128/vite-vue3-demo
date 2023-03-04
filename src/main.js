import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import "./assets/element.scss"
// import 'element-plus/dist/index.css'
import locale from "element-plus/dist/locale/zh-cn.mjs"

import "./api/api"
import './assets/init.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, { locale })

app.mount('#app')
