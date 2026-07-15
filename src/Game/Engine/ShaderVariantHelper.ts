import { ToolUtil } from "../Core/Utils/ToolUtil";
import { GlobalShaderInit } from "../CustomShader/ShaderLibrary/GlobalShaderInit";
import { runCustomShaderCompile } from "../CustomShader/ShaderLibrary/GlobalShaderCompile";
import { ECSTimeUtil } from "./Util/TimeUtil";
import Shader3D = Laya.Shader3D;
import Scene3D = Laya.Scene3D;

export class ShaderVariantHelper {

    public static readonly shaderCompileFolder: string = "resourcesLib/ShaderCompile";
    public static readonly shaderVariantData_1Name: string = "shaderVariantData_1.json";//前15分钟变体
    public static readonly shaderVariantData_particle_1Name: string = "shaderVariantData_particle_1.json";//前15分钟变体
    public static readonly shaderVariantData_tName: string = "shaderVariantData_t.json";//收集所有的变体
    public static readonly shaderVariantData_particle_tName: string = "shaderVariantData_particle_t.json";//收集所有的粒子shader变体
    public static readonly shaderVariantData_sName: string = "shaderVariantData_s.json";//排序后所有的变体

    public static readonly preCompileShaderPrefabName: string = "preCompileShaderPrefab.lh";
    public static readonly shaderVariantData_1Path: string = ShaderVariantHelper.shaderCompileFolder + "/"
        + ShaderVariantHelper.shaderVariantData_1Name;//前15分钟变体路径
    public static readonly shaderVariantData_tPath: string = ShaderVariantHelper.shaderCompileFolder + "/"
        + ShaderVariantHelper.shaderVariantData_tName;//收集所有的变体路径
    public static readonly shaderVariantData_sPath: string = ShaderVariantHelper.shaderCompileFolder + "/"
        + ShaderVariantHelper.shaderVariantData_sName;//排序后所有的变体路径
    public static readonly preCompileShaderPrefabPath: string = ShaderVariantHelper.shaderCompileFolder + "/"
        + ShaderVariantHelper.preCompileShaderPrefabName;

    public static readonly preCompileShaderList = ["SceneEffectCommon", "CurveMap", "ParticleEffectCommon", "SimpleCharacter",
        "SimpleCharacter_Effect", "SimpleCharacter_Cloud", "MeshEffectEntity", "BakeMeshInstance", "SpriteInstance"];

    public static readonly ParticleShaderList = ["ParticleEffectCommon"];

    public static readonly effectShaderPaths: string[] = [
        "resourcesLib/Shader/SceneEffectCommon.shader",
        "resourcesLib/Shader/ParticleEffectCommon.shader",
        "resourcesLib/Shader/CurveMap.shader",
    ];

    private static _effectShaderLoadPromise: Promise<void>;

    /** 预加载特效场景依赖的 Shader 资源，避免材质解析时 shader not found */
    public static ensureEffectShadersLoaded(): Promise<void> {
        if (!this._effectShaderLoadPromise) {
            this._effectShaderLoadPromise = Laya.loader.load(this.effectShaderPaths).then(() => { });
        }
        return this._effectShaderLoadPromise;
    }

    private static _ignorePreCompile: boolean = null;
    public static set ignorePreCompile(bool: boolean) {
        this._ignorePreCompile = bool;
        Laya.LocalStorage.setItem("ShaderVariant_ignorePreCompile", String(this._ignorePreCompile ? 1 : 0));
    }
    public static get ignorePreCompile(): boolean {
        return this._ignorePreCompile;
    }
    private static loadCacheData() {
        let stringIgnorePreCompile = Laya.LocalStorage.getItem("ShaderVariant_ignorePreCompile");
        if (stringIgnorePreCompile) {
            this._ignorePreCompile = parseInt(stringIgnorePreCompile) == 1 ? true : false;
        } else {
            this._ignorePreCompile = false;
        }

        let stringShaderVariant_Shader3DDebug = Laya.LocalStorage.getItem("ShaderVariant_Shader3DDebug");
        if (stringShaderVariant_Shader3DDebug) {
            Shader3D.debugMode = parseInt(stringShaderVariant_Shader3DDebug) == 1 ? true : false;
        }
    }

    private static hasCompileVariantIds: Array<any> = [];
    private static totalVariantData: any;
    private static needIdleCompile: boolean = false;            //是否需要进行空闲编译
    private static isCompileAllOK: boolean = false;            //是否全部Shader编译完成
    private static waitTime = 500;
    private static passTime = 0;
    private static curCompileIndex = 0;

    /**
     * 临时处理，防止：baseRender和shader不匹配导致编译时commonmap有问题
     * 发现有存在shader对应的render组件不同，所以需要静态数据向上兼容 e.g. 11000003_1 && 91000001
     * 引擎版本变化可能导致这里配置需要变化,详见：BaseRender._getcommonUniformMap()
     */
    public static readonly preCompileShaderRenderMap: Map<string, Array<string>> = new Map<string, string[]>();
    static {
        let SimpleSkinnedMeshRenderer: Array<string> = new Array<string>("Sprite3D", "SimpleSkinnedMesh");
        let TrailRenderer: Array<string> = new Array<string>("Sprite3D", "TrailRender");
        let ShurikenParticleRenderer: Array<string> = new Array<string>("Sprite3D", "ShurikenSprite3D");
        let BaseRender: Array<string> = new Array<string>("Sprite3D");
        this.preCompileShaderRenderMap.set("SimpleCharacter_Cloud", SimpleSkinnedMeshRenderer);
        this.preCompileShaderRenderMap.set("SimpleCharacter", SimpleSkinnedMeshRenderer);
        this.preCompileShaderRenderMap.set("SimpleCharacter_Effect", SimpleSkinnedMeshRenderer);
        this.preCompileShaderRenderMap.set("SceneEffectCommon", BaseRender);
        this.preCompileShaderRenderMap.set("CurveMap", BaseRender);
        this.preCompileShaderRenderMap.set("ParticleEffectCommon", ShurikenParticleRenderer);
        this.preCompileShaderRenderMap.set("PARTICLESHURIKEN", ShurikenParticleRenderer);
        this.preCompileShaderRenderMap.set("MeshEffectEntity", BaseRender);
        this.preCompileShaderRenderMap.set("BakeMeshInstance", BaseRender);
        this.preCompileShaderRenderMap.set("SpriteInstance", BaseRender);
    }

    public static shaderVariant: any;

    private static initCustomShaders(): void {
        GlobalShaderInit.Init();
        runCustomShaderCompile();
    }

    public static preCompileAllShaderVariant(scene3d: Scene3D): void {

        if (!scene3d) {
            return;
        }
        if (this.ignorePreCompile) {
            this.ensureEffectShadersLoaded().then(() => this.initCustomShaders());
            return;
        }
        this.initCustomShaders();
        //查看编译信息
        this.loadCacheData();
        //Shader3D.debugMode = true;
        //屏蔽shader编译报错
        Laya.loader.load(ShaderVariantHelper.preCompileShaderPrefabPath).then((res) => {
            const prefab = res.create();
            const addPrefab = scene3d.addChild(prefab) as Laya.Sprite3D;
            GlobalShaderInit.InitShaderPassStates(); //Temp
            //启动加载的Shader变体
            Laya.loader.load(ShaderVariantHelper.shaderCompileFolder + "/" + ShaderVariantHelper.shaderVariantData_particle_tName).then((res: Laya.TextResource) => {
                if (res) {
                    ShaderVariantHelper.shaderVariant = res.data;
                    ShaderVariantHelper.beginCompile();
                }
                addPrefab?.destroy();
            });

            //启动加载的Shader变体
            // ResManager.inst.load(ShaderVariantHelper.shaderVariantData_tPath).then((res: Laya.TextResource) => {
            //     this.totalVariantData = res.data;
            //     // this.StartLoadingCompile();
            //     addPrefab?.destroy();
            //     ResManager.inst.ignoreCacheTimeCycle(ShaderVariantHelper.preCompileShaderPrefabPath);
            // });
        });
    }

    private static CompileSingleVariant() {
        if (ToolUtil.inWeChatPC || null == this.totalVariantData) {
            return;
        }
        let datum = this.totalVariantData[this.curCompileIndex];
        if (this.hasCompileVariantIds.indexOf(datum.id) !== -1 || !this.checkVariantDatum(datum)) {
            this.curCompileIndex++;
            this.CompileSingleVariant();
            return;
        }
        this.curCompileIndex++;
        let s: any;
        if (Shader3D.debugMode) {
            s = Date.now();
        }
        Shader3D.compileShaderByDefineNames(datum.shaderName, datum.subShaderIndex, datum.passIndex, datum.defineNames, this.preCompileShaderRenderMap.get(datum.shaderName));
        if (Shader3D.debugMode) {
            console.log(datum.shaderName + "编译时间：" + (Date.now() - s))
        }
        this.hasCompileVariantIds.push(datum.id);
        if (this.curCompileIndex == this.totalVariantData.length) {
            this.needIdleCompile = false
            this.isCompileAllOK = true
            if (Shader3D.debugMode) {
                console.log("Shader全部编译完成!" + this.curCompileIndex);
            }
        }
    }

    public static beginCompile() {
        // if (ShaderVariantHelper.shaderVariant) {
        //     this.CompileShaderVariantDataAsync(ShaderVariantHelper.shaderVariant, 10);
        // }
    }

    private static async CompileShaderVariantDataAsync(variantData: any, frameCompileNum: number) {
        if (ToolUtil.inWeChatPC) {
            return;
        }
        let index = 0;
        let b: number = 0;
        for (let datum of variantData) {
            //中途取消
            if (this.isCompileAllOK) {
                if (Shader3D.debugMode) {
                    console.log("一阶段编译变体数:" + index);
                }
                return
            }
            if (!this.checkVariantDatum(datum))
                continue;
            let s
            if (Shader3D.debugMode) {
                s = Date.now();
            }
            Shader3D.compileShaderByDefineNames(datum.shaderName, datum.subShaderIndex, datum.passIndex, datum.defineNames, this.preCompileShaderRenderMap.get(datum.shaderName));
            this.hasCompileVariantIds.push(datum.id);
            if (Shader3D.debugMode) {
                const e = Date.now() - s;
                b += e;
                console.log("编译时间:" + e);
            }
            await ECSTimeUtil.waitAsync(300);
            index++;
        }
        if (Shader3D.debugMode) {
            console.log("一阶段编译变体数:" + index + " 总时间：" + (b));
        }
        this.isCompileAllOK = true;
        //添加判断是否Loading中
        this.StartLoadingCompile();
        ShaderVariantHelper.shaderVariant = null;
    }

    /**
     * only use for debug 
     * @param variantData 
     */
    private static CompileShaderVariantData(variantData: any) {

        let index = 0;
        for (let datum of variantData) {
            if (!this.checkVariantDatum(datum))
                continue;
            let s
            if (Shader3D.debugMode) {
                s = Date.now();
            }
            Shader3D.compileShaderByDefineNames(datum.shaderName, datum.subShaderIndex,
                datum.passIndex, datum.defineNames, this.preCompileShaderRenderMap.get(datum.shaderName));
            this.hasCompileVariantIds.push(datum.id);
            index++;
            if (Shader3D.debugMode) {
                console.log("编译时间:" + (Date.now() - s));
            }
        }
        if (Shader3D.debugMode) {
            console.log("一阶段编译变体数:" + index);
        }
    }

    // 开启Loading编译
    public static StartLoadingCompile(time: number = 20) {
        this.waitTime = time;
        if (ToolUtil.miniIOS) {
            this.waitTime = this.waitTime / 5;
        }
        //PC微信环境不编译
        if (ToolUtil.inWeChatPC || this.isCompileAllOK) {
            return;
        }
        if (!this.needIdleCompile) {
            if (Shader3D.debugMode) {
                console.log("开启Loading编译")
            }
            this.needIdleCompile = true
        }
    }

    // 暂停Loading编译
    public static StopLoadingCompile() {
        //PC微信环境不编译
        if (ToolUtil.inWeChatPC || this.isCompileAllOK) {
            return;
        }
        if (this.needIdleCompile) {
            if (Shader3D.debugMode) {
                console.log("暂停Loading编译")
            }
            this.needIdleCompile = false
        }
    }

    private static checkVariantDatum(datum: any): boolean {
        let pass = true;
        if (ShaderVariantHelper.ParticleShaderList.indexOf(datum.shaderName) == -1 && datum.defineNames.indexOf("UV") == -1) {
            if (Shader3D.debugMode) {
                console.log(datum.shaderName + " has wrong setting!!");
            }
            pass = false;
        }
        return pass;
    }

    public static onUpdate(dt: number): void {
        // 空闲编译
        // if (this.needIdleCompile) {
        //     if (dt < ToolUtil.shader_var) {
        //         this.passTime += 1;
        //         if (this.passTime > this.waitTime) {
        //             this.passTime = -60;
        //             this.CompileSingleVariant();
        //             this.passTime = 0;
        //         }
        //     } else {
        //         this.passTime = 0;
        //     }
        // }
    }

    public static getVariantId(shaderVariant: Laya.ShaderVariant): string {
        let id: string = shaderVariant.shader.name + shaderVariant.subShaderIndex + shaderVariant.passIndex;
        for (let defineName of shaderVariant.defineNames) {
            id += defineName;
        }
        return id;
    }
}