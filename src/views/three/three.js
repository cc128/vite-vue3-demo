import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; //控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; //模型加载器

// 后期通道
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
// import GUI from 'dat.gui';
class threeModel {
    constructor(el, screenLight = 1) {
        this.el = el; //渲染的容器
        this.width = null; //窗口宽度
        this.height = null; //窗口高度
        this.scene = null; // 场景
        this.camera = null; //相机
        this.light = null; //光源
        this.renderer = null; //渲染器
        this.controls = null; //控制器
        this.glbloader = new GLTFLoader(); //glb加载器
        this.rotateX = 0;
        this.rotateY = 0;

        // 后期通道使用数据
        this.composer = null;
        this.renderPass = null;
        this.outlinePass = null;
        this.effectFXAA = null;
        this.selectedObjects = [];
        this.screenLight = screenLight;
        this.initScene();// 初始化

        this.textureP = { url: "./three/5.png", repeatX: 50, repeatY: 1, offsetX: 0, offsetY: 0, moveD: "x", moveS: 0.005 }; //材质参数
        this.texture = null; //材质
        // this.gui = new GUI()
        this.isStop = false;

        this.RAF = null;
    }
    // 获取宽高
    getWH() {
        this.width = this.el ? this.el.offsetWidth : window.innerWidth; //窗口宽度
        this.height = this.el ? this.el.offsetHeight : window.innerHeight; //窗口高度
    }
    // 初始化
    async initScene() {
        this.scene = new THREE.Scene(); // 场景
        this.getWH(); // 获取宽高
        this.createLight(); // 光源
        this.createCamera(); // 相机
        this.createRenderer(); // 渲染器
        this.createControls(); // 控制器
        this.rendererScene();// 渲染场景
        this.gridHelper(); // 平面辅助线
        // this.createPlane(); // 平面
        var axisHelper = new THREE.AxisHelper(500);
        this.scene.add(axisHelper);
        // this.addRipple();// 波纹
        let vertices = [
            -10, 0, 10,
            10, 0, 10,
            -10, 10, 10,
            10, 10, 10,

            10, 0, 10,
            20, 0, -10,
            10, 10, 10,
            20, 10, -10,

            20, 0, -10,
            10, 0, -30,
            20, 10, -10,
            10, 10, -30
        ]
        // let vertices = [
        //     -10, 0, 10,
        //     10, 0, 10,
        //     10, 0, -10,
        //     -10, 0, -10,
        // ];
        // this.addWall(vertices); //创建围墙
        // this.createTube();
        this.windowResize(); // 更新
    }
    //创建围墙
    addWall(arr = [], imgUrl = `./three/4.png`) {
        let geometry = new THREE.TorusKnotGeometry(5);
        let url = new URL(imgUrl, import.meta.url).href;
        let texture = new THREE.TextureLoader().load(url);
        // 设置阵列模式 RepeatWrapping
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        // 设置x方向的重复数(沿着管道路径方向)
        // 设置y方向的重复数(环绕管道方向)
        texture.repeat.x = 1;
        texture.repeat.y = 1;
        // 设置管道纹理偏移数,便于对中
        texture.offset.y = 0;
        texture.offset.x = 0;

        var material = new THREE.MeshPhongMaterial({
            map: texture, // 贴图
            side: THREE.DoubleSide,// 双面显示
            transparent: true, // 开启透明效果
            opacity: 1,
            // depthTest: false,  // 是否在渲染此材质时启用深度测试。默认为 true。
            depthWrite: false,  // 渲染此材质是否对深度缓冲区有任何影响。默认为true。-//设置透明的材质是会否遮挡其他内容
            // blending: THREE.AdditiveBlending
        })
        let mesh = new THREE.Mesh(geometry, material)
        setInterval(() => {
            texture.offset.x -= 0.005
        })
        this.scene.add(mesh)
    }
    // 加载模型
    // 1、加载地址
    // 2、模型名称
    // 3、回调（模型加载进度值）
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
    createTube(radius = 4) {
        let pathArr = [
            // new THREE.Vector3(4624.99, 2329.38, -5843.11),
            // new THREE.Vector3(4624.99, 4643.14, -5843.11),
            // new THREE.Vector3(1437.47, 4643.14, -5819.36),
            // new THREE.Vector3(1413.69, 4643.14, -1854.40),
            // new THREE.Vector3(-6983.28, 4643.14, -1854.04),
            // new THREE.Vector3(-7078.43, 4643.14, 2149.46)

            // new THREE.Vector3(-100, 10, 100),
            // new THREE.Vector3(100, 10, 100),
            // new THREE.Vector3(100, 10, -100),
            // new THREE.Vector3(-100, 10, -100),
            // new THREE.Vector3(-100, 10, 100),
        ]
        let r = 50;
        for (let i = Math.PI * 2; i <= Math.PI * 2; i -= 0.1) {
            if (i <= 0) {
                break;
            }
            let xy = new THREE.Vector3(r * Math.sin(i), 10, r * Math.cos(i), 0);
            // r += 1;
            pathArr.push(xy)
        }

        let curve = new THREE.CatmullRomCurve3(pathArr);
        let tubeGeometry = new THREE.TubeGeometry(curve, 50, radius, 2, false);

        let texture = this.setTexture();
        let meshPhongMaterial = this.setChartlet(texture);
        let tube = new THREE.Mesh(tubeGeometry, meshPhongMaterial);
        tube.castShadow = true;
        this.scene.add(tube);
        return tube
    }
    /**
     * 可移动模型贴图
     * @param {string} url 图片地址
     * @param {number} repeatX x方向图片平铺个数
     * @param {number} repeatY y方向图片平铺个数
     * @param {number} offsetX x方向偏移值0-1
     * @param {number} offsetY y方向偏移值0-1
     * @param {string} moveD 移动方向x/y轴
     * @param {number} moveS 移动速度值（0-1）（一秒移动距离 = 屏幕刷新率 * 移动速度值）
     */
    setTexture(params = {}) {
        this.textureP = {
            ...{ url: "./three/5.png", repeatX: 50, repeatY: 1, offsetX: 0, offsetY: 0, moveD: "x", moveS: 0.005 },
            ...params
        };
        let textureLoader = new THREE.TextureLoader();
        let url = new URL(this.textureP.url, import.meta.url).href;
        let texture = textureLoader.load(url);
        // 设置阵列模式 RepeatWrapping
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        // 设置x方向的重复数(沿着管道路径方向)
        // 设置y方向的重复数(环绕管道方向)
        texture.repeat.x = this.textureP.repeatX;
        texture.repeat.y = this.textureP.repeatY;
        // 设置管道纹理偏移数,便于对中
        texture.offset.x = this.textureP.offsetX;
        texture.offset.y = this.textureP.offsetY;
        // 使用加减法可以设置不同的运动方向
        // let render = () => {

        // }
        // render()
        setInterval(() => {
            if (this.isStop) return;
            texture.offset[this.textureP.moveD] -= this.textureP.moveS;
            window.requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        }, 16.7);
        this.texture = texture;
        return texture
    }
    getTextureP() {
        return this.textureP
    }
    setTextureP(p) {
        this.texture.repeat.x = p.repeatX;
        this.texture.repeat.y = p.repeatY;
        this.texture.offset.x = p.offsetX;
        this.texture.offset.y = p.offsetY;
        this.textureP = p;
        // return this.textureP
    }
    /**
     * 设置模型材质
     * @param {string} u 图片地址
     */
    setModeTexture(params = {}) {
        let p = {
            ...{ url: "", alphaTest: 0.1 },
            ...params
        }
        this.textureP.url = p.url;
        this.selectedObjects.forEach((e) => {
            if (p.url) {
                let image = new Image()
                image.src = p.url;
                image.onload = () => {
                    e.material.map.image = image;
                    e.material.map.needsUpdate = true;
                }
            }
        })
    }
    // 贴图增加材质属性
    setChartlet(texture) {
        let meshPhongMaterial = new THREE.MeshPhongMaterial({
            map: texture, // 贴图
            // side: THREE.DoubleSide,// 双面显示
            // side: THREE.FrontSide,// 双面显示
            // transparent: true, // 开启透明效果
            color: 0x00ff00,
            alphaTest: 0.05,
            // opacity: 0.5,
            // depthTest: false,  // 是否在渲染此材质时启用深度测试。默认为 true。
            // depthWrite: false,  // 渲染此材质是否对深度缓冲区有任何影响。默认为true。-//设置透明的材质是会否遮挡其他内容
            // blending: THREE.AdditiveBlending
        });
        return meshPhongMaterial
    }
    // 暂停或继续
    setStop() {
        this.isStop = !this.isStop;
        return this.isStop
    }
    // 波纹
    addRipple() {
        let url = new URL(`./three/2.png`, import.meta.url).href;
        let texture = new THREE.TextureLoader().load(url);
        // 创建一个圆柱
        let geometry = new THREE.CylinderBufferGeometry(1, 1, 6, 100);
        let mesh = new THREE.Mesh(geometry, [
            new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide, // 双面贴图
                transparent: true,
                opacity: 1,
                depthWrite: false, //设置透明的材质是会否遮挡其他内容
            }),
            // new THREE.MeshPhongMaterial({
            //     transparent: true,
            //     opacity: 0,
            //     side: THREE.DoubleSide
            // }),
            // new THREE.MeshPhongMaterial({
            //     transparent: true,
            //     opacity: 0,
            //     side: THREE.DoubleSide
            // }),
        ])
        mesh.position.setY(3);
        this.scene.add(mesh); //光源添加到场景中

        let num = 0;
        let num2 = 1;
        let T0 = new Date(); //上次时间

        const render = () => {
            let T1 = new Date(); //本次时间
            let t = T1 - T0; //时间差
            T0 = T1; //把本次时间赋值给上次时间

            num += 0.25;
            num2 -= (1 / (49 / 0.25));
            mesh.scale.set(num, 1, num)
            mesh.material[0].opacity = num2;
            if (num >= 50) {
                num = 1;
                num2 = 1;
            }
            // console.log(mesh.rotateY(0.001 * t))
            window.requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        };
        render();
    }
    // 平面
    createPlane(w = 200, h = 200, z = -10) {
        let planeGeometry = new THREE.PlaneGeometry(w, h);
        let material = new THREE.MeshLambertMaterial({
            color: 0xffffff
            // wireframe: true
        }); //Lambert网格材质，与光照有反应，漫反射
        let plane = new THREE.Mesh(planeGeometry, material);
        plane.rotation.x = -0.5 * Math.PI;
        // plane.position.set(0, z, 0); //位置
        this.scene.add(plane);
        // 设置投影
        plane.receiveShadow = true;
        // this.planeGeometry = plane;
        // console.log(plane);
    } //平面
    // 平面辅助线
    gridHelper(size = 200, divisions = 20, colorCenterLine = "red", colorGrid = "#fff") {
        let gridHelper = new THREE.GridHelper(
            size,
            divisions,
            colorCenterLine,
            colorGrid
        );
        this.scene.add(gridHelper);
    }
    // 光源
    createLight() {
        // this.screenLight = 0.1
        let light = new THREE.DirectionalLight(0xffffff, Number(this.screenLight)); //平行光
        let light2 = new THREE.AmbientLight(0xffffff, Number(this.screenLight)); //环境光--没有影子
        light.castShadow = true; //投射影子
        light.position.set(0, 50, 50); //点光源位置
        light.shadow.camera.near = 10;
        light.shadow.camera.far = 100; // 底
        light.shadow.camera.left = -50; // 左
        light.shadow.camera.right = 50; // 右
        light.shadow.camera.top = 50; // 前
        light.shadow.camera.bottom = -50; // 后
        let helper = new THREE.CameraHelper(light.shadow.camera);
        this.scene.add(helper);
        this.scene.add(light); //光源添加到场景中
        this.scene.add(light2); //光源添加到场景中
    }
    // 相机
    createCamera(s = 1000000) {
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, s);
        this.camera.position.set(0, 130, 0) //x,y,z 眼睛/相机的位置
    }
    // 渲染器
    // 1、参考文档地址 http://www.webgl3d.cn/threejs/docs/#api/zh/constants/Renderer
    createRenderer() {
        // animate: true, 
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xbbbbbb, 1); //背景颜色、透明度
        this.renderer.shadowMap.enabled = true; // 启动阴影
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
        this.renderer.logarithmicDepthBuffer = true; // 是否使用对数深度缓存-解决模型闪面问题
        this.el.appendChild(this.renderer.domElement);
    }
    // 控制器
    // 1、参考文档地址 http://www.webgl3d.cn/threejs/docs/#examples/zh/controls/OrbitControls
    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement); //创建控件对象
        // this.controls.enableDamping = true; // 将其设置为true以启用阻尼（惯性）
        // this.controls.dampingFactor = 0.15;
        // this.controls.maxPolarAngle = 1.5; // 上下翻转的最大角度
        // this.controls.minPolarAngle = 0; // 上下翻转的最小角度
        // this.controls.rotateSpeed = 0.3; // 拖到旋转速度

        this.controls.addEventListener("change", () => {
            // console.log(this.controls)
            // this.controls.update();
            // this.renderer.render(this.scene, this.camera); //执行渲染操作
        }); //监听鼠标、键盘事件
    }
    // 获取相机/控制器xyz
    getPosition() {
        let l = {
            "cameraX": parseInt(this.camera.position.x),
            "cameraY": parseInt(this.camera.position.y),
            "cameraZ": parseInt(this.camera.position.z),
            "controlsX": parseInt(this.controls.target.x),
            "controlsY": parseInt(this.controls.target.y),
            "controlsZ": parseInt(this.controls.target.z),
        }
        // console.log("当前视角", l)
        return l;
    }
    // 旋转查看模型，更新屏幕坐标
    moveView(callBack) {
        let viewChange = () => {
            callBack()
        };
        if (callBack) {
            this.controls.removeEventListener("change", viewChange, false);
            this.controls.addEventListener("change", viewChange, false);
        }
    }
    // 是否可移动视角
    isMove(isTrue = true) {
        this.controls.enableRotate = isTrue; // 启用或禁用摄像机水平或垂直旋转。默认值为true。
    }
    // 旋转角度
    compass() {
        let v1 = new THREE.Vector3(this.camera.position.x, 0, this.camera.position.z);
        let v2 = new THREE.Vector3(0.0001, 0, 0);
        let a = v1.angleTo(v2);
        if (v1.z > 0) a = -a;
        return a;
        // compass.style.transform = "rotateZ(" + a + "rad)";
    }
    // 渲染场景
    rendererScene(callBack) {
        var clock = new THREE.Clock();
        const render = () => {
            if (callBack) {
                callBack()
            }
            // this.controls.update(clock.getDelta());
            this.controls.update();
            this.renderer.render(this.scene, this.camera); //执行渲染操作
            this.rotateX = this.controls.getAzimuthalAngle() * (180 / Math.PI); // 模型角度
            this.rotateY = this.controls.getPolarAngle() * (180 / Math.PI) - 90; // 模型角度
            if (this.composer) {
                this.composer.render();
            }
            this.RAF = window.requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        };
        render();
        // setInterval(() => {
        //     this.updateScene()
        // }, 2000);
    }
    // 更新-浏览器窗口变化时，重新渲染场景
    windowResize() {
        window.addEventListener('resize', () => {
            this.updateScene()
        }, false);
    }
    // 更新渲染场景
    updateScene() {
        this.getWH(); // 获取宽高
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    // 后期通道-创建
    // 1、传入空数组为取消高亮。 
    // 2、传入网格数组为高亮模型（通过“getModel”方法获取模型网格数组）
    // 3、参考文档 http://www.webgl3d.cn/threejs/docs/#examples/zh/postprocessing/EffectComposer
    setSelectCube(meshList) {
        // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
        this.composer = new EffectComposer(this.renderer);
        // 新建一个场景通道  为了覆盖到原理来的场景上
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass)

        // 物体边缘发光通道
        this.outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), this.scene, this.camera);
        this.outlinePass.pulsePeriod = 2.5 // 呼吸闪烁的速度
        this.outlinePass.visibleEdgeColor.set(0xffffff) // 呼吸显示的颜色
        // this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
        this.outlinePass.hiddenEdgeColor.set(0x000000);// 呼吸消失的颜色
        this.outlinePass.usePatternTexture = false // 是否使用父级的材质
        this.outlinePass.edgeStrength = 3; // 边框的亮度
        this.outlinePass.edgeGlow = 1 // 光晕[0,1]
        this.outlinePass.edgeThickness = 3 // 边框宽度
        this.outlinePass.selectedObjects = meshList ? meshList : this.selectedObjects;
        this.outlinePass.downSampleRatio = 2 // 边框弯曲度
        this.outlinePass.clear = true;
        this.composer.addPass(this.outlinePass)
        this.effectFXAA = new ShaderPass(FXAAShader)
        this.effectFXAA.uniforms.resolution.value.set(1 / this.width, 1 / this.height)
        this.effectFXAA.renderToScreen = true
    }
    // 获取点击的模型
    // 1、e为鼠标点击的event对象
    // 2、callBack回调返回两个参数（模型的所有网格、原模型）
    getModel(e, callBack) {
        //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        var mouse = new THREE.Vector2()
        mouse.x = (e.offsetX / this.width) * 2 - 1;
        mouse.y = -(e.offsetY / this.height) * 2 + 1;
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length) {
            let model = intersects[0].object.parent.parent.parent; //整体模型
            let meshList = this.selectedObjects.filter((mesh) => {
                return mesh.Marker === intersects[0].object.Marker;
            })
            console.log(meshList, 'chagnjing1')
            if (meshList.length && callBack) {
                callBack(meshList, model); //点击到模型-返回所有网格和原模型
            }
        }
    }
    // 获取模型网格
    getMeshList(model) {
        let arr = []
        model.traverse((mesh) => {
            if (mesh.isMesh) {
                arr.push(mesh)
            }
        })
        return arr;
    }
    // 通过名字获取模型
    getModelByName(name) {
        return this.scene.getObjectByName(name);
    }
    // 模型透明度
    // 1、原模型（通过“getModelByName”，“getModel”方法获取）
    // 2、透明度（0-1）
    setModelOpacity(model, opacity = 1) {
        if (model.type === "Group" || model.type === "Scene") {
            model.traverse((child) => {
                if (child.isMesh) {
                    // 透明度
                    child.material.transparent = true;
                    child.material.opacity = opacity;
                }
            })
        };
    }
    // 材质是否可见
    // 1、child（网格集合）
    // 2、visible（显示隐藏）
    setMaterialVisible(child, visible = true) {
        child.forEach(e => {
            e.visible = visible;
        });
    }
    // 模型距离中心点的偏移位置
    // 1、model（模型）
    // 2、callBack（模型x,y,z偏移位置, 模型的xyz边界值）
    getFitScaleValue(model, callBack) {
        var boxHelper = new THREE.BoxHelper(model);
        boxHelper.geometry.computeBoundingBox();
        // boxHelper.geometry.center()
        var box = boxHelper.geometry.boundingBox;
        // console.log(box)
        let x = - (box.max.x + box.min.x) / 2;
        let y = - (box.max.y + box.min.y) / 2;
        let z = - (box.max.z + box.min.z) / 2;
        if (callBack) {
            callBack(x, y, z, box)
        }
        // var maxDiameter = Math.max(x, y, z);
        // return this.camera.position.z / maxDiameter;
    }
    // 获取场景中所有模型
    getAllModel() {
        let arr = this.scene.children.filter((e) => {
            return (e.type === "Group" || e.type === "Scene")
        })
        console.log(arr, "获取所有模型")
        return arr;
    }
    // 获取模型宽高
    getObjectHalfSize(model) {
        var objectBox = new THREE.Box3();
        objectBox.setFromObject(model);
        return objectBox.max.clone().sub(objectBox.min).divideScalar(2);
    };
    // 获取模型相对于中心的位置
    getModelPosition(model, callBack) {
        let m = this.getObjectHalfSize(model);// 获取模型宽高
        this.getFitScaleValue(model, (x, y, z, box) => {
            let x1 = box.max.x - m.x;
            let y1 = box.max.y - m.y;
            let z1 = box.max.z - m.z;
            callBack(x1, y1, z1, box)
        })
    }
    // 设置模型中心位置
    setModelPosition(model, x = 0, y = 0, z = 0) {
        model.position.set(x, y, z)
    }
    // 获取2D坐标
    get2Dxy(x, y, z) {
        var worldVector = new THREE.Vector3(Number(x), Number(y), Number(z));
        var standardVector = worldVector.project(this.camera);//世界坐标转标准设备坐标
        var a = this.width / 2;
        var b = this.height / 2;
        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
        return {
            x: x,
            y: y
        }
    }
    // 模型xy的旋转角度
    getModelXY() {
        return {
            x: this.rotateX,
            y: this.rotateY,
        }
    }
    // 删除模型
    removerModel(model) {
        model && model.traverse(child => {
            if (child.isMesh) {
                console.log(child)
                child.geometry.dispose();
                child.geometry = null;
                child.material.dispose();
                child.material = null;
            }
        });
        this.scene.remove(model);
        // cancelAnimationFrame(this.RAF)
        // console.log(this.scene, 333333)
    }
    // 添加图标
    adtubidIcon(x = 0, y = 0, z = 0) {
        let texture = new THREE.TextureLoader().load("http://192.168.2.121:8082/%E6%9D%90%E8%B4%A8/a.png");
        // // 创建精灵材质对象SpriteMaterial
        let spriteMaterial = new THREE.SpriteMaterial({
            // color: 0xffffff,//设置精灵矩形区域颜色
            // rotation: Math.PI / 2,//旋转精灵对象45度，弧度值
            map: texture,//设置精灵纹理贴图
            sizeAttenuation: false,
        });
        // 创建精灵模型对象，不需要几何体geometry参数
        var sprite = new THREE.Sprite(spriteMaterial);
        this.scene.add(sprite);
        sprite.center.set(0.5, 0);
        // 控制精灵大小，比如可视化中精灵大小表征数据大小
        sprite.scale.set(0.05, 0.05, 1); // 只需要设置x、y两个分量就可以
        sprite.position.set(x, y, z);
    }

    // addTxt(x, y, z, t) {
    //     let canvas = document.createElement('canvas');
    //     let ctx = canvas.getContext('2d');
    //     ctx.beginPath();
    //     ctx.strokeStyle = '#000';// 设置画笔颜色为红色，即字体颜色
    //     ctx.font = 20 + 'px 宋体';// 设置字体大小
    //     ctx.strokeText(t);// 绘制 "空心" 文字
    //     ctx.closePath();
    //     let texture = new THREE.Texture(canvas)
    //     texture.needsUpdate = true;

    //     let spriteMaterial = new THREE.SpriteMaterial({
    //         map: texture
    //     })
    //     // 创建精灵模型对象，不需要几何体geometry参数
    //     var sprite = new THREE.Sprite(spriteMaterial);
    //     this.scene.add(sprite);
    //     sprite.center.set(0.5, 0);
    //     // 控制精灵大小，比如可视化中精灵大小表征数据大小
    //     sprite.scale.set(0.05, 0.05, 1); // 只需要设置x、y两个分量就可以
    //     sprite.position.set(x, y, z);
    // }
    // 修改视角
    setXYZ(x, y, z, x1 = 0, y1 = 0, z1 = 0) {
        //设置相机坐标
        this.camera.position.set(Number(x), Number(y), Number(z));
        //设置相机朝向
        this.controls.target = new THREE.Vector3(Number(x1), Number(y1), Number(z1))
        this.renderer.render(this.scene, this.camera)
    }
}
export default threeModel;