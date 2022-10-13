// baset64转文件
const baset64toFile = (dataURL, fileName, fileType) => {
    let arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: fileType || 'image/jpg' });  //返回file对象
}
export default { baset64toFile }