// baset64转文件
const baset64toFile = (dataURL, fileName, fileType) => {
    let arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: fileType || 'image/jpg' });  //返回file对象
}
// 图片下载
const downloadImg = (imgsrc, name) => {
    let image = new Image();
    image.setAttribute("crossOrigin", "anonymous"); //解决跨域
    image.src = imgsrc;
    image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png", 0.8);
        let a = document.createElement("a");
        a.download = name ? name + ".png" : "photo.png";
        a.href = url;
        a.click();
        a.remove();
        ElMessage({
            message: '下载完成',
            grouping: true,
            type: 'success',
        })
        image = null;
    }
}
// 文件下载-可下载页面文件-或接口返回文件
const downloadFile = (data, name, type) => {
    let setF = (f, n, t) => {
        var blob = new Blob([f], { type: t || null }); //创建一个blob对象
        var a = document.createElement('a'); //创建一个<a></a>标签
        a.href = URL.createObjectURL(blob); // response is a blob
        a.download = n || "a.png"; //文件名称
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    if (data && data.target && data.target.files) {
        let FS = data.target.files;
        FS.forEach(e => {
            setF(e, e.name, e.type)
        })
        data.target.value = null;
    } else {
        setF(data, name, type)
    }
}
const watermark = (txt = "我是水印", wn = 8, hn = 6, color = "#000", deg = -20) => {
    let body = document.body;
    let Canvas = document.createElement("canvas");
    Canvas.setAttribute("id", "watermark");
    body.appendChild(Canvas);

    let canvas = document.getElementById("watermark");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '99999';
    canvas.style.pointerEvents = 'none';
    // canvas.style.opacity = '1';

    let ctx = canvas.getContext("2d");
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;

    ctx.globalAlpha = 0.1; // 透明度
    ctx.font = "14px '字体','字体','微软雅黑','宋体'"; //设置字体
    ctx.fillStyle = color; //设置线的颜色状态


    let left = canvas.width / wn;
    let top = canvas.height / hn;
    let leftCenter = (left - txt.length * 14) / 2;
    let topCenter = (top - 14) / 2;
    let n = 10;
    for (let i = 0; i < hn; i++) {
        for (let k = 0; k < wn; k++) {
            ctx.save(); // 保存当前状态
            ctx.translate(left * k + leftCenter, top * i + topCenter); //旋转中心的
            ctx.rotate(Math.PI / 180 * deg);
            ctx.fillText(txt, 0, 0); //设置文本内容
            ctx.restore();// 恢复之前的状态
        }
    }
    body.appendChild(canvas);
    let setInt = setInterval(() => {
        if (document.getElementById("watermark")) {
            return
        } else {
            clearInterval(setInt)
            watermark(txt, wn, hn, color)
        }
    }, 2000);
}
export { baset64toFile, downloadImg, downloadFile, watermark }