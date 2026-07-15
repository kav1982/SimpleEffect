// 保证打包顺序：CustomMaterial 必须在各 *Material 子类之前完成定义
import "../CustomMaterial";
import { RenderHelper } from '../../Engine/RenderHelper';
import CustomShaderFunctionSupport from "../ShaderLibrary/CustomShaderFunctionSupport.glsl";
import EffectInstanceMap from "../ShaderLibrary/EffectInstanceMap.glsl";
import PostProcessSupport from "../ShaderLibrary/PostProcessSupport.glsl";

import Shader3D = Laya.Shader3D;
import LayaGL = Laya.LayaGL;
import Scene3D = Laya.Scene3D;
import CommandUniformMap = Laya.CommandUniformMap;
import ShaderDataType = Laya.ShaderDataType;




/**
 * 自定义Shade库初始化
 */
export class GlobalShaderInit {

    private static hasInit: boolean;

    static Init() {
        if (this.hasInit)
            return;
        this.hasInit = true;
        this.loadLocalCache();

        this.AddInclude();

        this.InitDefine();

        this.InitUniformMap();

        //this.InitShaderPassStates();

        // console.log("GlobalShaderInit Init");
    }

    static AddInclude() {
        Shader3D.addInclude("PostProcessSupport.glsl", PostProcessSupport);
        Shader3D.addInclude("CustomShaderFunctionSupport.glsl", CustomShaderFunctionSupport);
        Shader3D.addInclude("EffectInstanceMap.glsl", EffectInstanceMap);
    }
    static rt_w: number = 1200;

    //Common
    static readonly CharacterRef = 6;
    static readonly PlaneShadowRef = 5;
    static readonly XRayRef = 1;

    //Defines
    static GaussianBlur: any;
    static PlaneShadowDefine: any;
    //static CurveWorldDefine;
    static ZHFogDefine: any;
    static DitherClipDefine: any;
    static EnableMask: any;
    static AdditiveFog: any;
    static InitDefine() {
        this.GaussianBlur = Shader3D.getDefineByName("GAUSSIAN_BLUR");
        this.PlaneShadowDefine = Shader3D.getDefineByName("PLANE_SHADOW");
        //this.CurveWorldDefine = Shader3D.getDefineByName("CURVE_WORLD");
        this.ZHFogDefine = Shader3D.getDefineByName("ZHFOG");
        //this.DitherClipDefine = Shader3D.getDefineByName("DITHER_CLIP");
        this.EnableMask = Shader3D.getDefineByName("ENABLE_MASK");
        this.AdditiveFog = Shader3D.getDefineByName("ADDITIVEFOG");
    }

    //ShaderUniformMap
    static sceneUniformMap: CommandUniformMap;
    static readonly SCENE_NAME: string = "Scene3D";
    static InitUniformMap() {
        this.sceneUniformMap = Scene3D.sceneUniformMap = LayaGL.renderOBJCreate.createGlobalUniformMap(this.SCENE_NAME);
    }

    static registerShaderUniform(uniformName: string, shaderDataType: ShaderDataType) {
        if (this.sceneUniformMap == null) {
            console.log("Try to register: [" + uniformName + "] but GlobalShaderInit has not Init!");
            return;
        }
        (this.sceneUniformMap as any).addShaderUniform(Shader3D.propertyNameToID(uniformName), uniformName, shaderDataType);
    }

    private static scene: Scene3D;
    private static InitScene(): boolean {
        if (this.scene == null) {
            this.scene = Laya.stage.getChildByName(this.SCENE_NAME) as Scene3D;
        }

        return (this.scene != null);
    }

    static getScene(): Scene3D {
        this.InitScene();
        return this.scene;
    }

    static SetGlobalShaderValue(uniformName: string, shaderDataType: ShaderDataType, value: any) {
        if (!this.InitScene())
            return;
        this.scene.setGlobalShaderValue(uniformName, shaderDataType, value);
    }

    static InitShaderPassStates() {

        GlobalShaderInit.setPostProcessShaderPassState();
        //GlobalShaderInit.setMultiplyPassOutlineEnable();
    }

    /**
     * 目前后处理只有深度描边，所以这边其实是控制深度写入的pass
     */
    public static setPostProcessShaderPassState() {
        if (Laya.Browser.onTTMiniGame || Laya.Browser.onAlipayMiniGame) {
            return
        }
        const simpleCharacter_UI: Shader3D = Shader3D.find("SimpleCharacter_UI");
        if (simpleCharacter_UI) {
            RenderHelper.setShaderPassEnable(simpleCharacter_UI, 0, 1, GlobalShaderInit.postProcessEnable);
        }

        const simpleCharacter: Shader3D = Shader3D.find("SimpleCharacter");
        if (simpleCharacter) {
            RenderHelper.setShaderPassEnable(simpleCharacter, 0, 2, GlobalShaderInit.postProcessEnable);
        }
    }


    public static shadowActive = true;
    //影子都从CoreMapCtrl
    static setShadowActive(active?: boolean) {
        if (active == this.shadowActive) {
            return;
        }
        if (active !== null && active !== undefined) {
            this.shadowActive = active;
        } else {
            this.shadowActive = !this.shadowActive;
        }
        //const simpleCharacter_Instance: Shader3D = Shader3D.find("SimpleCharacter_Instance");
        const simpleCharacter: Shader3D = Shader3D.find("SimpleCharacter");
        const simpleCharacter_Cloud: Shader3D = Shader3D.find("SimpleCharacter_Cloud");
        const planeShadowMask: Shader3D = Shader3D.find("PlaneShadowMask");

        //RenderHelper.setShaderPassEnable(simpleCharacter_Instance, 0, 1, this.shadowActive)
        RenderHelper.setShaderPassEnable(simpleCharacter, 0, 1, this.shadowActive);
        RenderHelper.setShaderPassEnable(planeShadowMask, 0, 0, this.shadowActive);
        RenderHelper.setShaderPassEnable(simpleCharacter_Cloud, 0, 1, this.shadowActive);
    }

    //#region 多pass描边shader pass开关本地缓存
    // public static multiplyPassOutline = false;


    // public static setMultiplyPassOutline(active?: boolean) {
    //     if (active === this.multiplyPassOutline) {
    //         return;
    //     }
    //     if (active !== null && active !== undefined) {
    //         this.multiplyPassOutline = active;
    //     } else {
    //         this.multiplyPassOutline = !this.multiplyPassOutline;
    //     }
    //     Laya.LocalStorage.setItem("GlobalShaderInit_multiplyPassOutline", String(GlobalShaderInit.multiplyPassOutline ? 1 : 0));
    //     this.setMultiplyPassOutlineEnable();
    // }
    // public static setMultiplyPassOutlineEnable() {
    //     const simpleCharacter_Instance: Shader3D = Shader3D.find("SimpleCharacter_Instance");
    //     const simpleCharacter: Shader3D = Shader3D.find("SimpleCharacter");
    //     //const simpleCharacter_UI: Shader3D = Shader3D.find("SimpleCharacter_UI");

    //     RenderHelper.setShaderPassEnable(simpleCharacter_Instance, 0, 0, this.multiplyPassOutline)
    //     RenderHelper.setShaderPassEnable(simpleCharacter, 0, 0, this.multiplyPassOutline);
    //     //RenderHelper.setShaderPassEnable(simpleCharacter_UI, 0, 0, this.multiplyPassOutline);
    // }

    //#endregion

    //#region 相机设置
    private static _postProcessEnable: boolean = false;
    public static set postProcessEnable(bool: boolean) {
        //todo 这里会卡顿 估计是后处理要同步创建3张RT出来
        GlobalShaderInit._postProcessEnable = bool;
        GlobalShaderInit.setPostProcessShaderPassState();
        GlobalShaderInit.renderCameras.forEach((value: cameraRenderInfo) => {
            GlobalShaderInit.setCameraPostProcess(value);
        });
        RenderHelper.forceCleanRenderTexturePool();
    }

    public static get postProcessEnable(): boolean {
        return GlobalShaderInit._postProcessEnable;
    }

    private static setCameraPostProcess(renderInfo: cameraRenderInfo) {
        let camera = renderInfo.camera;
        let isUI = renderInfo.isUI;
        let rt = renderInfo.img;
        if (!camera) {
            return;
        }
        if (Laya.Browser.onTTMiniGame) {
            return
        }
        if (Laya.Browser.onAlipayMiniGame) {
            // 2025.7.28 修复ios gamma正确采样
            // if (wx.getSystemInfoSync().platform == "iOS") {
            //     let postprocess = new Laya.PostProcess();
            //     let gamma = new GammaCorrection();
            //     postprocess.addEffect(gamma);
            //     camera.postProcess = postprocess;
            // } else {
            if (camera.postProcess) {
                camera.postProcess.clearEffect();
                camera.postProcess = null;
            }
            //}
        } else {
            // EffectShow 仅需全屏染色（GlobalShaderData），不需要深度描边后处理
            if (GlobalShaderInit.postProcessEnable) {
                camera.depthTextureMode = Laya.DepthTextureMode.Depth;
            } else if (camera.postProcess) {
                camera.postProcess.clearEffect();
                camera.postProcess = null;
            }
        }
    }

    private static _msaa: boolean = false;
    public static set msaa(bool: boolean) {
        // msaa暂时没用到，不用重新生成rt
        // GlobalShaderInit._msaa = bool;
        // GlobalShaderInit.renderCameras.forEach((renderInfo: cameraRenderInfo) => {
        //     GlobalShaderInit.setCameraMSAA(renderInfo);
        // });
        // RenderHelper.forceCleanRenderTexturePool();
    }

    public static get msaa(): boolean {
        return GlobalShaderInit._msaa;
    }

    private static _fxaa: boolean = false;
    public static get fxaa(): boolean {
        return GlobalShaderInit._fxaa;
    }

    public static set fxaa(bool: boolean) {
        GlobalShaderInit._fxaa = bool;
        Laya.LocalStorage.setItem("GlobalShaderInit_fxaa", String(this._fxaa ? 1 : 0));

        GlobalShaderInit.renderCameras.forEach((renderInfo: cameraRenderInfo) => {
            GlobalShaderInit.setCameraFXAA(renderInfo);
        });
    }

    private static setCameraFXAA(cameraRenderInfo: cameraRenderInfo) {
        let camera = cameraRenderInfo.camera
        if (camera) {
            camera.fxaa = GlobalShaderInit._fxaa;
        }
    }

    private static setCameraMSAA(cameraRenderInfo: cameraRenderInfo) {
        let camera = cameraRenderInfo.camera
        if (camera == null) {
            console.error("Globalshaderinit setCameraMSAA 相机已经被销毁");
            return;
        }

        camera.msaa = GlobalShaderInit._msaa;
        if (cameraRenderInfo.img && camera.renderTarget) {
            if (cameraRenderInfo.img._graphics == null) {
                console.error("Globalshaderinit setCameraMSAA rt创建失败, 相机渲染模板图片已经被销毁");
                return;
            }

            try {
                let rt = GlobalShaderInit.createCameraOffScreenRT(camera, cameraRenderInfo.img);
                if (rt == null) {
                    //这里不太可能发生，底层创建失败应该直接抛异常了
                    console.error("Globalshaderinit setCameraMSAA rt创建失败");
                    return;
                }
                camera.renderTarget.destroy();
                camera.renderTarget = rt;
            } catch (error) {
                console.error("Globalshaderinit setCameraMSAA rt创建失败", error);
                return;
            }
        }
    }

    //#endregion
    public static loadLocalCache() {

        let fxaaEnable = Laya.LocalStorage.getItem("GlobalShaderInit_fxaa");
        if (fxaaEnable !== null && fxaaEnable !== undefined) {
            GlobalShaderInit._fxaa = parseInt(fxaaEnable) == 1 ? true : false;
        }

        // let mulPassOutline = Laya.LocalStorage.getItem("GlobalShaderInit_multiplyPassOutline");
        // if (mulPassOutline !== null && mulPassOutline !== undefined) {
        //     GlobalShaderInit.multiplyPassOutline = parseInt(mulPassOutline) == 1 ? true : false;
        // }
    }

    private static createCameraOffScreenRT(camera: Laya.Camera, img: Laya.Image): Laya.RenderTexture {
        //console.error("创建RT:" + camera.name);
        // let rt = Laya.RenderTexture.createFromPool(camera.viewport.width, camera.viewport.height, (<any>camera)._getRenderTextureFormat(), camera.depthTextureFormat, false, camera.msaa ? 4 : 1, false, camera._needRenderGamma((<any>camera)._getRenderTextureFormat()));
        let rt: any;// = new Laya.RenderTexture(1.5 * camera.viewport.width, 1.5 * camera.viewport.height, (<any>camera)._getRenderTextureFormat(), camera.depthTextureFormat, false, 1, false, camera._needRenderGamma((<any>camera)._getRenderTextureFormat()));
        if (img) {
            rt = Laya.RenderTexture.createFromPool(this.rt_w, this.rt_w, (<any>camera)._getRenderTextureFormat(), camera.depthTextureFormat, false, camera.msaa ? 4 : 1, false, camera._needRenderGamma((<any>camera)._getRenderTextureFormat()));;
            img.texture = new Laya.Texture(rt);
        } else {
            rt = new Laya.RenderTexture(camera.viewport.width, camera.viewport.height, (<any>camera)._getRenderTextureFormat(), camera.depthTextureFormat, false, 1, false, camera._needRenderGamma((<any>camera)._getRenderTextureFormat()));
        }
        rt.lock = true;
        RenderHelper.setRenderTextureParam(rt, true, false);
        return rt;
    }

    private static renderCameras: Map<number, cameraRenderInfo> = new Map<number, cameraRenderInfo>();

    /**
     * 
     * @param camera 
     * @param isUI 
     * @param img 传了img代表离屏渲染需要rt
     */
    public static registerRenderCamera(camera: Laya.Camera, isUI: boolean = false, img: Laya.Image = null) {
        let cameraInfo = {
            camera: camera,
            isUI: isUI,
            img: img
        } as cameraRenderInfo;

        GlobalShaderInit.renderCameras.set(camera.id, cameraInfo);

        camera.depthTextureFormat = Laya.RenderTargetFormat.DEPTHSTENCIL_24_8;
        // if (isUI && img != null) {
        //     GlobalShaderInit._msaa = true;
        // } else {
        //     GlobalShaderInit._msaa = false;
        // }
        this.setCameraMSAA(cameraInfo);
        this.setCameraFXAA(cameraInfo);
        this.setCameraPostProcess(cameraInfo);

        if (img) {
            camera.renderTarget = GlobalShaderInit.createCameraOffScreenRT(camera, img);
        }
    }

    public static unregisterRenderCamera(camera: Laya.Camera) {
        if (camera != null) {
            GlobalShaderInit.renderCameras.delete(camera.id)
        }
    }
}

interface cameraRenderInfo {
    camera: Laya.Camera;
    isUI: boolean;
    img: Laya.Image;// 依赖的UIModel的Image; 离屏渲染
}