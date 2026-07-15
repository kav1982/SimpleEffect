import Material = Laya.Material;
import VertexMesh = Laya.VertexMesh;
import ShaderDataType = Laya.ShaderDataType;
import Shader3D = Laya.Shader3D;
import SubShader = Laya.SubShader;
import RenderState = Laya.RenderState;

import { CustomMaterial } from "../CustomMaterial";
import { RenderHelper } from "../../Engine/RenderHelper";
import { GlobalShaderInit } from "../ShaderLibrary/GlobalShaderInit";

import TrailCommonMaterialVS from "../InstanceShader/TrailCommonMaterialVS.vs";
import TrailCommonMaterialFS from "../InstanceShader/TrailCommonMaterialFS.fs";
import Color = Laya.Color;
import Vector4 = Laya.Vector4;

export class TrailCommonMaterial extends CustomMaterial {

    public static readonly ShaderName = "TrailCommon";

    LoadShader() {

        TrailCommonMaterial.InitShader();
        this.setShaderName(TrailCommonMaterial.ShaderName);
    }

    public static InitShader() {
        if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
            return;
        }
        let attributeMap: any = {
            'a_Position': [0, ShaderDataType.Vector4],
            'a_OffsetVector': [1, ShaderDataType.Vector3],
            'a_Texcoord0X': [4, ShaderDataType.Float],
            'a_Texcoord0Y': [3, ShaderDataType.Float],
            'a_BirthTime': [2, ShaderDataType.Float],
            'a_Color': [5, ShaderDataType.Vector4],
        };

        let uniformMap: any = {
            "u_TilingOffset": ShaderDataType.Vector4,
            "u_MainTexture": ShaderDataType.Texture2D,
            "u_MaskMap": ShaderDataType.Texture2D,
            "u_MainColor": ShaderDataType.Color,
            "u_UVAnim": ShaderDataType.Vector2,
        };
        let defaultValue = {
            "u_MainColor": Color.WHITE,
            "u_TilingOffset": new Vector4(1, 1, 0, 0),
        };

        let shader: Shader3D = Shader3D.add(this.ShaderName, false, false);
        let subShader: SubShader = new SubShader(attributeMap, uniformMap, defaultValue);
        shader.addSubShader(subShader);
        subShader.addShaderPass(TrailCommonMaterialVS, TrailCommonMaterialFS);

        // console.log("[CustomMaterial]: InitShader:" + this.ShaderName);
        CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }

    constructor(isAdditive: boolean) {
        super();
        this.renderModeSet(isAdditive);
    }

    //渲染模式
    renderModeSet(isAdditive: boolean) {
        this.cull = RenderState.CULL_NONE;
        this.alphaTest = false;
        this.depthWrite = false;
        this.renderQueue = Material.RENDERQUEUE_TRANSPARENT;
        this.blend = RenderState.BLEND_ENABLE_ALL;
        this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
        this.blendDst = isAdditive ? RenderState.BLENDPARAM_ONE : RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;

        //this.addDefine(GlobalShaderInit.CurveWorldDefine);
        this.addDefine(GlobalShaderInit.ZHFogDefine);

        //RenderHelper.SetDefaultBlockMat(this);
    }
}