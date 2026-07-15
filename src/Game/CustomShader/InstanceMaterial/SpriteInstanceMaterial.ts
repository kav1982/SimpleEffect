import SpriteInstanceVS from "../InstanceShader/SpriteInstanceVS.vs";
import SpriteInstanceFS from "../InstanceShader/SpriteInstanceFS.fs";

import Material = Laya.Material;
import VertexMesh = Laya.VertexMesh;
import ShaderDataType = Laya.ShaderDataType;
import Shader3D = Laya.Shader3D;
import SubShader = Laya.SubShader;
import RenderState = Laya.RenderState;
import Color = Laya.Color;
import Vector4 = Laya.Vector4;

import { CustomMaterial } from "../CustomMaterial";
import { RenderHelper } from "../../Engine/RenderHelper";
import { GlobalShaderInit } from "../ShaderLibrary/GlobalShaderInit";

export class SpriteInstanceMaterial extends CustomMaterial {

    public static readonly ShaderName = "SpriteInstance";
    private static readonly SceneTintColorName: string = "u_SceneTintColor";
    private static readonly SceneTintParamsName: string = "u_SceneTintParams";
    private static readonly SceneTintColor: Color = new Color(0.05, 0.15, 0.45, 1);
    private static readonly SceneTintParams: Vector4 = new Vector4();
    private static readonly sceneTintMaterials: Set<SpriteInstanceMaterial> = new Set<SpriteInstanceMaterial>();

    LoadShader() {

        SpriteInstanceMaterial.InitShader();
        this.setShaderName(SpriteInstanceMaterial.ShaderName);
    }

    public static InitShader() {
        if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
            return;
        }

        let attributeMap: any = {
            'a_Position': [VertexMesh.MESH_POSITION0, ShaderDataType.Vector4],
            'a_Texcoord0': [VertexMesh.MESH_TEXTURECOORDINATE0, ShaderDataType.Vector2],
            'a_WorldMat': [VertexMesh.MESH_WORLDMATRIX_ROW0, ShaderDataType.Matrix4x4],
            'a_SpriteUVRect': [VertexMesh.MESH_CUSTOME0, ShaderDataType.Vector4],
            //'a_Color': [VertexMesh.MESH_CUSTOME1, ShaderDataType.Vector4],
            'a_WindDirection': [VertexMesh.MESH_CUSTOME1, ShaderDataType.Vector4],
            'a_WindParam': [VertexMesh.MESH_CUSTOME2, ShaderDataType.Vector3],
        };

        let uniformMap: any = {
            'u_AtlasTexture': ShaderDataType.Texture2D,
            'u_AlphaCutOff': ShaderDataType.Float,
            [SpriteInstanceMaterial.SceneTintColorName]: ShaderDataType.Color,
            [SpriteInstanceMaterial.SceneTintParamsName]: ShaderDataType.Vector4,
        };
        let shader: Shader3D = Shader3D.add("SpriteInstance", false, false);
        let subShader: SubShader = new SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(SpriteInstanceVS, SpriteInstanceFS);

        // console.log("[CustomMaterial]: InitShader:" + this.ShaderName);
        CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }

    constructor(transparent: boolean = false) {
        super();
        this.renderModeSet(transparent);
        SpriteInstanceMaterial.sceneTintMaterials.add(this);
        this.RefreshSceneTintData();
    }

    public static SetSceneTintData(color: Color, params: Vector4): void {
        if (color) {
            SpriteInstanceMaterial.SceneTintColor.setValue(color.r, color.g, color.b, color.a);
        }
        if (params) {
            SpriteInstanceMaterial.SceneTintParams.setValue(params.x, params.y, params.z, params.w);
        }
        SpriteInstanceMaterial.sceneTintMaterials.forEach((mat) => {
            mat.RefreshSceneTintData();
        });
    }

    public destroy(): void {
        SpriteInstanceMaterial.sceneTintMaterials.delete(this);
        super.destroy();
    }

    private RefreshSceneTintData(): void {
        this.setColor(SpriteInstanceMaterial.SceneTintColorName, SpriteInstanceMaterial.SceneTintColor);
        this.setVector4(SpriteInstanceMaterial.SceneTintParamsName, SpriteInstanceMaterial.SceneTintParams);
    }

    //渲染模式
    renderModeSet(transparent: boolean = false) {
        if (transparent) {
            this.alphaTest = false;
            this.renderQueue = Material.RENDERQUEUE_TRANSPARENT;
            this.depthWrite = false;
            this.blend = RenderState.BLEND_ENABLE_ALL;
            this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
            this.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
        }
        else {
            this.alphaTest = true;
            this.renderQueue = Material.RENDERQUEUE_ALPHATEST;
            this.depthWrite = true;
            this.blend = RenderState.BLEND_DISABLE;

            RenderHelper.SetDefaultBlockMat(this);
        }
        this.cull = RenderState.CULL_BACK;
        this.depthTest = RenderState.DEPTHTEST_LESS;

        //this.addDefine(GlobalShaderInit.CurveWorldDefine);
        this.addDefine(GlobalShaderInit.ZHFogDefine);
        //this.addDefine(GlobalShaderInit.DitherClipDefine);
    }
}