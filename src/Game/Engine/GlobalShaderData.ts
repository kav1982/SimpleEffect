import Camera = Laya.Camera;
import Sprite3D = Laya.Sprite3D;
import Scene3D = Laya.Scene3D;
import ShaderData = Laya.ShaderData;

import { GlobalShaderInit } from "../CustomShader/ShaderLibrary/GlobalShaderInit";
import { CurveWorldSetting } from "./GlobalShaderSettings/CurveWorldSetting";
import { ZHFogSetting } from "./GlobalShaderSettings/ZHFogSetting";
import { PlaneShadowSetting } from "./GlobalShaderSettings/PlaneShadowSetting";
import Color = Laya.Color;
import Vector3 = Laya.Vector3;
import { ShaderVariantHelper } from "./ShaderVariantHelper";
import { MeshEffectInstanceMgr } from "./CommandBufferDrawMgr/MeshEffectInstanceMgr";
import { BGCtrlSetting } from "./GlobalShaderSettings/BGCtrlSetting";
import { SceneTintSetting } from "./GlobalShaderSettings/SceneTintSetting";
//import { SoftParticleSetting } from "./GlobalShaderSettings/SoftParticleSetting";

const { regClass, property } = Laya;

/**
 * 全局Shader控制类，挂在Camera上
 */
@regClass()
export class GlobalShaderData extends Laya.Script {

    //public camera:Camera;

    @property({ type: Boolean, tips: "每帧刷新参数,用于美术调试,默认请关闭" })
    public AutoFresh: boolean = false;

    @property(CurveWorldSetting)
    public curveWorldSetting: CurveWorldSetting = new CurveWorldSetting();

    @property(ZHFogSetting)
    public zhFogSetting: ZHFogSetting = new ZHFogSetting();

    @property(PlaneShadowSetting)
    public planeShadowSetting: PlaneShadowSetting = new PlaneShadowSetting();

    @property(BGCtrlSetting)
    public bgCtrlSetting: BGCtrlSetting = new BGCtrlSetting();

    @property(SceneTintSetting)
    public sceneTintSetting: SceneTintSetting = new SceneTintSetting();

    // @property(SoftParticleSetting)
    // public softParticleSetting: SoftParticleSetting = new SoftParticleSetting();

    private static instance: GlobalShaderData;

    private _camera: Camera;

    public get camera() {
        return this._camera;
    }

    public setCamera(camera: Camera) {
        this._camera = camera;
        this._hasInit = GlobalShaderData.instance == this;
        this.curveWorldSetting.SetCamTransform(this._camera.transform);
    }

    //Mgr
    private meshEffectInstanceMgr: MeshEffectInstanceMgr;

    private _shaderValues: ShaderData;

    private _hasInit: boolean;
    private _lastPlane = 0;
    private _lastBlendSize = 0;
    private _lastBlendOffset = 0;
    private _lastDitherClipStart = 0;
    private _lastDitherClipEnd = 0;

    /**
     * 获取单例
     */
    public static getInstance(): GlobalShaderData {
        return this.instance;
    }

    static setInstance(globalShaderData: GlobalShaderData, NeedInit: boolean = true) {
        this.instance = globalShaderData;
        if (NeedInit)
            this.instance.Init();
    }

    private Init() {
        if (GlobalShaderData.getInstance() != null && GlobalShaderData.getInstance() !== this) {
            console.log("GlobalShaderData has an Instance!");
            return;
        }
        GlobalShaderData.setInstance(this, false);
        GlobalShaderInit.Init();
        // this.self = this.owner as Sprite3D;
        //this.camera = this.owner as Camera;

        //this._hasInit = this.camera != undefined && GlobalShaderData.instance == this;

        this.curveWorldSetting.Register();
        this.zhFogSetting.Register();
        this.planeShadowSetting.Register();
        this.sceneTintSetting.Register();
        //this.softParticleSetting.Register();
        //this.curveWorldSetting.SetCamTransform(this.camera.transform);

        if (!this.meshEffectInstanceMgr)
            this.meshEffectInstanceMgr = new MeshEffectInstanceMgr();

        ShaderVariantHelper.preCompileAllShaderVariant(this.owner.scene as Scene3D);
        // if(this._hasInit)
        //     console.log("GlobalShaderData Init");
    }

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        this.Init();
        this.RefreshShaderData();
    }

    onUpdate() {
        if (!this._hasInit || !this.AutoFresh)
            return;

        this.RefreshShaderData();
    }

    onLateUpdate() {
        if (!this._hasInit)
            return;
        this.meshEffectInstanceMgr.mgrLateUpdate();
    }


    RefreshByCamMove(): void {
        if (!this._hasInit)
            return;
        this.curveWorldSetting.GetIntersectPosByCamRay();
        this.curveWorldSetting.RefreshTarget();

        // 视椎体剔除（效果不明显，且消耗过高）
        //BakeMeshInstanceMgr.Instance?.frustumCulling();
    }


    RefreshShaderData(): void {
        if (!this._hasInit)
            return;

        this.curveWorldSetting.RefreshData();
        this.zhFogSetting.RefreshData();
        this.planeShadowSetting.RefreshData();
        this.sceneTintSetting.RefreshData();
        //this.softParticleSetting.RefreshData();
    }

    SetCurveWorldData(plane: number, bS: number, bO: number, DCS: number, DCE: number) {
        this._lastPlane = this.curveWorldSetting.Plane = plane;
        this._lastBlendSize = this.curveWorldSetting.BlendSize = bS;
        this._lastBlendOffset = this.curveWorldSetting.BlendOffset = bO;
        this._lastDitherClipStart = this.curveWorldSetting.DitherClipStart = DCS;
        this._lastDitherClipEnd = this.curveWorldSetting.DitherClipEnd = DCE;
        this.RefreshShaderData();
    }

    CameraMoveCurve() {
        this.curveWorldSetting.Plane = 0;
        this.curveWorldSetting.BlendSize = 0;
        this.curveWorldSetting.BlendOffset = 0;
        this.curveWorldSetting.DitherClipStart = 0;
        this.curveWorldSetting.DitherClipEnd = 0;
        this.RefreshShaderData();
    }

    RestoreCurve() {
        this.SetCurveWorldData(this._lastPlane, this._lastBlendSize, this._lastBlendOffset, this._lastDitherClipStart, this._lastDitherClipEnd);
    }

    SetZHFogData(ZS: number, ZE: number, ZCol: Color, HS: number, HE: number) {
        this.zhFogSetting.ZFogStart = ZS;
        this.zhFogSetting.ZFogEnd = ZE;
        this.zhFogSetting.ZHFogColor = ZCol;
        this.zhFogSetting.HFogStart = HS;
        this.zhFogSetting.HFogEnd = HE;
    }

    SetPlaneShadowData(dir: Vector3, plCol: Color, plane: number) {
        this.planeShadowSetting.PlaneShadowLightDir = dir;
        this.planeShadowSetting.PlaneShadowColor = plCol;
        this.planeShadowSetting.PlaneShadowPlane = plane;
    }

    SetSceneTintData(color: Color, intensity: number, desaturate: number = 0) {
        this.sceneTintSetting.SetSceneTint(color, intensity, desaturate);
    }

    GetSceneTintColor(): Color {
        return this.sceneTintSetting.GetSceneTintColor();
    }

    SetBGCtrlData(yFactor: number, zFactor: number, zStart: number) {

        if (yFactor !== null && yFactor !== undefined) {
            this.bgCtrlSetting.yFactor = yFactor;
        }
        if (zFactor !== null && zFactor !== undefined) {
            this.bgCtrlSetting.zFactor = zFactor;
        }
        if (zStart !== null && zStart !== undefined) {
            this.bgCtrlSetting.zStart = zStart;
        }
    }

    clearRenderSource() {
    }

    onDestroy() {
        if (!this._hasInit)
            return;
    }
}