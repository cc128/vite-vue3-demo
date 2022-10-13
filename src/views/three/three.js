import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; //控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; //模型加载器
const TWEEN = require('@tweenjs/tween.js'); // 移动过度动画
// 后期通道
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { EffectComposer } from './localThree/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from './localThree/ShaderPass';
import { OutlinePass } from './localThree/OutlinePass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';

class threeModel {
    constructor(el, params = { light: 2, zoomMin: 0, zoomMax: 20000 }, cb) {
        this.el = el; //渲染的容器
        this.width = null; //窗口宽度
        this.height = null; //窗口高度
        this.scene = null; // 场景
        this.camera = null; //相机
        this.light = null; //光源
        this.renderer = null; //渲染器
        this.controls = null; //控制器
        this.glbloader = new GLTFLoader(); //glb加载器
        this.rotateX = 0; //模型角度
        this.rotateY = 0; //模型角度

        this.tween = null; //移动过度动画
        this.stats = null; //性能插件

        // 后期通道使用数据
        this.composer = null;
        this.renderPass = null;
        this.outlinePass = null;
        this.effectFXAA = null;
        this.selectedObjects = [];

        this.threeParams = params;
        this.initScene();// 初始化
        // 初始化回调事件
        this.callBack = cb;

        this.textureP = { url: "./5.png", repeatX: 50, repeatY: 1, offsetX: 0, offsetY: 0, moveD: "x", moveS: 0.005 }; //材质参数
        this.texture = null; //材质
        // this.gui = new GUI()
        this.isStop = false;
        this.RAF = null;

        // 控制是否渲染相机和场景
        this.rendererEnabled = true;
        this.timeOut = 0;

    }
    /**
     * 初始化
    */
    initScene() {
        this.scene = new THREE.Scene(); // 场景
        // this.scene.fog = new THREE.Fog(0x333333, 1000, 150000);
        this.getWH(); // 获取宽高
        this.createLight(); // 光源
        this.createCamera(); // 相机
        this.createRenderer(); // 渲染器
        this.createControls(); // 控制器
        this.rendererScene(); // 渲染场景
        this.windowResize(); // 更新
    }
    /**
    * 获取宽高
    */
    getWH() {
        this.width = this.el ? this.el.offsetWidth : window.innerWidth; //窗口宽度
        this.height = this.el ? this.el.offsetHeight : window.innerHeight; //窗口高度
    }
    /**
     * 光源
    */
    createLight() {
        // this.screenLight = 0.1
        let light = new THREE.DirectionalLight(0xffffff, Number(this.threeParams.light / 10)); //平行光
        let light2 = new THREE.AmbientLight(0xffffff, Number(this.threeParams.light / 10)); //环境光--没有影子
        light.castShadow = true; //投射影子
        // light.position.set(0, 50, 50); //点光源位置
        // light.shadow.camera.near = 10;
        // light.shadow.camera.far = 100; // 底
        // light.shadow.camera.left = -50; // 左
        // light.shadow.camera.right = 50; // 右
        // light.shadow.camera.top = 50; // 前
        // light.shadow.camera.bottom = -50; // 后
        // let helper = new THREE.CameraHelper(light.shadow.camera);
        // this.scene.add(helper);
        this.scene.add(light); //光源添加到场景中
        this.scene.add(light2); //光源添加到场景中
    }
    /**
     * 相机
    */
    createCamera(s = 100000000) {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 100, s);
        this.camera.position.set(100, 100, 100); //x,y,z 眼睛/相机的位置
    }
    /**
     * 渲染器
     * 1、参考文档地址 http://www.webgl3d.cn/threejs/docs/#api/zh/constants/Renderer
    */
    createRenderer() {
        // animate: true, 
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlphaL: true, preserveDrawingBuffer: true, }); // 保留缓存 
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xbbbbbb, 1); //背景颜色、透明度
        this.renderer.shadowMap.enabled = true; // 启动阴影
        this.renderer.xr.enabled = true;
        // this.renderer.sortObjects = false; //  使渲染顺序改为，先加入场景的先渲染
        this.renderer.xr.setReferenceSpaceType('local');
        this.renderer.outputEncoding = THREE.sRGBEncoding; // 处理颜色偏差
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
        this.renderer.logarithmicDepthBuffer = true; // 是否使用对数深度缓存-解决模型闪面问题
        // this.renderer.toneMappingExposure = 0; // 色调曝光级别
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // 色彩映射
        this.el.appendChild(this.renderer.domElement);
    }
    /**
     * 控制器
     * 1、参考文档地址 http://www.webgl3d.cn/threejs/docs/#examples/zh/controls/OrbitControls
    */
    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement); //创建控件对象
        // this.controls.enableDamping = true; // 将其设置为true以启用阻尼（惯性）
        // this.controls.dampingFactor = 0.15; // 阻尼值
        this.controls.maxPolarAngle = 1.5; // 上下翻转的最大角度
        this.controls.minPolarAngle = 0; // 上下翻转的最小角度
        this.controls.rotateSpeed = 0.3; // 拖到旋转速度
        this.controls.minDistance = this.threeParams.zoomMin; // 缩放最小值
        this.controls.maxDistance = this.threeParams.zoomMax; // 缩放最大值

        this.controls.addEventListener("change", (e) => {
            this.timeRender();
            if (this.callBack) {
                this.callBack({ type: 'controls', isAutoRotate: this.controls.autoRotate });
            }
        }); //监听鼠标、键盘事件
    }
    timeRender() {
        this.rendererEnabled = true;
        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
        }
        this.timeOut = setTimeout(() => {
            this.rendererEnabled = false;
        }, 5000);
    }
    /**
     * 渲染场景
    */
    rendererScene(callBack) {
        var clock = new THREE.Clock();
        let len = 0;
        let arr = 0;
        const render = () => {
            if (callBack) {
                callBack();
            };
            this.controls.update(clock.getDelta());
            if (this.rendererEnabled) {
                this.renderer.render(this.scene, this.camera); //执行渲染操作
            }
            this.rotateX = this.controls.getAzimuthalAngle() * (180 / Math.PI); // 模型角度
            this.rotateY = this.controls.getPolarAngle() * (180 / Math.PI) - 90; // 模型角度
            if (this.composer) {
                this.composer.render();
            }
            if (this.stats) {
                this.stats.update();
            }
            // shader
            if (this.uniforms) {
                len = Object.keys(this.uniforms);
            }
            if (len) {
                arr = Object.values(this.uniforms).flat();
                arr.forEach(item => {
                    item.uniform.u_r.value += item.speed || 0.1;
                    if (item.uniform.u_r.value >= item.r) {
                        item.uniform.u_r.value = item.init;
                    }
                });
            }
            // // 更新雪花
            // this.updateSnow();
            // // 更新雨水
            // this.updateRain();
            TWEEN.update();
            window.requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        };
        render();
        // setInterval(() => {
        //     this.updateScene();
        // }, 2000);
    }
    /* 
    ** 更新-浏览器窗口变化时，重新渲染场景
    */
    windowResize() {
        window.addEventListener('resize', () => {
            let s = setTimeout(() => {
                this.updateScene();
                clearTimeout(s);
            }, 300);
        }, false);
    }
    /* 
    ** 更新渲染场景
    */
    updateScene() {
        this.getWH(); // 获取宽高
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);

        if (this.composer) {
            this.composer.setSize(this.width, this.height);
            this.effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
        }
    }
    /* 视角平滑移动
    ** newP  相机新的位置
    ** newT  target新的位置(中心点)
    ** callBack  动画结束时的回调函数
    */
    animateCamera(newP, newT = { x: 0, y: 0, z: 0 }, callBack) {
        var tween = new TWEEN.Tween({
            x1: this.camera.position.x, // 相机x --相机原来的位置
            y1: this.camera.position.y, // 相机y
            z1: this.camera.position.z, // 相机z
            x2: this.controls.target.x, // 控制点的中心点x -- target原来的位置
            y2: this.controls.target.y, // 控制点的中心点y
            z2: this.controls.target.z // 控制点的中心点z
        });
        tween.to({
            x1: Number(newP.x),
            y1: Number(newP.y),
            z1: Number(newP.z),
            x2: Number(newT.x || 0),
            y2: Number(newT.y || 0),
            z2: Number(newT.z || 0)
        }, 1000);
        tween.onUpdate((object) => {
            this.camera.position.x = object.x1;
            this.camera.position.y = object.y1;
            this.camera.position.z = object.z1;
            this.controls.target.x = object.x2;
            this.controls.target.y = object.y2;
            this.controls.target.z = object.z2;
            this.controls.update();
        });
        tween.onComplete(() => {
            this.controls.enabled = true;
            callBack && callBack();
        });
        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();
    }
    /**
    * 性能插件
    */
    initStats() {
        this.stats = new Stats();
        this.el.appendChild(this.stats.dom);
    }
    /**
    * 加载模型
    * @param {string} url 模型地址
    * @param {string} name 模型名称
    * @param {Fn} callBack 加载进度回调方法
    */
    loadModel(url, name = "模型", callBack) {
        // console.log(new URL("https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png", import.meta.url).href, 1111)
        let progress = 0;
        let model = null;
        if (!url) return
        this.glbloader.load(
            url,
            (glb) => {
                // let texture = this.setTexture({ url: "./three/8.png" });
                // this.getFitScaleValue(glb.scene)
                glb.scene.name = name;
                glb.scene.traverse((child) => {
                    if (child.isMesh) {
                        // child.material.map = texture;
                        // console.log(child.material.map, i, 444444)
                        // 网格-添加同一模型唯一标识
                        child.Marker = url;
                        this.selectedObjects.push(child); // 后期通道存储数据--存储所有加载模型的网格
                        // 双面材质显示
                        child.material.emissive = child.material.color;
                        child.material.emissiveMap = child.material.map;
                        child.material.side = THREE.DoubleSide;
                        // child.material.color = 0x00ff00;

                        child.castShadow = true; // 投射影子
                        child.receiveShadow = true; // 接收影子
                        child.material.transparent = true;
                        // child.material.depthWrite = false;
                        // child.material.alphaTest = 0.5;
                    }
                })
                model = glb.scene;
                this.scene.add(glb.scene)
                callBack(progress, model); //进度
            },
            onProgress => {
                progress = parseInt((onProgress.loaded / onProgress.total) * 100);
                if (callBack) {
                    callBack(progress); //进度
                }
            },
            onError => { }
        )
    }
    /**
    * 可移动模型贴图（管道流动动画）
    * @param {string} url 图片地址
    * @param {number} repeatX x方向图片平铺个数
    * @param {number} repeatY y方向图片平铺个数
    * @param {number} offsetX x方向偏移值0-1
    * @param {number} offsetY y方向偏移值0-1
    * @param {string} moveD 移动方向x/y轴
    * @param {number} moveS 移动速度值（0-1）（一秒移动距离 = 屏幕刷新率 * 移动速度值）
    */
    setTexture(params = {}) {
        let textureP = {
            ... {
                "url": require('./4.png'),
                "repeatX": 53,
                "repeatY": 3,
                "offsetX": 0,
                "offsetY": 0,
                "moveD": "x",
                "moveS": 0.05
            },
            ...params
        };
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(textureP.url);
        // 设置阵列模式 RepeatWrapping
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // 设置x方向的重复数(沿着管道路径方向)
        // 设置y方向的重复数(环绕管道方向)
        texture.repeat.x = textureP.repeatX;
        texture.repeat.y = textureP.repeatY;
        // 设置管道纹理偏移数,便于对中
        texture.offset.x = textureP.offsetX;
        texture.offset.y = textureP.offsetY;
        // 使用加减法可以设置不同的运动方向
        let render = () => {
            texture.offset[textureP.moveD] -= textureP.moveS;
            window.requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        };
        render();
        return texture;
    }
    // 后期通道-创建
    // 1、传入空数组为取消高亮。 
    // 2、传入网格数组为高亮模型（通过“getModel”方法获取模型网格数组）
    // 3、参考文档 http://www.webgl3d.cn/threejs/docs/#examples/zh/postprocessing/EffectComposer
    setSelectCube() {
        // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
        this.composer = new EffectComposer(this.renderer);
        // 新建一个场景通道  为了覆盖到原理来的场景上
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(gammaCorrectionPass);


        // 物体边缘发光通道
        this.outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), this.scene, this.camera);
        this.outlinePass.pulsePeriod = 2.5; // 呼吸闪烁的速度
        this.outlinePass.visibleEdgeColor.set(0xffffff); // 呼吸显示的颜色
        // this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
        this.outlinePass.hiddenEdgeColor.set(0xffffff); // 呼吸消失的颜色
        this.outlinePass.usePatternTexture = false; // 是否使用父级的材质
        this.outlinePass.edgeStrength = 3; // 边框的亮度
        this.outlinePass.edgeGlow = 1; // 光晕[0,1]
        this.outlinePass.edgeThickness = 3; // 边框宽度

        this.outlinePass.downSampleRatio = 2; // 边框弯曲度
        this.outlinePass.clear = true;
        this.composer.addPass(this.outlinePass);
        this.effectFXAA = new ShaderPass(FXAAShader);
        this.effectFXAA.uniforms.resolution.value.set(1 / this.width, 1 / this.height);
        this.effectFXAA.renderToScreen = true;

        // 设置场景亮度
        // this.renderer.outputEncoding = THREE.sRGBEncoding; // 处理颜色偏差
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
        // this.renderer.logarithmicDepthBuffer = true; // 是否使用对数深度缓存-解决模型闪面问题
    }
    // 设置自发光
    setOutline(meshList = []) {
        if (!this.outlinePass) {
            this.timeRender();
            this.setSelectCube();
        }
        this.outlinePass.selectedObjects = meshList;
    }
}