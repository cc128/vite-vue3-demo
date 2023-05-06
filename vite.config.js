import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from 'path'
import fs from 'fs'

export default defineConfig({
    plugins: [
        vue({
            // reactivityTransform: true
        }),
        vueJsx()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: "./",
    server: {
        // https: {
        //     cert: fs.readFileSync(path.join(__dirname, 'keys/pem.pem')),
        //     key: fs.readFileSync(path.join(__dirname, 'keys/key.key')),
        // },
        host: "0.0.0.0",
        port: 8080,
        open: true,
        proxy: {
            "^/api": {
                target: "http://47.92.100.118:81",
                changeOrigin: true, //开启代理
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/assets/index.scss" as *;`
            }
        }
    }
})
