import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/home/index.vue'),
            children: [
                {
                    path: "/",
                    name: "",
                    redirect: "/canvas",
                },
                {
                    path: "/three",
                    name: "three",
                    component: () => import('../views/three/index.vue'),
                },
                {
                    path: "/canvas",
                    name: "canvas",
                    component: () => import("@/views/canvas/index.vue")
                },
                // 截屏
                {
                    path: "/screenShot",
                    name: "screenShot",
                    component: () => import("@/views/tool/screenShot/index.vue")
                },
                // 签名
                {
                    path: "/signature",
                    name: "signature",
                    component: () => import("@/views/tool/signature/index.vue")
                },
                // 表格
                {
                    path: "/table",
                    name: "table",
                    component: () => import("@/views/tool/table/index.vue")
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login/index.vue')
        }
    ]
})

export default router
