import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'
import fs from 'fs'

export default defineConfig({
    plugins: [vue({
        // reactivityTransform: true
    })],
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
        open: true
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/index.scss";`
            }
        }
    }
})
