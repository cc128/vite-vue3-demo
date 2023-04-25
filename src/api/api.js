import { ElMessage } from 'element-plus'
import { downloadFile } from "../Tools/index"
const reqFn = (as, method = "get") => {
    let url = as[0] || ""; // 请求地址
    let data = as[1] || ""; // 请求参数
    let headers = as[2] || {}; // 请求头
    const req = () => {
        // 判断请求类型
        let reqType = (method == "get" || method == "delete");
        // 解析参数-拼接到地址栏传参
        if (reqType && data) {
            for (let [key, value, i] of Object.entries(data)) {
                url = url + `&${key}=${value}`;
            }
            url = url.replace("&", "?")
        }
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxIiwicm5TdHIiOiJTaTJweXZ2UkluS2J5R3BKMFdDM1A1eXN5YzZISDFyVSJ9.A1td6jozCvDs80ennEauDziGHIGx7NXQ-y3ZWUyJ_ZQ"
        if (!url.includes("/login")) {
            headers.Authorization = "Bearer " + token;
            headers.Cookie = "Admin-Token=" + token
        }
        let name, type;
        return fetch(import.meta.env.VITE_BASE_URL + url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: (reqType) ? null : JSON.stringify(data)
        }).then(res => {
            if (res.status == 404) {
                ElMessage({
                    message: "无效请求：404",
                    grouping: true,
                    type: "error"
                })
            } else if (res.status == 401) {
                ElMessage({
                    message: "请求认证失败",
                    grouping: true,
                    type: "error"
                })
            }
            name = decodeURI(res.headers.get("download-filename"));
            type = res.headers.get("content-type");
            if (url.includes("export")) {
                return res.blob();
            } else {
                return res.json();
            }

        }).then(res => {
            if (res.code) {
                if (res.code != 200) {
                    ElMessage({
                        message: res.msg,
                        grouping: true,
                        type: "error"
                    })
                }
                return res
            } else {
                downloadFile(res, name, type); //下载文件
            }
        })
    }
    return new Promise((resolve, reject) => {
        //     let AEL = (e) => {
        resolve(req());
        //         document.removeEventListener("click", AEL)
        //     }
        //     document.addEventListener("click", AEL)
    })
}
window.$fetch = {
    get: function () {
        return reqFn(arguments, "get")
    },
    post: function () {
        return reqFn(arguments, "post")
    },
    put: function () {
        return reqFn(arguments, "put")
    },
    delete: function () {
        return reqFn(arguments, "delete")
    }
}