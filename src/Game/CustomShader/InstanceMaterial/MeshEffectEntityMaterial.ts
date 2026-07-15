import { CustomMaterial } from "../CustomMaterial";
import Material = Laya.Material;
import VertexMesh = Laya.VertexMesh;
import ShaderDataType = Laya.ShaderDataType;
import Shader3D = Laya.Shader3D;
import SubShader = Laya.SubShader;
import RenderState = Laya.RenderState;

import MeshEffectEntityVS from "../InstanceShader/MeshEffectEntityVS.vs";
import MeshEffectEntityFS from "../InstanceShader/MeshEffectEntityFS.fs";

import Vector4 = Laya.Vector4;
import Color = Laya.Color;

export class MeshEffectEntityMaterial extends CustomMaterial {

    public static readonly ShaderName = "MeshEffectEntity";

    public static readonly EntityColor: string = "a_EntityColor";
    public static readonly EntityTilingOffset: string = "a_EntityTilingOffset";
    public static readonly EntityParam1: string = "a_EntityParam1";
    public static readonly EntityParam2: string = "a_EntityParam2";

    //private uniformMap:any;


    LoadShader() {

        MeshEffectEntityMaterial.InitShader();
        this.setShaderName(MeshEffectEntityMaterial.ShaderName);
    }

    public static InitShader() {
        if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
            return;
        }

        let attributeMap: any = {
            'a_Position': [VertexMesh.MESH_POSITION0, ShaderDataType.Vector4],
            'a_Normal': [VertexMesh.MESH_NORMAL0, ShaderDataType.Vector3],
            'a_Texcoord0': [VertexMesh.MESH_TEXTURECOORDINATE0, ShaderDataType.Vector2],
            'a_WorldMat': [VertexMesh.MESH_WORLDMATRIX_ROW0, ShaderDataType.Matrix4x4],
            'a_EntityColor': [VertexMesh.MESH_CUSTOME0, ShaderDataType.Vector4],
            'a_EntityTilingOffset': [VertexMesh.MESH_CUSTOME1, ShaderDataType.Vector4],
            'a_EntityParam1': [VertexMesh.MESH_CUSTOME2, ShaderDataType.Vector4],
            //'a_EntityParam2':[VertexMesh.MESH_CUSTOME3, ShaderDataType.Vector4],
        };

        let uniformMap: any = {
            'u_AlphaTestValue': ShaderDataType.Float,
            //'u_AlbedoColor' : ShaderDataType.Color,
            'u_AlbedoColorStrength': ShaderDataType.Float,
            'u_TilingOffset': ShaderDataType.Vector4,
            'u_AlbedoTexture': ShaderDataType.Texture2D,
            'u_SubTexture': ShaderDataType.Texture2D,
            '_AlbedoTextureUVAnim': ShaderDataType.Vector4,
            'FaceToCamera': ShaderDataType.Bool,
            'u_SheetParam': ShaderDataType.Vector4,
            '_EnableAnimControl': ShaderDataType.Bool,
            //'u_SheetProgress' : ShaderDataType.Float,
            '_DistortMap': ShaderDataType.Texture2D,
            '_AlbedoReceiveDistort': ShaderDataType.Bool,
            '_DistortParam': ShaderDataType.Vector4,
            '_DissolveMap': ShaderDataType.Texture2D,
            '_DissolveReceiveDistort': ShaderDataType.Bool,
            '_DissolveEdgeColor': ShaderDataType.Color,
            '_DissolveParam': ShaderDataType.Vector4,
            '_DissolveParam2': ShaderDataType.Vector4,
            '_MaskMap': ShaderDataType.Texture2D,
            '_MaskTilingOffset': ShaderDataType.Vector4,
            '_MaskUVAnim': ShaderDataType.Vector2,
            '_MaskChannelA': ShaderDataType.Bool,
            '_MaskReceiveDistort': ShaderDataType.Bool,
            '_RimColor': ShaderDataType.Color,
            '_RimArea': ShaderDataType.Float,
            '_RimSoft': ShaderDataType.Float,
            '_RimReverse': ShaderDataType.Bool,
            '_RimAdditive': ShaderDataType.Bool,
            '_ReceiveFog': ShaderDataType.Bool,
            '_AdditiveFog': ShaderDataType.Bool,
            '_EnableSoftParticle': ShaderDataType.Bool,
            '_EnableSoftMoveWithCurve': ShaderDataType.Bool,
            '_SoftParticleStartHeight': ShaderDataType.Float,
            '_SoftParticleEndHeight': ShaderDataType.Float,
            '_Softness': ShaderDataType.Float
        };

        //this.uniformMap = uniformMap;
        let shader: Shader3D = Shader3D.add(this.ShaderName, false, false);
        let subShader: SubShader = new SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(MeshEffectEntityVS, MeshEffectEntityFS);

        // console.log("[CustomMaterial]: InitShader:" + this.ShaderName);
        CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }

    constructor() {
        super();
    }

    cloneSceneEffectCommonMat(mat: Material) {
        if (mat.shaderData) {
            this["_shaderValues"] = mat.shaderData.clone();
        }
    }

    public static getDefaultParam(mat: Material, entityCol: Vector4, entityTilingOffset: Vector4, entityParam1: Vector4) {
        let col = mat.getColor("u_AlbedoColor");
        if (col)
            entityCol.setValue(Color.gammaToLinearSpace(col.r), Color.gammaToLinearSpace(col.g),
                Color.gammaToLinearSpace(col.b), col.a);
        let tilingOffset = mat.getVector4("u_TilingOffset");
        let maskTilingOffset = mat.getVector4("_MaskTilingOffset");
        entityTilingOffset.setValue(tilingOffset ? tilingOffset.z : 0, tilingOffset ? tilingOffset.w : 0,
            maskTilingOffset ? maskTilingOffset.z : 0, maskTilingOffset ? maskTilingOffset.w : 0);

        let dissolveParam = mat.getVector4("_DissolveParam");
        let dissolveParam2 = mat.getVector4("_DissolveParam2");
        let AlbedoTextureUVAnim = mat.getVector4("_AlbedoTextureUVAnim");
        let animationSheetProgress = mat.getFloat("u_SheetProgress");
        entityParam1.setValue(dissolveParam ? dissolveParam.z : 0, dissolveParam2 ? dissolveParam2.x : 0
            , AlbedoTextureUVAnim ? AlbedoTextureUVAnim.z : 0, animationSheetProgress ? animationSheetProgress : 0);
    }
}