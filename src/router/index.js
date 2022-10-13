import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/home/index.vue'),
            children: [
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
                {
                    path: "/screenShot",
                    name: "screenShot",
                    component: () => import("@/views/screenShot/index.vue")
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
