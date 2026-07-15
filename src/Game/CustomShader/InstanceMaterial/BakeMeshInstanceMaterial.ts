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

import BakeMeshInstanceVS from "../InstanceShader/BakeMeshInstanceVS.vs";
import BakeMeshInstanceFS from "../InstanceShader/BakeMeshInstanceFS.fs";
import BaseTexture = Laya.BaseTexture;


export class BakeMeshInstanceMaterial extends CustomMaterial {

    public static readonly ShaderName = "BakeMeshInstance";

    private static mainTexName: string = "u_AlbedoTexture";
    private static lightMapName: string = "u_CustomLightMap";
    private static lightMapContrastName: string = "u_LightMapContrast";
    private static lightMapHDRScale: string = "u_LightMapHDRScale";
    private static readonly sceneTintColorName: string = "u_SceneTintColor";
    private static readonly sceneTintParamsName: string = "u_SceneTintParams";
    private static readonly sceneTintColor: Color = new Color(0.05, 0.15, 0.45, 1);
    private static readonly sceneTintParams: Vector4 = new Vector4();
    private static readonly sceneTintMaterials: Set<BakeMeshInstanceMaterial> = new Set<BakeMeshInstanceMaterial>();

    LoadShader() {

        BakeMeshInstanceMaterial.InitShader();
        this.setShaderName(BakeMeshInstanceMaterial.ShaderName);
    }

    public static InitShader() {
        if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
            return;
        }

        let attributeMap: any = {
            'a_Position': [VertexMesh.MESH_POSITION0, ShaderDataType.Vector4],
            'a_Texcoord0': [VertexMesh.MESH_TEXTURECOORDINATE0, ShaderDataType.Vector2],
            'a_Texcoord1': [VertexMesh.MESH_TEXTURECOORDINATE1, ShaderDataType.Vector2],
            'a_WorldMat': [VertexMesh.MESH_WORLDMATRIX_ROW0, ShaderDataType.Matrix4x4],
            'a_customLightmapScaleOffset': [VertexMesh.MESH_CUSTOME0, ShaderDataType.Vector4]
        };

        let uniformMap: any = {
            'u_AlbedoTexture': ShaderDataType.Texture2D,
            'u_CustomLightMap': ShaderDataType.Texture2D,
            'u_LightMapContrast': ShaderDataType.Float,
            "u_LightMapHDRScale": ShaderDataType.Float,
            [BakeMeshInstanceMaterial.sceneTintColorName]: ShaderDataType.Color,
            [BakeMeshInstanceMaterial.sceneTintParamsName]: ShaderDataType.Vector4,
        };
        let shader: Shader3D = Shader3D.add(this.ShaderName, false, false);
        let subShader: SubShader = new SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(BakeMeshInstanceVS, BakeMeshInstanceFS);

        // console.log("[CustomMaterial]: InitShader:" + this.ShaderName);
        CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }

    constructor() {
        super();
        this.renderModeSet();
        BakeMeshInstanceMaterial.sceneTintMaterials.add(this);
        this.RefreshSceneTintData();
    }

    public static SetSceneTintData(color: Color, params: Vector4): void {
        if (color) {
            BakeMeshInstanceMaterial.sceneTintColor.setValue(color.r, color.g, color.b, color.a);
        }
        if (params) {
            BakeMeshInstanceMaterial.sceneTintParams.setValue(params.x, params.y, params.z, params.w);
        }
        BakeMeshInstanceMaterial.sceneTintMaterials.forEach((mat) => {
            mat.RefreshSceneTintData();
        });
    }

    public destroy(): void {
        BakeMeshInstanceMaterial.sceneTintMaterials.delete(this);
        super.destroy();
    }

    private RefreshSceneTintData(): void {
        this.setColor(BakeMeshInstanceMaterial.sceneTintColorName, BakeMeshInstanceMaterial.sceneTintColor);
        this.setVector4(BakeMeshInstanceMaterial.sceneTintParamsName, BakeMeshInstanceMaterial.sceneTintParams);
    }

    //渲染模式
    renderModeSet() {
        this.alphaTest = false;
        this.renderQueue = Material.RENDERQUEUE_OPAQUE;
        this.depthWrite = true;
        this.blend = RenderState.BLEND_DISABLE;
        this.cull = RenderState.CULL_BACK;
        this.depthTest = RenderState.DEPTHTEST_LESS;

        //this.addDefine(GlobalShaderInit.CurveWorldDefine);
        this.addDefine(GlobalShaderInit.ZHFogDefine);
        //this.addDefine(GlobalShaderInit.DitherClipDefine);

        RenderHelper.SetDefaultBlockMat(this);
    }

    public SetBakeMainTex(tex: BaseTexture) {
        if (tex && !(tex as any)._getSource) {
            console.error("SetBakeMainTex error url: " + tex.url);
        }
        this.setTexture(BakeMeshInstanceMaterial.mainTexName, tex);
    }

    public SetBakeLightMap(tex: BaseTexture) {
        if (tex && !(tex as any)._getSource) {
            console.error("SetBakeLightMap error url: " + tex.url);
        }
        this.setTexture(BakeMeshInstanceMaterial.lightMapName, tex);
    }

    public SetBakeLightMapContrast(val: number) {
        this.setFloat(BakeMeshInstanceMaterial.lightMapContrastName, val);
    }

    public SetBakeLightMapHDRScale(val: number) {
        this.setFloat(BakeMeshInstanceMaterial.lightMapHDRScale, val);
    }
}