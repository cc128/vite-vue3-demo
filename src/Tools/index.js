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
const UpImg = (imgsrc, name) => {
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
const UpFile = (data, name) => {
    let setF = (f, n) => {
        var blob = new Blob([f]); //创建一个blob对象
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
            setF(e, e.name)
        })
        data.target.value = null;
    } else {
        setF(e, name)
    }
}
export default { baset64toFile, UpImg, UpFile }