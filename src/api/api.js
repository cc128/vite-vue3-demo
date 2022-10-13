import { ElMessage } from 'element-plus'
const reqFn = (as, method = "get") => {
    let url = as[0] || ""; // 请求地址
    let data = as[1] || ""; // 请求参数
    let headers = as[2] || {}; // 请求头
    const req = () => {
        // 判断请求类型
        let isGetUrl = (method == "get" || method == "delete");
        // 解析参数-拼接到地址栏传参
        if (isGetUrl && data) {
            for (let [key, value, i] of Object.entries(data)) {
                url = url + `&${key}=${value}`;
            }
            url = url.replace("&", "?")
        }
        return fetch(import.meta.env.VITE_BASE_URL + url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: (isGetUrl) ? null : JSON.stringify(data)
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
            return res.json()
        })
    }
    return new Promise((resolve, reject) => {
        let AEL = () => {
            resolve(req());
            document.removeEventListener("click", AEL)
        }
        document.addEventListener("click", AEL)
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