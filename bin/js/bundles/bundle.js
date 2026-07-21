"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/Game/CustomShader/CustomMaterial.ts
  var Material = Laya.Material;
  var _CustomMaterial = class _CustomMaterial extends Material {
    LoadShader() {
    }
    constructor() {
      super();
      this.LoadShader();
    }
  };
  __name(_CustomMaterial, "CustomMaterial");
  _CustomMaterial.ShaderDic = /* @__PURE__ */ new Map();
  var CustomMaterial = _CustomMaterial;

  // src/Game/CustomShader/InstanceShader/MeshEffectEntityVS.vs
  var MeshEffectEntityVS_default = '#define SHADER_NAME MeshEffectEntity\r\n\r\n//#include "Math.glsl";\r\n\r\n#include "Scene.glsl";\r\n\r\n#include "Camera.glsl";\r\n#include "Sprite3DVertex.glsl";\r\n\r\n//#include "VertexCommon.glsl";\r\n#include "CustomShaderFunctionSupport.glsl";\r\n#include "EffectInstanceMap.glsl";\r\n\r\nvarying vec4 v_Color;\r\n\r\n#ifdef UV\r\n    varying vec4 v_Texcoord0;\r\n\r\n    #ifdef EnableDissolve\r\n    varying vec2 v_dissolveUV;\r\n    #endif\r\n\r\n    #ifdef EnableDistort\r\n    varying vec2 v_distortUV;\r\n    #endif\r\n#endif // UV\r\n\r\n#ifdef EnableRim\r\n    varying vec3 v_NormalWS;\r\n    varying vec3 v_viewDirWS;\r\n#endif\r\n\r\nvarying vec3 worldPosXYZ;\r\nvarying float softStart;\r\nvarying float softEnd;\r\n\r\n//#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n//#endif\r\n\r\nvoid main() \r\n{\r\n    vec4 tilingOffset;\r\n    vec4 maskTilingOffset;\r\n    #ifdef GPU_INSTANCE\r\n        v_Color = a_EntityColor;\r\n        tilingOffset = vec4(u_TilingOffset.xy,a_EntityTilingOffset.xy);\r\n        maskTilingOffset = vec4(_MaskTilingOffset.xy,a_EntityTilingOffset.zw);\r\n        v_EntityParam1 = a_EntityParam1;\r\n    #else\r\n        v_Color = vec4(1,1,1,1);\r\n        tilingOffset = u_TilingOffset;\r\n        maskTilingOffset = _MaskTilingOffset;\r\n    #endif\r\n\r\n#ifdef UV\r\n\r\n    #ifdef UseAnimationSheet\r\n        v_Texcoord0.xy = rotateUV(a_Texcoord0,_RotateAngle);\r\n    #else\r\n        v_Texcoord0.xy = transformUV(a_Texcoord0, tilingOffset);\r\n        v_Texcoord0.xy = rotateUV(v_Texcoord0.xy,_RotateAngle);\r\n        v_Texcoord0.xy += fract(_AlbedoTextureUVAnim.xy * u_Time);\r\n    #endif\r\n\r\n        v_Texcoord0.zw = transformUV(a_Texcoord0, maskTilingOffset);\r\n        v_Texcoord0.zw += fract(_MaskUVAnim.xy * u_Time);\r\n\r\n    #ifdef EnableDistort\r\n        v_distortUV = getDistortTexUV(a_Texcoord0,u_Time);\r\n    #endif\r\n        \r\n    #ifdef EnableDissolve\r\n        v_dissolveUV.xy = getDissolveTexUV(a_Texcoord0,u_Time);\r\n    #endif    \r\n#endif\r\n\r\n    vec3 positionOS = a_Position.xyz;\r\n\r\n	mat4 worldMat = getWorldMatrix();\r\n    if(FaceToCamera)\r\n    {\r\n        ApplyFaceToCamera(positionOS.xyz,worldMat,u_CameraPos);\r\n    }\r\n	vec3 positionWS = (worldMat *vec4(positionOS.xyz, 1.0)).xyz; \r\n//#ifdef CURVE_WORLD\r\n    if(_EnableSoftParticle){\r\n        softStart = _SoftParticleStartHeight;\r\n        softEnd = _SoftParticleEndHeight;\r\n        LittleSoftParticle_Y_Curve(positionWS, softStart,softEnd);\r\n    }else{\r\n        LittlePlanet_Y_Curve(positionWS);\r\n    }\r\n//#endif\r\n    worldPosXYZ = positionWS;\r\n    #ifdef EnableRim\r\n        v_NormalWS = TransformObjectToWorldNormal(a_Normal,worldMat);\r\n        v_viewDirWS = getViewDirection(positionWS);\r\n    #endif\r\n\r\n	gl_Position = getPositionCS(positionWS);\r\n\r\n//#ifdef ZHFOG\r\n    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);\r\n//#endif\r\n\r\n	gl_Position=remapPositionZ(gl_Position);\r\n}';

  // src/Game/CustomShader/InstanceShader/MeshEffectEntityFS.fs
  var MeshEffectEntityFS_default = '#define SHADER_NAME MeshEffectEntity\r\n#include "Color.glsl";\r\n#include "Scene.glsl";\r\n#include "CustomShaderFunctionSupport.glsl";\r\n#include "EffectInstanceMap.glsl";\r\n\r\nvarying vec4 v_Color;\r\nvarying vec4 v_Texcoord0;\r\n\r\n#ifdef EnableDissolve\r\n    varying vec2 v_dissolveUV;\r\n#endif\r\n\r\n#ifdef EnableDistort\r\n    varying vec2 v_distortUV;\r\n#endif\r\n\r\n#ifdef EnableRim\r\n    varying vec3 v_NormalWS;\r\n    varying vec3 v_viewDirWS;\r\n#endif\r\n\r\n//#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n\r\nvarying vec3 worldPosXYZ;\r\nvarying float softStart;\r\nvarying float softEnd;\r\n//#endif\r\n//uniform sampler2D u_AtlasTexture;\r\n\r\nvoid main()\r\n{\r\n        vec2 mainUV;\r\n    #ifdef UseAnimationSheet\r\n        vec2 uv = v_Texcoord0.xy;\r\n        float row = max(1.0, u_SheetParam.x);\r\n        float column = max(1.0, u_SheetParam.y);\r\n        vec2 scale = vec2(1.0) / vec2(column, row);\r\n        float progress;\r\n        if(_EnableAnimControl)\r\n        {\r\n             progress = _AnimationSheetProgress * row * column;\r\n        }\r\n        else\r\n        {\r\n             progress = mod(u_Time * u_SheetParam.z, 500.0);\r\n        }\r\n        uv = (uv + vec2(floor(progress - floor(progress / column) * column), row - (1.0 - floor(progress / column)))) * scale;\r\n        mainUV = fract(uv);\r\n    #else\r\n        mainUV = v_Texcoord0.xy;\r\n    #endif\r\n        \r\n        float distort = 0.0;\r\n    #ifdef EnableDistort\r\n        vec4 distortCol = texture2D(_DistortMap,v_distortUV);\r\n        distort = distortCol.r * _DistortFactor;\r\n    #endif\r\n        \r\n        if(_AlbedoReceiveDistort)\r\n        {\r\n            mainUV += vec2(distort);\r\n        }\r\n        \r\n        vec4 albedoColor = v_Color * u_AlbedoColorStrength;\r\n\r\n        vec3 color = albedoColor.rgb;\r\n        mediump float alpha = albedoColor.a;\r\n\r\n    //#ifdef ALBEDOTEXTURE\r\n        vec4 albedoSampler = texture2D(u_AlbedoTexture, mainUV);\r\n        #ifdef Gamma_u_AlbedoTexture\r\n        albedoSampler = gammaToLinear(albedoSampler);\r\n        #endif // Gamma_u_AlbedoTexture\r\n        color *= albedoSampler.rgb;\r\n        alpha *= albedoSampler.a;\r\n    //#endif // ALBEDOTEXTURE\r\n\r\n    #ifdef SUBTEXTURE\r\n        vec4 subSampler = texture2D(u_SubTexture, mainUV);\r\n        #ifdef Gamma_u_SubTexture\r\n        subSampler = gammaToLinear(subSampler);\r\n        #endif\r\n        color = mix(color * subSampler.rgb,color + subSampler.rgb,_AlbedoTextureUVAnim.w);\r\n        alpha = mix(alpha * subSampler.a,alpha + subSampler.a,_AlbedoTextureUVAnim.w);\r\n    #endif\r\n        \r\n    #ifdef EnableDissolve\r\n        vec2 dissolveUV = v_dissolveUV;\r\n        if(_DissolveReceiveDistort)\r\n        {\r\n            dissolveUV += vec2(distort);\r\n        }\r\n        vec4 ClipTexCol = texture2D(_DissolveMap,dissolveUV.xy);\r\n        mediump float clipSource = min(ClipTexCol.r, ClipTexCol.a);\r\n        mediump vec2 dissolveData = vec2(_DissolveFactor,_DissolveEdge);\r\n        dissolveData = dissolveData * 2.0 - 1.0;\r\n        mediump vec2 soft = vec2(_DissolveSoft,_DissolveEdgeSoft);\r\n        mediump float clipArea = clipSource - dissolveData.x;\r\n        mediump float clipEdge = saturate(clipArea - dissolveData.y);\r\n        \r\n        mediump vec2 ClipAreaAndEdge = smoothstep(0.5 - soft, 0.5 + soft, vec2(clipArea, clipEdge));\r\n        ClipAreaAndEdge.y = 1.0 - ClipAreaAndEdge.y;\r\n        //color.rgb += _DissolveEdgeColor.rgb * ClipAreaAndEdge.y;\r\n        color.rgb = mix(color.rgb,_DissolveEdgeColor.rgb,ClipAreaAndEdge.y);\r\n        alpha *= ClipAreaAndEdge.x;\r\n    #endif\r\n    \r\n\r\n    #ifdef COLOR\r\n        #ifdef ENABLEVERTEXCOLOR\r\n        vec4 vertexColor = v_Color;\r\n        color *= vertexColor.rgb;\r\n        alpha *= vertexColor.a;\r\n        #endif // ENABLEVERTEXCOLOR\r\n    #endif // COLOR\r\n\r\n    #ifdef FOG\r\n        color = scenUnlitFog(color);\r\n    #endif // FOG\r\n\r\n#ifdef EnableMask\r\n        vec2 maskUV = v_Texcoord0.zw;\r\n        if(_MaskReceiveDistort)\r\n        {\r\n            maskUV += vec2(distort);\r\n        }\r\n        vec4 maskCol = texture2D(_MaskMap,maskUV);\r\n        float mask = maskCol.r;\r\n        if(_MaskChannelA)\r\n        {\r\n            mask = maskCol.a;\r\n        }\r\n        alpha *= mask;\r\n#endif\r\n\r\n#ifdef EnableRim\r\n        RimParam rimParam;\r\n        rimParam.normalWS = v_NormalWS;\r\n        rimParam.viewDirWS = v_viewDirWS;\r\n        rimParam.rimColor = _RimColor;\r\n        rimParam.rimArea = _RimArea;\r\n        rimParam.rimSoft = _RimSoft;\r\n        rimParam.rimReverse = _RimReverse;\r\n        rimParam.rimAdditive = _RimAdditive;\r\n        \r\n        ApplyRim(rimParam,color.rgb,alpha);\r\n#endif\r\n\r\n#ifdef ALPHATEST\r\n        if (alpha < u_AlphaTestValue)\r\n            discard;\r\n#endif // ALPHATEST\r\n\r\n//#ifdef ZHFOG\r\n//        #ifdef ADDITIVEFOG\r\n//        ApplyFog(color.rgb,v_fogParam,alpha);\r\n//        #else\r\n//        ApplyFog(color.rgb,v_fogParam);\r\n//        #endif\r\n//#endif\r\n        if(_EnableSoftParticle && _EnableSoftMoveWithCurve)\r\n        {\r\n            ApplySoftParticleTemp(worldPosXYZ, alpha,softStart,softEnd,_Softness);\r\n        }\r\n        else if(_EnableSoftParticle)\r\n        {\r\n            ApplySoftParticleTemp(worldPosXYZ, alpha,_SoftParticleStartHeight,_SoftParticleEndHeight,_Softness);\r\n        }\r\n\r\n        ApplyFog(color.rgb,v_fogParam,alpha,_ReceiveFog,_AdditiveFog);\r\n\r\n        gl_FragColor = vec4(color, alpha);\r\n\r\n        gl_FragColor = outputTransform(gl_FragColor);\r\n}';

  // src/Game/CustomShader/InstanceMaterial/MeshEffectEntityMaterial.ts
  var VertexMesh = Laya.VertexMesh;
  var ShaderDataType = Laya.ShaderDataType;
  var Shader3D = Laya.Shader3D;
  var SubShader = Laya.SubShader;
  var Color = Laya.Color;
  var _MeshEffectEntityMaterial = class _MeshEffectEntityMaterial extends CustomMaterial {
    //private uniformMap:any;
    LoadShader() {
      _MeshEffectEntityMaterial.InitShader();
      this.setShaderName(_MeshEffectEntityMaterial.ShaderName);
    }
    static InitShader() {
      if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
        return;
      }
      let attributeMap = {
        "a_Position": [VertexMesh.MESH_POSITION0, ShaderDataType.Vector4],
        "a_Normal": [VertexMesh.MESH_NORMAL0, ShaderDataType.Vector3],
        "a_Texcoord0": [VertexMesh.MESH_TEXTURECOORDINATE0, ShaderDataType.Vector2],
        "a_WorldMat": [VertexMesh.MESH_WORLDMATRIX_ROW0, ShaderDataType.Matrix4x4],
        "a_EntityColor": [VertexMesh.MESH_CUSTOME0, ShaderDataType.Vector4],
        "a_EntityTilingOffset": [VertexMesh.MESH_CUSTOME1, ShaderDataType.Vector4],
        "a_EntityParam1": [VertexMesh.MESH_CUSTOME2, ShaderDataType.Vector4]
        //'a_EntityParam2':[VertexMesh.MESH_CUSTOME3, ShaderDataType.Vector4],
      };
      let uniformMap = {
        "u_AlphaTestValue": ShaderDataType.Float,
        //'u_AlbedoColor' : ShaderDataType.Color,
        "u_AlbedoColorStrength": ShaderDataType.Float,
        "u_TilingOffset": ShaderDataType.Vector4,
        "u_AlbedoTexture": ShaderDataType.Texture2D,
        "u_SubTexture": ShaderDataType.Texture2D,
        "_AlbedoTextureUVAnim": ShaderDataType.Vector4,
        "FaceToCamera": ShaderDataType.Bool,
        "u_SheetParam": ShaderDataType.Vector4,
        "_EnableAnimControl": ShaderDataType.Bool,
        //'u_SheetProgress' : ShaderDataType.Float,
        "_DistortMap": ShaderDataType.Texture2D,
        "_AlbedoReceiveDistort": ShaderDataType.Bool,
        "_DistortParam": ShaderDataType.Vector4,
        "_DissolveMap": ShaderDataType.Texture2D,
        "_DissolveReceiveDistort": ShaderDataType.Bool,
        "_DissolveEdgeColor": ShaderDataType.Color,
        "_DissolveParam": ShaderDataType.Vector4,
        "_DissolveParam2": ShaderDataType.Vector4,
        "_MaskMap": ShaderDataType.Texture2D,
        "_MaskTilingOffset": ShaderDataType.Vector4,
        "_MaskUVAnim": ShaderDataType.Vector2,
        "_MaskChannelA": ShaderDataType.Bool,
        "_MaskReceiveDistort": ShaderDataType.Bool,
        "_RimColor": ShaderDataType.Color,
        "_RimArea": ShaderDataType.Float,
        "_RimSoft": ShaderDataType.Float,
        "_RimReverse": ShaderDataType.Bool,
        "_RimAdditive": ShaderDataType.Bool,
        "_ReceiveFog": ShaderDataType.Bool,
        "_AdditiveFog": ShaderDataType.Bool,
        "_EnableSoftParticle": ShaderDataType.Bool,
        "_EnableSoftMoveWithCurve": ShaderDataType.Bool,
        "_SoftParticleStartHeight": ShaderDataType.Float,
        "_SoftParticleEndHeight": ShaderDataType.Float,
        "_Softness": ShaderDataType.Float
      };
      let shader = Shader3D.add(this.ShaderName, false, false);
      let subShader = new SubShader(attributeMap, uniformMap);
      shader.addSubShader(subShader);
      subShader.addShaderPass(MeshEffectEntityVS_default, MeshEffectEntityFS_default);
      CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }
    constructor() {
      super();
    }
    cloneSceneEffectCommonMat(mat) {
      if (mat.shaderData) {
        this["_shaderValues"] = mat.shaderData.clone();
      }
    }
    static getDefaultParam(mat, entityCol, entityTilingOffset, entityParam1) {
      let col = mat.getColor("u_AlbedoColor");
      if (col)
        entityCol.setValue(
          Color.gammaToLinearSpace(col.r),
          Color.gammaToLinearSpace(col.g),
          Color.gammaToLinearSpace(col.b),
          col.a
        );
      let tilingOffset = mat.getVector4("u_TilingOffset");
      let maskTilingOffset = mat.getVector4("_MaskTilingOffset");
      entityTilingOffset.setValue(
        tilingOffset ? tilingOffset.z : 0,
        tilingOffset ? tilingOffset.w : 0,
        maskTilingOffset ? maskTilingOffset.z : 0,
        maskTilingOffset ? maskTilingOffset.w : 0
      );
      let dissolveParam = mat.getVector4("_DissolveParam");
      let dissolveParam2 = mat.getVector4("_DissolveParam2");
      let AlbedoTextureUVAnim = mat.getVector4("_AlbedoTextureUVAnim");
      let animationSheetProgress = mat.getFloat("u_SheetProgress");
      entityParam1.setValue(
        dissolveParam ? dissolveParam.z : 0,
        dissolveParam2 ? dissolveParam2.x : 0,
        AlbedoTextureUVAnim ? AlbedoTextureUVAnim.z : 0,
        animationSheetProgress ? animationSheetProgress : 0
      );
    }
  };
  __name(_MeshEffectEntityMaterial, "MeshEffectEntityMaterial");
  _MeshEffectEntityMaterial.ShaderName = "MeshEffectEntity";
  _MeshEffectEntityMaterial.EntityColor = "a_EntityColor";
  _MeshEffectEntityMaterial.EntityTilingOffset = "a_EntityTilingOffset";
  _MeshEffectEntityMaterial.EntityParam1 = "a_EntityParam1";
  _MeshEffectEntityMaterial.EntityParam2 = "a_EntityParam2";
  var MeshEffectEntityMaterial = _MeshEffectEntityMaterial;

  // src/Game/Engine/CommandBufferDrawMgr/MeshEffectEntity.ts
  var Vector4 = Laya.Vector4;
  var MaterialInstancePropertyBlock = Laya.MaterialInstancePropertyBlock;
  var InstanceLocation = Laya.InstanceLocation;
  var Mesh = Laya.Mesh;
  var Material2 = Laya.Material;
  var Color2 = Laya.Color;
  var { regClass, property } = Laya;
  var MeshEffectEntity = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.EntityColor = new Vector4(1, 1, 1, 1);
      this.EntityTilingOffset = new Vector4(1, 1, 0, 0);
      this.EntityParam1 = new Vector4();
    }
    // private entityColKeyFrames:Vector4Keyframe[];
    // private entityTOKeyFrames:Vector4Keyframe[];
    // private entityParam1KeyFrames:Vector4Keyframe[];
    SetEntity(id, commandEntity) {
      this.entityID = id;
      this.transform = this.owner.transform;
      this.commandEntity = commandEntity;
    }
    SetEntityFirst(id, commandEntity, cmd) {
      this.entityID = id;
      this.transform = this.owner.transform;
      if (!this.mesh || !this.mesh._subMeshes || !this.paramMaterial || !this.paramMaterial.shaderData) {
        return null;
      }
      commandEntity = new MeshEffectCommandEntity(id);
      let mat = new MeshEffectEntityMaterial();
      mat.cloneSceneEffectCommonMat(this.paramMaterial);
      commandEntity.addCommandToCMD(cmd, this.mesh, mat);
      this.commandEntity = commandEntity;
      return commandEntity;
    }
    //组件被启用后执行，例如节点被添加到舞台后
    onEnable() {
      if (!this.commandEntity)
        return;
      this.commandEntity.addToCommand(this);
    }
    //组件被禁用时执行，例如从节点从舞台移除后
    onDisable() {
      if (!this.commandEntity)
        return;
      this.commandEntity.removeFromCommand(this.id);
    }
  };
  __name(MeshEffectEntity, "MeshEffectEntity");
  MeshEffectEntity.tmpVec = new Vector4();
  MeshEffectEntity.tmpCol = new Color2();
  __decorateClass([
    property({ type: Mesh, tips: "网格" })
  ], MeshEffectEntity.prototype, "mesh", 2);
  __decorateClass([
    property({ type: Material2, tips: "参数材质球" })
  ], MeshEffectEntity.prototype, "paramMaterial", 2);
  __decorateClass([
    property({ type: Vector4, tips: "主颜色", inspector: "color" })
  ], MeshEffectEntity.prototype, "EntityColor", 2);
  __decorateClass([
    property({ type: Vector4, tips: "[ XY:主贴图Tiling的ZW ]  [ ZW:Mask贴图Tiling的ZW]" })
  ], MeshEffectEntity.prototype, "EntityTilingOffset", 2);
  __decorateClass([
    property({ type: Vector4, tips: "[ X:溶解强度 ]  [ Y:溶解边缘范围 ]  [ Z:主帖图旋转角度(0-360度) ]  [ W:序列帧动画控制进度 ]" })
  ], MeshEffectEntity.prototype, "EntityParam1", 2);
  MeshEffectEntity = __decorateClass([
    regClass("858e28f5-0875-44a0-9262-cb3a80ae3900", "../src/Game/Engine/CommandBufferDrawMgr/MeshEffectEntity.ts")
  ], MeshEffectEntity);
  var _MeshEffectCommandEntity = class _MeshEffectCommandEntity {
    constructor(id) {
      this._entityMap = /* @__PURE__ */ new Map();
      this._l2mMatrices = [];
      this._entityColors = [];
      this._entityTilingOffsets = [];
      this._entityParam1s = [];
      this.materialBlock = new MaterialInstancePropertyBlock();
      this.lastCount = 0;
      this.entityID = id;
    }
    get renderEmpty() {
      return this.renderCount < 1;
    }
    get renderCount() {
      return this._entityMap.size;
    }
    addToCommand(entity) {
      if (this.renderCount >= _MeshEffectCommandEntity.MaxRenderSize) {
        return;
      }
      this._entityMap.set(entity.id, entity);
      this.refreshCommandDrawCount();
    }
    removeFromCommand(id) {
      this._entityMap.delete(id);
      this.refreshCommandDrawCount();
    }
    addCommandToCMD(cmd, mesh, material) {
      this.material = material;
      this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityColor, this._entityColors, InstanceLocation.CUSTOME0);
      this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityTilingOffset, this._entityTilingOffsets, InstanceLocation.CUSTOME1);
      this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityParam1, this._entityParam1s, InstanceLocation.CUSTOME2);
      this.command = cmd.drawMeshInstance(mesh, 0, this._l2mMatrices, this.material, 0, this.materialBlock, this._l2mMatrices.length);
      this.lastCount = this._l2mMatrices.length;
    }
    refreshCommandMatrices() {
      if (this.renderCount !== this.lastCount || this.renderEmpty)
        return;
      this._l2mMatrices = [];
      this._entityMap.forEach((value) => {
        this._l2mMatrices.push(value.transform.worldMatrix);
      });
      this.command.setWorldMatrix(this._l2mMatrices);
    }
    refreshCommandDrawCount() {
      this._l2mMatrices = [];
      this._entityColors = [];
      this._entityTilingOffsets = [];
      this._entityParam1s = [];
      this._entityMap.forEach((value) => {
        this._l2mMatrices.push(value.transform.worldMatrix);
        this._entityColors.push(value.EntityColor);
        this._entityTilingOffsets.push(value.EntityTilingOffset);
        this._entityParam1s.push(value.EntityParam1);
      });
      const curCount = this._l2mMatrices.length;
      if (this.lastCount < curCount) {
        this.command.setWorldMatrix(this._l2mMatrices);
        this.command.setDrawNums(curCount);
      } else {
        this.command.setDrawNums(curCount);
        this.command.setWorldMatrix(this._l2mMatrices);
      }
      this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityColor, this._entityColors, InstanceLocation.CUSTOME0);
      this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityTilingOffset, this._entityTilingOffsets, InstanceLocation.CUSTOME1);
      this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityParam1, this._entityParam1s, InstanceLocation.CUSTOME2);
      this.lastCount = curCount;
    }
    clearRenderData() {
      this.material.destroy();
      this.material = null;
      this._entityMap.clear();
      this.materialBlock.clear();
      this.materialBlock = null;
      this._l2mMatrices = [];
      this._entityColors = [];
      this._entityTilingOffsets = [];
      this._entityParam1s = [];
    }
  };
  __name(_MeshEffectCommandEntity, "MeshEffectCommandEntity");
  _MeshEffectCommandEntity.MaxRenderSize = 1024;
  var MeshEffectCommandEntity = _MeshEffectCommandEntity;

  // src/Game/Engine/CommandBufferDrawMgr/MeshEffectInstanceMgr.ts
  var _MeshEffectInstanceMgr = class _MeshEffectInstanceMgr {
    static get Instance() {
      return this._instance;
    }
    constructor() {
      if (_MeshEffectInstanceMgr._instance == null) {
        _MeshEffectInstanceMgr._instance = this;
      } else {
        console.log("MeshEffectInstanceMgr has an Instance!");
      }
    }
    mgrLateUpdate() {
      for (const value of _MeshEffectInstanceMgr.renderDic.values()) {
        value.refreshCommandEntityMatrices();
      }
    }
  };
  __name(_MeshEffectInstanceMgr, "MeshEffectInstanceMgr");
  _MeshEffectInstanceMgr.renderDic = /* @__PURE__ */ new Map();
  var MeshEffectInstanceMgr = _MeshEffectInstanceMgr;

  // src/Game/Core/Utils/StringUtil.ts
  var _StringUtil = class _StringUtil {
    static format(fmt, ...args) {
      let i = 0;
      return fmt.replace(/\{(\d+)\}/g, () => {
        const arg = args[i++];
        return arg === void 0 || arg === null ? "" : String(arg);
      });
    }
    static isNullOrEmpty(value) {
      return value == null || value === "";
    }
  };
  __name(_StringUtil, "StringUtil");
  var StringUtil = _StringUtil;

  // src/Game/Core/Debug.ts
  var _Debug = class _Debug {
    static LogError(msg) {
      console.error(msg);
    }
    static Log(msg) {
      console.log(msg);
    }
    static getNodePath(node) {
      const names = [];
      let cur = node;
      while (cur) {
        names.unshift(cur.name);
        cur = cur.parent;
      }
      return names.join("/");
    }
    static GetCurTime() {
      const d = /* @__PURE__ */ new Date();
      return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
    }
    static LogWarning(msg, tagName = "Warning") {
      const str = StringUtil.format("[{0}][{1}]{2}", this.GetCurTime(), tagName, msg);
      console.warn(str);
    }
  };
  __name(_Debug, "Debug");
  var Debug = _Debug;

  // src/Game/Engine/RenderHelper.ts
  var Quaternion = Laya.Quaternion;
  var Vector3 = Laya.Vector3;
  var ShaderDataType2 = Laya.ShaderDataType;
  var _RenderHelper = class _RenderHelper {
    /**
     * 设置会遮挡角色的模型材质球(支持X光)  当渲染队列高于角色模型材质时需要设置
     * @param material
     * @constructor
     */
    static SetDefaultBlockMat(material) {
      material.stencilWrite = true;
      material.stencilTest = Laya.CompareFunction.Always;
      material.stencilOp = new Laya.Vector3(0, 0, Laya.StencilOperation.Replace);
      material.stencilRef = 0;
    }
    /**
     * 获取所有子节点的某一类组件数组,用法类似Unity
     * @param sprite 精灵
     * @param componentType 组件类型
     * @returns 
     */
    static GetComponentsInChild(sprite, componentType) {
      let comps = [];
      if (!sprite || !componentType) {
        return comps;
      }
      for (let component of sprite.components) {
        if (component instanceof componentType) {
          comps.push(component);
        }
      }
      if (sprite.numChildren > 0) {
        for (let i = 0; i < sprite.numChildren; i++) {
          let child = sprite.getChildAt(i);
          comps.push(...this.GetComponentsInChild(child, componentType));
        }
      }
      return comps;
    }
    /**
     * 从所有子节点中，获取第一个满足类型的组件
     * @param sprite 精灵
     * @param componentType 组件类型
     * @returns
     */
    static GetFirstComponentInChild(sprite, componentType) {
      if (sprite == null || !componentType)
        return null;
      let comp;
      for (let component of sprite.components) {
        if (component instanceof componentType) {
          comp = component;
          break;
        }
      }
      if (!comp && sprite.numChildren > 0) {
        for (let i = 0; i < sprite.numChildren; i++) {
          let child = sprite.getChildAt(i);
          comp = this.GetFirstComponentInChild(child, componentType);
          if (comp)
            break;
        }
      }
      return comp;
    }
    static GetFirstSkinnedComponentsInChild(sprite) {
      if (sprite == null)
        return null;
      const SimpleSkinnedMeshRenderer = Laya.SimpleSkinnedMeshRenderer;
      const SkinnedMeshRenderer = Laya.SkinnedMeshRenderer;
      if (!SimpleSkinnedMeshRenderer && !SkinnedMeshRenderer) {
        return null;
      }
      let comp;
      for (let component of sprite.components) {
        if (SimpleSkinnedMeshRenderer && component instanceof SimpleSkinnedMeshRenderer || SkinnedMeshRenderer && component instanceof SkinnedMeshRenderer) {
          comp = component;
          break;
        }
      }
      if (!comp && sprite.numChildren > 0) {
        for (let i = 0; i < sprite.numChildren; i++) {
          let child = sprite.getChildAt(i);
          comp = this.GetFirstSkinnedComponentsInChild(child);
          if (comp)
            break;
        }
      }
      return comp;
    }
    // public static readonly VECTOR3_UP = new Vector3(0,1,0);
    // public static readonly VECTOR3_RIGHT = new Vector3(1,0,0);
    /**
     * 创建一个从fromDirection旋转到toDirection的四元数
     * @param fromDirection
     * @param toDirection
     * @constructor
     */
    static FromToRotation(fromDirection, toDirection) {
      let nF = new Vector3();
      let nt = new Vector3();
      Vector3.normalize(fromDirection, nF);
      Vector3.normalize(toDirection, nt);
      let dot = Vector3.dot(nF, nt);
      let result = new Quaternion();
      if (dot >= 0.9999) {
        result.setValue(0, 0, 0, 1);
      } else if (dot <= -0.9999) {
        if (nF.x !== 0 && nF.y !== 0 && nF.z !== 0) {
          result.setValue(0.8164, -0.4082, -0.4082, 0);
        } else if (nF.x !== 0 && nF.y === 0 && nF.z === 0) {
          result.setValue(0, 1, 0, 0);
        } else if (nF.x === 0 && nF.y !== 0 && nF.z === 0) {
          result.setValue(1, 0, 0, 0);
        } else if (nF.x === 0 && nF.y === 0 && nF.z !== 0) {
          result.setValue(1, 0, 0, 0);
        } else if (nF.x !== 0 && nF.y !== 0 && nF.z === 0) {
          result.setValue(1, -1, 0, 0);
        } else if (nF.x !== 0 && nF.y === 0 && nF.z !== 0) {
          result.setValue(1, 0, -1, 0);
        } else if (nF.x === 0 && nF.y !== 0 && nF.z !== 0) {
          result.setValue(1, 0, 0, 0);
        }
        result.normalize(result);
      } else {
        let rad = Math.acos(dot);
        let axis = new Vector3();
        Vector3.cross(fromDirection, toDirection, axis);
        Quaternion.createFromAxisAngle(axis.normalize(), rad, result);
      }
      return result;
    }
    /**
     * 局部向量转为世界空间向量,TransformPoint为transform.localToGlobal()方法
     * @param transform
     * @param dir
     * @constructor
     */
    static TransformDirection(transform, dir) {
      let worldDir = new Vector3();
      Vector3.transformQuat(dir, transform.rotation, worldDir);
      return worldDir;
    }
    /**
     * 将Color类转化为为字符型颜色值。
     * @param color Color类
     * @return 字符型颜色值
     */
    static GetHexColor(color) {
      const red = Math.floor(color.r * 255);
      const green = Math.floor(color.g * 255);
      const blue = Math.floor(color.b * 255);
      const redHex = ("00" + red.toString(16)).slice(-2);
      const greenHex = ("00" + green.toString(16)).slice(-2);
      const blueHex = ("00" + blue.toString(16)).slice(-2);
      return `#${redHex}${greenHex}${blueHex}`;
    }
    //设置全局Shader变量
    static RegisterGlobalFloat(uniformName) {
      GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType2.Float);
    }
    static RegisterGlobalVector2(uniformName) {
      GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType2.Vector2);
    }
    static RegisterGlobalVector3(uniformName) {
      GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType2.Vector3);
    }
    static RegisterGlobalVector4(uniformName) {
      GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType2.Vector4);
    }
    static RegisterGlobalColor(uniformName) {
      GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType2.Color);
    }
    static SetGlobalShaderFloat(uniformName, value, register = false) {
      if (register) {
        this.RegisterGlobalFloat(uniformName);
      }
      GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType2.Float, value);
    }
    static SetGlobalShaderVector2(uniformName, value, register = false) {
      if (register) {
        this.RegisterGlobalVector2(uniformName);
      }
      GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType2.Vector2, value);
    }
    static SetGlobalShaderVector3(uniformName, value, register = false) {
      if (register) {
        this.RegisterGlobalVector3(uniformName);
      }
      GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType2.Vector3, value);
    }
    static SetGlobalShaderVector4(uniformName, value, register = false) {
      if (register) {
        this.RegisterGlobalVector4(uniformName);
      }
      GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType2.Vector4, value);
    }
    static SetGlobalShaderColor(uniformName, value, register = false) {
      if (register) {
        this.RegisterGlobalColor(uniformName);
      }
      GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType2.Color, value);
    }
    static findChildByPath(root, path) {
      if (root == null || !path) {
        return null;
      }
      let names = path.split("/");
      if (!(names == null ? void 0 : names.length)) {
        return null;
      }
      let current = root;
      for (let name of names) {
        current = current.getChildByName(name);
        if (current == null) {
          return null;
        }
      }
      return current;
    }
    /**
     * 设置RT参数(不在初始化选项中)
     * @param rt 目标RT
     * @param isGammaSpace 是否在Gamma空间中
     * @param isRepeat 是否重复
     */
    static setRenderTextureParam(rt, isGammaSpace, isRepeat) {
      rt._texture.gammaCorrection = isGammaSpace ? 2.2 : 1;
      rt.wrapModeU = rt.wrapModeV = isRepeat ? Laya.WrapMode.Repeat : Laya.WrapMode.Clamp;
    }
    static getMaterialPasses(material, subShaderIndex = 0) {
      const shader = material._shader;
      return shader.getSubShaderAt(subShaderIndex)._passes;
    }
    static getSimpleShadowScale(bounds, unitType = 0) {
      if (!bounds) {
        return new Laya.Vector3(1, 1, 1);
      }
      let diffX = bounds.max.x - bounds.min.x;
      let diffZ = bounds.max.z - bounds.min.z;
      let scale = Math.max(diffX, diffZ) * 0.8;
      let maxScale = 2;
      if (unitType === 3) {
        maxScale = 8;
      }
      scale = Math.min(scale, maxScale);
      scale = Math.max(0.7, scale);
      return new Laya.Vector3(scale, 1, scale);
    }
    static setSimpleShadowActive(_active) {
    }
    /**
     * todo 改为用passname当参数可能更好点，passIndex可能存在变化的情况
     * @param shader3D 
     * @param subShaderIndex 
     * @param passIndex 
     * @param active 
     * @returns 
     */
    static setShaderPassEnable(shader3D, subShaderIndex, passIndex, active) {
      if (!shader3D) {
        return;
      }
      let subShader = shader3D.getSubShaderAt(subShaderIndex);
      if (subShader) {
        let passes = subShader._passes;
        if (passes && passes[passIndex]) {
          passes[passIndex].passEnable = active;
        } else {
          Debug.LogError("setShaderPassEnable找不到指定pass");
        }
      } else {
        Debug.LogError("setShaderPassEnable找不到指定subshader");
      }
    }
    /**
     * 强制清理全部pool，注意主相机正在用的rt会重新创建（因为主相机每帧都会从池中拿rt和把rt还回池中），可能不太好，问题在于如何从池中区别出想清理的rt
     */
    static forceCleanRenderTexturePool() {
      let originDefaultCacheRTMemory = Laya.Config3D.defaultCacheRTMemory;
      Laya.Config3D.defaultCacheRTMemory = 0;
      Laya.RenderTexture.clearPool();
      Laya.Config3D.defaultCacheRTMemory = originDefaultCacheRTMemory;
    }
  };
  __name(_RenderHelper, "RenderHelper");
  _RenderHelper.Deg2Rad = 0.01745329;
  _RenderHelper.Rad2Deg = 57.29578;
  var RenderHelper = _RenderHelper;

  // src/Game/CustomShader/ShaderLibrary/CustomShaderFunctionSupport.glsl
  var CustomShaderFunctionSupport_default = '#ifndef CUSTOM_SHADER_FUNC_SUPPORT\r\n#define CUSTOM_SHADER_FUNC_SUPPORT\r\n\r\n\r\n#include "Math.glsl";\r\n\r\nvec3 TransformObjectToWorldNormal(vec3 normalOS,mat4 worldMatrix)\r\n{\r\n    mat4 normalMat = transpose(inverse(worldMatrix));\r\n    vec3 normalWS = (normalMat * vec4(normalOS,0.0)).xyz;\r\n    return normalize(normalWS);\r\n}\r\n\r\nvec3 TransformWorldToObject(vec3 posWS,mat4 worldMatrix)\r\n{\r\n    vec3 posOS = (inverse(worldMatrix) * vec4(posWS, 1.0)).xyz;\r\n    return posOS;\r\n}\r\n\r\n//#ifdef FaceToCamera\r\n\r\nvoid ApplyFaceToCamera(inout vec3 positionOS,mat4 worldMatrix,vec3 camPosWS)\r\n{\r\n     vec3 newZ = TransformWorldToObject(camPosWS,worldMatrix);\r\n     newZ = normalize(newZ);\r\n     vec3 newX = abs(newZ.y)<0.999?cross(vec3(0.0,1.0,0.0),newZ):cross(newZ,vec3(0.0,0.0,1.0));\r\n     newX = normalize(newX);\r\n     vec3 newY = cross(newZ, newX);\r\n     newY = normalize(newY);\r\n     positionOS.xyz = newX * positionOS.x + newY * positionOS.y + newZ * positionOS.z;\r\n}\r\n//#endif\r\n\r\n\r\n//PlaneShadow\r\n#ifdef PLANE_SHADOW\r\nuniform vec3 u_PlaneShadowLightDir;\r\nuniform float u_PlaneShadowPlane;\r\nvec3 GetPlaneShadowPos(vec3 positionWS)\r\n{\r\n    //_PlaneShadowLightDir = _MainLightPosition.xyz;\r\n    vec3 PlaneShadowLightDir = u_PlaneShadowLightDir.xyz;\r\n    //#ifdef CAN_CONTROL_DIR\r\n    //PlaneShadowLightDir = mix(PlaneShadowLightDir.xyz,_CustomLightDir.xyz,_CustomLightDir.w);\r\n    //#endif\r\n    PlaneShadowLightDir = normalize(PlaneShadowLightDir);\r\n    float cosAg = dot(PlaneShadowLightDir,normalize(vec3(0,positionWS.y - u_PlaneShadowPlane,0.0)));\r\n    float sDl = max(0.0,positionWS.y - u_PlaneShadowPlane) / cosAg;\r\n    sDl = max(0.0001,sDl);\r\n    vec3 ShadowPosWS = positionWS - PlaneShadowLightDir * sDl;\r\n    ShadowPosWS.y = u_PlaneShadowPlane;\r\n    return ShadowPosWS;\r\n}\r\n#endif\r\n\r\n//#ifdef CURVE_WORLD\r\nuniform vec3 u_CurvePivotPoint;\r\nuniform float u_CurveBendOffset;\r\nuniform float u_CurveBendSize;\r\n\r\nvoid LittlePlanet_Y_Curve(inout vec3 positionWS)\r\n{\r\n    vec3 posWS = positionWS;\r\n    posWS -= u_CurvePivotPoint;\r\n\r\n    vec2 offset = max(vec2(0.0, 0.0), abs(posWS.xz) - vec2(u_CurveBendOffset));\r\n    offset *= step(vec2(0.0, 0.0), posWS.xz) * 2.0 - 1.0;\r\n    offset *= offset;\r\n    posWS = vec3(0.0, -(u_CurveBendSize * offset.x + u_CurveBendSize * offset.y) * 0.001, 0.0); \r\n\r\n    positionWS += posWS;\r\n}\r\n\r\nvoid LittleSoftParticle_Y_Curve(inout vec3 positionWS, inout float softStart, inout float softEnd)\r\n{\r\n    vec3 posWS = positionWS;\r\n    posWS -= u_CurvePivotPoint;\r\n\r\n    vec2 offset = max(vec2(0.0, 0.0), abs(posWS.xz) - vec2(u_CurveBendOffset));\r\n    offset *= step(vec2(0.0, 0.0), posWS.xz) * 2.0 - 1.0;\r\n    offset *= offset;\r\n    float tmp = (u_CurveBendSize * offset.x + u_CurveBendSize * offset.y) * 0.001;\r\n    float reducedPrecisionRes = tmp;\r\n    posWS = vec3(0.0, -reducedPrecisionRes, 0.0);\r\n    softStart -= reducedPrecisionRes;\r\n    softEnd -= reducedPrecisionRes;\r\n\r\n    positionWS += posWS;\r\n}\r\n//#endif\r\n\r\n//#ifdef ZHFOG\r\n//#include "Camera.glsl"\r\nuniform vec4 u_ZHFogParam;\r\nuniform vec4 u_ZHFogColor;\r\n\r\n#define _ZFogStart u_ZHFogParam.x\r\n#define _ZFogEnd u_ZHFogParam.y\r\n#define _HFogStart u_ZHFogParam.z\r\n#define _HFogEnd u_ZHFogParam.w\r\n\r\nvoid GetFogParam(out vec2 fogParam,float positionWSY,vec4 positionCS,vec4 _ProjectionParams)\r\n{\r\n    float UNITY_Z_0_FAR = max(((positionCS.z/_ProjectionParams.y)*_ProjectionParams.z),0.0);\r\n    fogParam.x = saturate(UNITY_Z_0_FAR * -1.0/(_ZFogEnd-_ZFogStart) + _ZFogEnd/(_ZFogEnd - _ZFogStart));\r\n    fogParam.y = positionWSY;\r\n}\r\n\r\nvoid ApplyFog(inout vec3 color,vec2 fogParam)\r\n{\r\n    float per = fogParam.x;  \r\n    float heighPer = saturate((_HFogEnd - fogParam.y) / (_HFogEnd - _HFogStart));\r\n    //float finalPer = mix(saturate(per + heighPer),per * heighPer,u_ZHFogMix) * u_ZHFogColor.a;\r\n    color.rgb = mix(color.rgb,u_ZHFogColor.rgb,saturate(per + heighPer) * u_ZHFogColor.a);\r\n}\r\n\r\n//EffectFog\r\nvoid ApplyFog(inout vec3 color,vec2 fogParam,float alpha,bool receiveFog,bool additiveFog)\r\n{\r\n    float per = fogParam.x;  \r\n    float heighPer = saturate((_HFogEnd - fogParam.y) / (_HFogEnd - _HFogStart));\r\n    //float finalPer = mix(saturate(per + heighPer),per * heighPer,u_ZHFogMix) * u_ZHFogColor.a;\r\n    vec3 fogCol = u_ZHFogColor.rgb;\r\n    if(receiveFog)\r\n    {\r\n        if(additiveFog)\r\n        {\r\n            fogCol *= alpha;\r\n        }\r\n        color.rgb = mix(color.rgb,fogCol,saturate(per + heighPer) * u_ZHFogColor.a);\r\n    }\r\n    else\r\n    {\r\n        color.rgb = color.rgb;\r\n    }\r\n}\r\n\r\n// Perlin噪声函数\r\nfloat noise(vec2 p)\r\n{\r\n    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);\r\n}\r\n\r\nfloat smoothNoise(vec2 p)\r\n{\r\n    vec2 i = floor(p);\r\n    vec2 f = fract(p);\r\n    f = f * f * (3.0 - 2.0 * f);\r\n\r\n    vec2 u = i + vec2(0.0, 0.0);\r\n    vec2 v = i + vec2(1.0, 0.0);\r\n    vec2 w = i + vec2(0.0, 1.0);\r\n    vec2 x = i + vec2(1.0, 1.0);\r\n\r\n    return mix(mix(noise(u), noise(v), f.x), mix(noise(w), noise(x), f.x), f.y);\r\n}\r\n\r\n//非线性插值，解决线性插值的明显突兀\r\nfloat nonlinearSmoothStep(float edge0, float edge1, float x, float exponent)\r\n{\r\n    x = saturate((x - edge0) / (edge1 - edge0));\r\n    return pow(x,exponent) / (pow(x,exponent) + pow(1.0 - x, exponent));\r\n}\r\n\r\n//SoftParticle\r\nuniform float u_SoftParticleStartHeight;\r\nuniform float u_SoftParticleEndHeight;\r\nuniform float u_Softness;\r\nvoid ApplySoftParticle(in vec3 worldPos, inout float alpha)\r\n{   \r\n    bool judge = (worldPos.y > u_SoftParticleStartHeight) && (worldPos.y < u_SoftParticleEndHeight);\r\n    float flag = float(judge);\r\n    float fade = nonlinearSmoothStep(u_SoftParticleStartHeight, u_SoftParticleEndHeight, worldPos.y, u_Softness);\r\n    float resAlpha = saturate(alpha * fade);\r\n    alpha = mix(alpha,resAlpha,flag);\r\n}\r\n\r\nvoid ApplySoftParticleTemp(in vec3 worldPos, inout float alpha, float start,float end, float softness)\r\n{\r\n    bool judge = (worldPos.y > end) && (worldPos.y < start);\r\n    float flag = float(judge);\r\n    float fade = nonlinearSmoothStep(end, start, worldPos.y, softness);\r\n    float resAlpha = saturate(alpha * fade);\r\n    alpha = mix(alpha,resAlpha,flag);\r\n}\r\n\r\n#endif';

  // src/Game/CustomShader/ShaderLibrary/EffectInstanceMap.glsl
  var EffectInstanceMap_default = '#ifndef EFFECTINSTANCE_MAP\r\n#define EFFECTINSTANCE_MAP\r\n\r\n#include "Math.glsl";\r\n\r\nvarying vec4 v_EntityParam1;\r\n//varying vec4 v_EntityParam2;\r\n\r\n#define _DissolveFactor v_EntityParam1.x\r\n#define _DissolveEdge v_EntityParam1.y\r\n#define _RotateAngle v_EntityParam1.z\r\n#define _AnimationSheetProgress v_EntityParam1.w\r\n\r\n//EffectCommonSupport\r\n#ifdef EnableDistort\r\n#define _DistortUVAni _DistortParam.xy\r\n#define _DistortFactor _DistortParam.z\r\n#define _DistortScale _DistortParam.w\r\n#endif\r\n\r\n#ifdef EnableDissolve\r\n#define _DissolveUVAni _DissolveParam.xy\r\n//#define _DissolveFactor v_EntityParam1.x\r\n#define _DissolveSoft _DissolveParam.w\r\n\r\n//#define _DissolveEdge v_EntityParam1.y\r\n#define _DissolveEdgeSoft _DissolveParam2.y\r\n#define _DissolveScale _DissolveParam2.zw\r\n#endif\r\n\r\n#ifdef EnableDistort\r\nvec2 getDistortTexUV(vec2 sourceUV,float uTime)\r\n{\r\n     vec2 result = sourceUV * vec2(_DistortScale);\r\n     result += fract(_DistortUVAni * uTime);\r\n     return result;\r\n}\r\n#endif\r\n\r\n#ifdef EnableDissolve\r\nvec2 getDissolveTexUV(vec2 sourceUV,float uTime)\r\n{\r\n     vec2 result = sourceUV * _DissolveScale;\r\n     result += fract(_DissolveUVAni * uTime);\r\n     return result;\r\n}\r\n#endif\r\n\r\n#ifdef EnableRim\r\n\r\nstruct RimParam \r\n{\r\n    vec3 normalWS;\r\n    vec3 viewDirWS;\r\n    vec4 rimColor;\r\n    float rimArea;\r\n    float rimSoft;\r\n    bool rimReverse;\r\n    bool rimAdditive;\r\n};\r\n\r\nvoid ApplyRim(RimParam rimParam,inout vec3 color,inout float alpha)\r\n{\r\n     float rimEdge = 0.0;\r\n     if(rimParam.rimReverse)\r\n     {\r\n          rimEdge = saturate(abs(dot(rimParam.normalWS,rimParam.viewDirWS)) + rimParam.rimArea);\r\n     }\r\n     else\r\n     {\r\n          rimEdge = saturate(1.0-abs(dot(rimParam.normalWS,rimParam.viewDirWS)) + rimParam.rimArea);\r\n     }\r\n     \r\n     rimEdge = smoothstep(0.5 - rimParam.rimSoft,0.5 + rimParam.rimSoft,rimEdge);\r\n     \r\n     if(rimParam.rimAdditive)\r\n     {\r\n          color.rgb = color.rgb + rimEdge * rimParam.rimColor.rgb * rimParam.rimColor.a;\r\n     }\r\n     else\r\n     {\r\n          color.rgb = mix(color.rgb,rimParam.rimColor.rgb,rimEdge);\r\n     }\r\n     alpha = rimParam.rimAdditive ? saturate(alpha + rimParam.rimColor.a * rimEdge) : mix(alpha,rimParam.rimColor.a,rimEdge);\r\n}\r\n#endif\r\n\r\n//#ifdef VertexAnim\r\n//#define animScale _VertexAnimParam.x\r\n//#define animSpeed _VertexAnimParam.y\r\n//#define animStrength _VertexAnimParam.z\r\n//#define effectDir _VertexAnimParam.w\r\nvoid ApplyVertexAnim(inout vec3 positionOS,float uTime,vec4 vertexAnimParam)\r\n{\r\n     float offset = vertexAnimParam.x * sin(uTime * vertexAnimParam.y + positionOS.y * vertexAnimParam.z);\r\n     if(vertexAnimParam.w == 0.0)\r\n     {\r\n         positionOS.z += offset;\r\n     }\r\n     else\r\n     {\r\n         positionOS.x += offset;\r\n     }\r\n}\r\n//#endif\r\n\r\n#define PI 3.14159265359\r\n		 \r\nvec2 rotateUV(vec2 uv,float angle)\r\n{\r\n     float a = (angle / 180.0) * PI;\r\n     vec2 pivot = vec2(0.5, 0.5);\r\n     float cosAngle = cos(a);\r\n     float sinAngle = sin(a);\r\n     mat2 rot = mat2(cosAngle, -sinAngle, sinAngle, cosAngle);\r\n     uv = (rot * (uv - pivot)).xy + pivot;\r\n     return uv;\r\n}\r\n\r\n#endif';

  // src/Game/CustomShader/ShaderLibrary/PostProcessSupport.glsl
  var PostProcessSupport_default = "#ifndef POSTPROCESS_SUPPORT\r\n#define POSTPROCESS_SUPPORT\r\n\r\nvec3 ApplyVignette(vec3 inputCol, vec2 uv, vec2 center, float intensity, float roundness, float smoothness, vec3 vigColor)\r\n{\r\n    vec2 dist = abs(uv - center) * intensity;\r\n\r\n    dist.x *= roundness;\r\n    float vfactor = pow(saturate(1.0 - dot(dist, dist)), smoothness);\r\n    return inputCol * mix(vigColor, vec3(1.0), vec3(vfactor));\r\n}\r\n\r\n#ifdef GAUSSIAN_BLUR\r\n	const vec4 GaussWeight[7] =\r\n	vec4[](\r\n		vec4(0.0205,0.0205,0.0205,0.0),\r\n		vec4(0.0855,0.0855,0.0855,0.0),\r\n		vec4(0.232,0.232,0.232,0.0),\r\n		vec4(0.324,0.324,0.324,1.0),\r\n		vec4(0.232,0.232,0.232,0.0),\r\n		vec4(0.0855,0.0855,0.0855,0.0),\r\n		vec4(0.0205,0.0205,0.0205,0.0)\r\n	);\r\n#endif\r\n\r\n#endif";

  // src/Game/CustomShader/ShaderLibrary/GlobalShaderInit.ts
  var Shader3D2 = Laya.Shader3D;
  var LayaGL = Laya.LayaGL;
  var Scene3D = Laya.Scene3D;
  var _GlobalShaderInit = class _GlobalShaderInit {
    static Init() {
      if (this.hasInit)
        return;
      this.hasInit = true;
      this.loadLocalCache();
      this.AddInclude();
      this.InitDefine();
      this.InitUniformMap();
    }
    static AddInclude() {
      Shader3D2.addInclude("PostProcessSupport.glsl", PostProcessSupport_default);
      Shader3D2.addInclude("CustomShaderFunctionSupport.glsl", CustomShaderFunctionSupport_default);
      Shader3D2.addInclude("EffectInstanceMap.glsl", EffectInstanceMap_default);
    }
    static InitDefine() {
      this.GaussianBlur = Shader3D2.getDefineByName("GAUSSIAN_BLUR");
      this.PlaneShadowDefine = Shader3D2.getDefineByName("PLANE_SHADOW");
      this.ZHFogDefine = Shader3D2.getDefineByName("ZHFOG");
      this.EnableMask = Shader3D2.getDefineByName("ENABLE_MASK");
      this.AdditiveFog = Shader3D2.getDefineByName("ADDITIVEFOG");
    }
    static InitUniformMap() {
      this.sceneUniformMap = Scene3D.sceneUniformMap = LayaGL.renderOBJCreate.createGlobalUniformMap(this.SCENE_NAME);
    }
    static registerShaderUniform(uniformName, shaderDataType) {
      if (this.sceneUniformMap == null) {
        console.log("Try to register: [" + uniformName + "] but GlobalShaderInit has not Init!");
        return;
      }
      this.sceneUniformMap.addShaderUniform(Shader3D2.propertyNameToID(uniformName), uniformName, shaderDataType);
    }
    static InitScene() {
      if (this.scene == null) {
        this.scene = Laya.stage.getChildByName(this.SCENE_NAME);
      }
      return this.scene != null;
    }
    static getScene() {
      this.InitScene();
      return this.scene;
    }
    static SetGlobalShaderValue(uniformName, shaderDataType, value) {
      if (!this.InitScene())
        return;
      this.scene.setGlobalShaderValue(uniformName, shaderDataType, value);
    }
    static InitShaderPassStates() {
      _GlobalShaderInit.setPostProcessShaderPassState();
    }
    /**
     * 目前后处理只有深度描边，所以这边其实是控制深度写入的pass
     */
    static setPostProcessShaderPassState() {
      if (Laya.Browser.onTTMiniGame || Laya.Browser.onAlipayMiniGame) {
        return;
      }
      const simpleCharacter_UI = Shader3D2.find("SimpleCharacter_UI");
      if (simpleCharacter_UI) {
        RenderHelper.setShaderPassEnable(simpleCharacter_UI, 0, 1, _GlobalShaderInit.postProcessEnable);
      }
      const simpleCharacter = Shader3D2.find("SimpleCharacter");
      if (simpleCharacter) {
        RenderHelper.setShaderPassEnable(simpleCharacter, 0, 2, _GlobalShaderInit.postProcessEnable);
      }
    }
    //影子都从CoreMapCtrl
    static setShadowActive(active) {
      if (active == this.shadowActive) {
        return;
      }
      if (active !== null && active !== void 0) {
        this.shadowActive = active;
      } else {
        this.shadowActive = !this.shadowActive;
      }
      const simpleCharacter = Shader3D2.find("SimpleCharacter");
      const simpleCharacter_Cloud = Shader3D2.find("SimpleCharacter_Cloud");
      const planeShadowMask = Shader3D2.find("PlaneShadowMask");
      RenderHelper.setShaderPassEnable(simpleCharacter, 0, 1, this.shadowActive);
      RenderHelper.setShaderPassEnable(planeShadowMask, 0, 0, this.shadowActive);
      RenderHelper.setShaderPassEnable(simpleCharacter_Cloud, 0, 1, this.shadowActive);
    }
    static set postProcessEnable(bool) {
      _GlobalShaderInit._postProcessEnable = bool;
      _GlobalShaderInit.setPostProcessShaderPassState();
      _GlobalShaderInit.renderCameras.forEach((value) => {
        _GlobalShaderInit.setCameraPostProcess(value);
      });
      RenderHelper.forceCleanRenderTexturePool();
    }
    static get postProcessEnable() {
      return _GlobalShaderInit._postProcessEnable;
    }
    static setCameraPostProcess(renderInfo) {
      let camera = renderInfo.camera;
      let isUI = renderInfo.isUI;
      let rt = renderInfo.img;
      if (!camera) {
        return;
      }
      if (Laya.Browser.onTTMiniGame) {
        return;
      }
      if (Laya.Browser.onAlipayMiniGame) {
        if (camera.postProcess) {
          camera.postProcess.clearEffect();
          camera.postProcess = null;
        }
      } else {
        if (_GlobalShaderInit.postProcessEnable) {
          camera.depthTextureMode = Laya.DepthTextureMode.Depth;
        } else if (camera.postProcess) {
          camera.postProcess.clearEffect();
          camera.postProcess = null;
        }
      }
    }
    static set msaa(bool) {
    }
    static get msaa() {
      return _GlobalShaderInit._msaa;
    }
    static get fxaa() {
      return _GlobalShaderInit._fxaa;
    }
    static set fxaa(bool) {
      _GlobalShaderInit._fxaa = bool;
      Laya.LocalStorage.setItem("GlobalShaderInit_fxaa", String(this._fxaa ? 1 : 0));
      _GlobalShaderInit.renderCameras.forEach((renderInfo) => {
        _GlobalShaderInit.setCameraFXAA(renderInfo);
      });
    }
    static setCameraFXAA(cameraRenderInfo) {
      let camera = cameraRenderInfo.camera;
      if (camera) {
        camera.fxaa = _GlobalShaderInit._fxaa;
      }
    }
    static setCameraMSAA(cameraRenderInfo) {
      let camera = cameraRenderInfo.camera;
      if (camera == null) {
        console.error("Globalshaderinit setCameraMSAA 相机已经被销毁");
        return;
      }
      camera.msaa = _GlobalShaderInit._msaa;
      if (cameraRenderInfo.img && camera.renderTarget) {
        if (cameraRenderInfo.img._graphics == null) {
          console.error("Globalshaderinit setCameraMSAA rt创建失败, 相机渲染模板图片已经被销毁");
          return;
        }
        try {
          let rt = _GlobalShaderInit.createCameraOffScreenRT(camera, cameraRenderInfo.img);
          if (rt == null) {
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
    static loadLocalCache() {
      let fxaaEnable = Laya.LocalStorage.getItem("GlobalShaderInit_fxaa");
      if (fxaaEnable !== null && fxaaEnable !== void 0) {
        _GlobalShaderInit._fxaa = parseInt(fxaaEnable) == 1 ? true : false;
      }
    }
    static createCameraOffScreenRT(camera, img) {
      let rt;
      if (img) {
        rt = Laya.RenderTexture.createFromPool(this.rt_w, this.rt_w, camera._getRenderTextureFormat(), camera.depthTextureFormat, false, camera.msaa ? 4 : 1, false, camera._needRenderGamma(camera._getRenderTextureFormat()));
        ;
        img.texture = new Laya.Texture(rt);
      } else {
        rt = new Laya.RenderTexture(camera.viewport.width, camera.viewport.height, camera._getRenderTextureFormat(), camera.depthTextureFormat, false, 1, false, camera._needRenderGamma(camera._getRenderTextureFormat()));
      }
      rt.lock = true;
      RenderHelper.setRenderTextureParam(rt, true, false);
      return rt;
    }
    /**
     * 
     * @param camera 
     * @param isUI 
     * @param img 传了img代表离屏渲染需要rt
     */
    static registerRenderCamera(camera, isUI = false, img = null) {
      let cameraInfo = {
        camera,
        isUI,
        img
      };
      _GlobalShaderInit.renderCameras.set(camera.id, cameraInfo);
      camera.depthTextureFormat = Laya.RenderTargetFormat.DEPTHSTENCIL_24_8;
      this.setCameraMSAA(cameraInfo);
      this.setCameraFXAA(cameraInfo);
      this.setCameraPostProcess(cameraInfo);
      if (img) {
        camera.renderTarget = _GlobalShaderInit.createCameraOffScreenRT(camera, img);
      }
    }
    static unregisterRenderCamera(camera) {
      if (camera != null) {
        _GlobalShaderInit.renderCameras.delete(camera.id);
      }
    }
  };
  __name(_GlobalShaderInit, "GlobalShaderInit");
  _GlobalShaderInit.rt_w = 1200;
  //Common
  _GlobalShaderInit.CharacterRef = 6;
  _GlobalShaderInit.PlaneShadowRef = 5;
  _GlobalShaderInit.XRayRef = 1;
  _GlobalShaderInit.SCENE_NAME = "Scene3D";
  _GlobalShaderInit.shadowActive = true;
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
  _GlobalShaderInit._postProcessEnable = false;
  _GlobalShaderInit._msaa = false;
  _GlobalShaderInit._fxaa = false;
  _GlobalShaderInit.renderCameras = /* @__PURE__ */ new Map();
  var GlobalShaderInit = _GlobalShaderInit;

  // src/Game/Engine/GlobalShaderSettings/CurveWorldSetting.ts
  var Vector32 = Laya.Vector3;
  var { regClass: regClass2, property: property2 } = Laya;
  var CurveWorldSetting = class {
    constructor() {
      this.Plane = 0;
      this.BlendSize = 6;
      this.BlendOffset = 8;
      this.DitherClipStart = 8;
      this.DitherClipEnd = 9.5;
      this.rayDirection = new Vector32();
      this.intersectionPoint = new Vector32();
    }
    Register() {
      if (!CurveWorldSetting.register) {
        RenderHelper.RegisterGlobalVector3(CurveWorldSetting.u_CurvePivotPoint);
        RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_CurveBendOffset);
        RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_CurveBendSize);
        RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_DitherClipStart);
        RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_DitherClipEnd);
        CurveWorldSetting.register = true;
      }
    }
    SetCamTransform(transform) {
      this.camTransform = transform;
    }
    GetIntersectPosByCamRay() {
      if (!this.camTransform)
        return;
      let rayOrigin = this.camTransform.position;
      this.camTransform.getForward(this.rayDirection);
      let t = (this.Plane - rayOrigin.y) / this.rayDirection.y;
      this.intersectionPoint.setValue(rayOrigin.x + this.rayDirection.x * t, this.Plane, rayOrigin.z + this.rayDirection.z * t);
    }
    RefreshData() {
      RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_CurveBendOffset, this.BlendOffset);
      RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_CurveBendSize, this.BlendSize);
      RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_DitherClipStart, 1 - this.DitherClipStart * 1e-3);
      RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_DitherClipEnd, 1 - this.DitherClipEnd * 1e-3);
    }
    RefreshTarget() {
      RenderHelper.SetGlobalShaderVector3(CurveWorldSetting.u_CurvePivotPoint, this.intersectionPoint);
    }
    max(a, b) {
      return new Laya.Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    abs(v) {
      return new Laya.Vector2(Math.abs(v.x), Math.abs(v.y));
    }
    step(edge, x) {
      return new Laya.Vector2(x.x < edge.x ? 0 : 1, x.y < edge.y ? 0 : 1);
    }
    getCurvedPos(originPos) {
      let posWS = new Laya.Vector3(originPos.x, originPos.y, originPos.z);
      posWS.x -= this.intersectionPoint.x;
      posWS.y -= this.intersectionPoint.y;
      posWS.z -= this.intersectionPoint.z;
      let tmpVector = this.abs(new Laya.Vector2(posWS.x, posWS.z));
      tmpVector.x -= this.BlendOffset;
      tmpVector.y -= this.BlendOffset;
      let offset = this.max(new Laya.Vector2(0, 0), tmpVector);
      let stepResult = this.step(new Laya.Vector2(0, 0), new Laya.Vector2(posWS.x, posWS.z));
      let adjustedOffset = new Laya.Vector2(offset.x * (stepResult.x * 2 - 1), offset.y * (stepResult.y * 2 - 1));
      let squareOffset = new Laya.Vector2(adjustedOffset.x * adjustedOffset.x, adjustedOffset.y * adjustedOffset.y);
      let tmp = (this.BlendSize * squareOffset.x + this.BlendSize * squareOffset.y) * 1e-3;
      let reducedPrecision = tmp;
      posWS.setValue(0, -reducedPrecision, 0);
      let res = new Laya.Vector3(
        originPos.x + posWS.x,
        originPos.y + posWS.y,
        originPos.z + posWS.z
      );
      return res;
    }
  };
  __name(CurveWorldSetting, "CurveWorldSetting");
  CurveWorldSetting.u_CurvePivotPoint = "u_CurvePivotPoint";
  CurveWorldSetting.u_CurveBendOffset = "u_CurveBendOffset";
  CurveWorldSetting.u_CurveBendSize = "u_CurveBendSize";
  CurveWorldSetting.u_DitherClipStart = "u_DitherClipStart";
  CurveWorldSetting.u_DitherClipEnd = "u_DitherClipEnd";
  CurveWorldSetting.register = false;
  __decorateClass([
    property2(Number)
  ], CurveWorldSetting.prototype, "Plane", 2);
  __decorateClass([
    property2(Number)
  ], CurveWorldSetting.prototype, "BlendSize", 2);
  __decorateClass([
    property2(Number)
  ], CurveWorldSetting.prototype, "BlendOffset", 2);
  __decorateClass([
    property2(Number)
  ], CurveWorldSetting.prototype, "DitherClipStart", 2);
  __decorateClass([
    property2(Number)
  ], CurveWorldSetting.prototype, "DitherClipEnd", 2);
  CurveWorldSetting = __decorateClass([
    regClass2("42ef2d25-72bf-4d2b-b4bf-3bfbdd52ddfb", "../src/Game/Engine/GlobalShaderSettings/CurveWorldSetting.ts")
  ], CurveWorldSetting);

  // src/Game/Engine/GlobalShaderSettings/ZHFogSetting.ts
  var { regClass: regClass3, property: property3 } = Laya;
  var Color3 = Laya.Color;
  var Vector42 = Laya.Vector4;
  var ZHFogSetting = class {
    constructor() {
      this.ZHFogColor = new Color3(0, 0, 0, 0);
      this.zhFogParam = new Vector42();
    }
    Register() {
      if (!ZHFogSetting.register) {
        RenderHelper.RegisterGlobalVector4(ZHFogSetting.u_ZHFogParam);
        RenderHelper.RegisterGlobalColor(ZHFogSetting.u_ZHFogColor);
        ZHFogSetting.register = true;
      }
    }
    RefreshData() {
      this.zhFogParam.setValue(this.ZFogStart * 0.01, this.ZFogEnd * 0.01, this.HFogStart, this.HFogEnd);
      RenderHelper.SetGlobalShaderVector4(ZHFogSetting.u_ZHFogParam, this.zhFogParam);
      RenderHelper.SetGlobalShaderColor(ZHFogSetting.u_ZHFogColor, this.ZHFogColor);
    }
  };
  __name(ZHFogSetting, "ZHFogSetting");
  /**
   * X:ZFogStart Y:ZFogEnd Z:HFogStart W:HFogEnd
   */
  ZHFogSetting.u_ZHFogParam = "u_ZHFogParam";
  ZHFogSetting.u_ZHFogColor = "u_ZHFogColor";
  ZHFogSetting.register = false;
  __decorateClass([
    property3(Number)
  ], ZHFogSetting.prototype, "ZFogStart", 2);
  __decorateClass([
    property3(Number)
  ], ZHFogSetting.prototype, "ZFogEnd", 2);
  __decorateClass([
    property3(Color3)
  ], ZHFogSetting.prototype, "ZHFogColor", 2);
  __decorateClass([
    property3(Number)
  ], ZHFogSetting.prototype, "HFogStart", 2);
  __decorateClass([
    property3(Number)
  ], ZHFogSetting.prototype, "HFogEnd", 2);
  ZHFogSetting = __decorateClass([
    regClass3("8816bf65-fd56-4b0a-aa5a-00ca2da6dd98", "../src/Game/Engine/GlobalShaderSettings/ZHFogSetting.ts")
  ], ZHFogSetting);

  // src/Game/Engine/GlobalShaderSettings/PlaneShadowSetting.ts
  var Vector33 = Laya.Vector3;
  var Color4 = Laya.Color;
  var { regClass: regClass4, property: property4 } = Laya;
  var PlaneShadowSetting = class {
    constructor() {
      this.PlaneShadowLightDir = new Vector33(1, 1, 1);
      this.PlaneShadowColor = new Color4(0, 0, 0, 0.4);
      this.PlaneShadowPlane = 0.01;
    }
    Register() {
      if (!PlaneShadowSetting.register) {
        RenderHelper.RegisterGlobalVector3(PlaneShadowSetting.u_PlaneShadowLightDir);
        RenderHelper.RegisterGlobalColor(PlaneShadowSetting.u_PlaneShadowColor);
        RenderHelper.RegisterGlobalFloat(PlaneShadowSetting.u_PlaneShadowPlane);
        PlaneShadowSetting.register = true;
      }
    }
    RefreshData() {
      RenderHelper.SetGlobalShaderVector3(PlaneShadowSetting.u_PlaneShadowLightDir, this.PlaneShadowLightDir);
      RenderHelper.SetGlobalShaderColor(PlaneShadowSetting.u_PlaneShadowColor, this.PlaneShadowColor);
      RenderHelper.SetGlobalShaderFloat(PlaneShadowSetting.u_PlaneShadowPlane, this.PlaneShadowPlane);
    }
  };
  __name(PlaneShadowSetting, "PlaneShadowSetting");
  PlaneShadowSetting.u_PlaneShadowLightDir = "u_PlaneShadowLightDir";
  PlaneShadowSetting.u_PlaneShadowColor = "u_PlaneShadowColor";
  PlaneShadowSetting.u_PlaneShadowPlane = "u_PlaneShadowPlane";
  PlaneShadowSetting.register = false;
  __decorateClass([
    property4(Vector33)
  ], PlaneShadowSetting.prototype, "PlaneShadowLightDir", 2);
  __decorateClass([
    property4(Color4)
  ], PlaneShadowSetting.prototype, "PlaneShadowColor", 2);
  __decorateClass([
    property4(Number)
  ], PlaneShadowSetting.prototype, "PlaneShadowPlane", 2);
  PlaneShadowSetting = __decorateClass([
    regClass4("bfc67126-f8d7-4591-ba32-e5cdad262474", "../src/Game/Engine/GlobalShaderSettings/PlaneShadowSetting.ts")
  ], PlaneShadowSetting);

  // src/Game/Core/Utils/ToolUtil.ts
  var _ToolUtil = class _ToolUtil {
  };
  __name(_ToolUtil, "ToolUtil");
  _ToolUtil.inWeChatPC = false;
  _ToolUtil.miniIOS = false;
  var ToolUtil = _ToolUtil;

  // src/Game/CustomShader/InstanceShader/BakeMeshInstanceVS.vs
  var BakeMeshInstanceVS_default = '#define SHADER_NAME BakeMeshInstance\r\n#include "Camera.glsl";\r\n#include "Sprite3DVertex.glsl";\r\n\r\n//#include "VertexCommon.glsl";\r\n#include "Color.glsl";\r\n#include "CustomShaderFunctionSupport.glsl";\r\nvarying vec4 v_Texcoord0;\r\n\r\n#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n#endif\r\n\r\nvoid main() \r\n{\r\n	//Vertex vertex;\r\n	//getVertexParams(vertex);\r\n	mat4 worldMat = getWorldMatrix();\r\n	vec3 positionWS = (worldMat *vec4(a_Position.xyz, 1.0)).xyz; \r\n//#ifdef CURVE_WORLD\r\n    LittlePlanet_Y_Curve(positionWS);\r\n//#endif\r\n\r\n	gl_Position = getPositionCS(positionWS);\r\n\r\n    vec4 customLightmapScaleOffset;\r\n    #ifdef GPU_INSTANCE\r\n        customLightmapScaleOffset = a_customLightmapScaleOffset;\r\n    #else\r\n        customLightmapScaleOffset = vec4(1,1,0,0);\r\n    #endif\r\n	\r\n    v_Texcoord0.xy = a_Texcoord0.xy;\r\n    #ifdef UV1\r\n    v_Texcoord0.zw = a_Texcoord1.xy * customLightmapScaleOffset.xy + customLightmapScaleOffset.zw;\r\n    #endif\r\n\r\n#ifdef ZHFOG\r\n    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);\r\n#endif\r\n\r\n	gl_Position=remapPositionZ(gl_Position);\r\n}';

  // src/Game/CustomShader/InstanceShader/BakeMeshInstanceFS.fs
  var BakeMeshInstanceFS_default = '#define SHADER_NAME BakeMeshInstance\r\n#include "Color.glsl";\r\n#include "CustomShaderFunctionSupport.glsl";\r\n\r\nvarying vec4 v_Texcoord0;\r\n\r\n#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n#endif\r\n//uniform sampler2D u_AtlasTexture;\r\n\r\nvoid main()\r\n{\r\n    vec2 mainUV = v_Texcoord0.xy;\r\n	vec4 color = texture2D(u_AlbedoTexture,mainUV);\r\n    #ifdef Gamma_u_AlbedoTexture\r\n        color = gammaToLinear(color);\r\n    #endif // Gamma_u_AlbedoTexture\r\n\r\n#ifdef UV1\r\n    vec2 lightmapUV = v_Texcoord0.zw;\r\n    vec4 lightMapCol = texture2D(u_CustomLightMap,lightmapUV);\r\n    #ifdef Gamma_u_CustomLightMap\r\n        lightMapCol = gammaToLinear(lightMapCol);\r\n    #endif // Gamma_u_CustomLightMap\r\n    color.rgb *= pow(lightMapCol.rgb,vec3(u_LightMapContrast)) * u_LightMapHDRScale;\r\n#endif\r\n\r\n// #ifdef DITHER_CLIP\r\n// 	if(GetDitherClip(gl_FragCoord.xyz))\r\n// 	{\r\n// 		discard;\r\n// 	}\r\n// #endif\r\n\r\n#ifdef ZHFOG\r\n    ApplyFog(color.rgb,v_fogParam);\r\n#endif\r\n\r\n    float sceneTintStrength = saturate(u_SceneTintParams.x) * u_SceneTintColor.a;\r\n    float sceneTintDesaturate = step(0.5, u_SceneTintParams.y);\r\n    vec3 sceneTintGray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));\r\n    color.rgb = mix(color.rgb, sceneTintGray, sceneTintDesaturate);\r\n    color.rgb = mix(color.rgb, u_SceneTintColor.rgb, sceneTintStrength * 0.5);\r\n\r\n	gl_FragColor = color;\r\n\r\n    gl_FragColor = outputTransform(gl_FragColor);\r\n}';

  // src/Game/CustomShader/InstanceMaterial/BakeMeshInstanceMaterial.ts
  var Material3 = Laya.Material;
  var VertexMesh2 = Laya.VertexMesh;
  var ShaderDataType3 = Laya.ShaderDataType;
  var Shader3D3 = Laya.Shader3D;
  var SubShader2 = Laya.SubShader;
  var RenderState = Laya.RenderState;
  var Color5 = Laya.Color;
  var Vector43 = Laya.Vector4;
  var _BakeMeshInstanceMaterial = class _BakeMeshInstanceMaterial extends CustomMaterial {
    LoadShader() {
      _BakeMeshInstanceMaterial.InitShader();
      this.setShaderName(_BakeMeshInstanceMaterial.ShaderName);
    }
    static InitShader() {
      if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
        return;
      }
      let attributeMap = {
        "a_Position": [VertexMesh2.MESH_POSITION0, ShaderDataType3.Vector4],
        "a_Texcoord0": [VertexMesh2.MESH_TEXTURECOORDINATE0, ShaderDataType3.Vector2],
        "a_Texcoord1": [VertexMesh2.MESH_TEXTURECOORDINATE1, ShaderDataType3.Vector2],
        "a_WorldMat": [VertexMesh2.MESH_WORLDMATRIX_ROW0, ShaderDataType3.Matrix4x4],
        "a_customLightmapScaleOffset": [VertexMesh2.MESH_CUSTOME0, ShaderDataType3.Vector4]
      };
      let uniformMap = {
        "u_AlbedoTexture": ShaderDataType3.Texture2D,
        "u_CustomLightMap": ShaderDataType3.Texture2D,
        "u_LightMapContrast": ShaderDataType3.Float,
        "u_LightMapHDRScale": ShaderDataType3.Float,
        [_BakeMeshInstanceMaterial.sceneTintColorName]: ShaderDataType3.Color,
        [_BakeMeshInstanceMaterial.sceneTintParamsName]: ShaderDataType3.Vector4
      };
      let shader = Shader3D3.add(this.ShaderName, false, false);
      let subShader = new SubShader2(attributeMap, uniformMap);
      shader.addSubShader(subShader);
      subShader.addShaderPass(BakeMeshInstanceVS_default, BakeMeshInstanceFS_default);
      CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }
    constructor() {
      super();
      this.renderModeSet();
      _BakeMeshInstanceMaterial.sceneTintMaterials.add(this);
      this.RefreshSceneTintData();
    }
    static SetSceneTintData(color, params) {
      if (color) {
        _BakeMeshInstanceMaterial.sceneTintColor.setValue(color.r, color.g, color.b, color.a);
      }
      if (params) {
        _BakeMeshInstanceMaterial.sceneTintParams.setValue(params.x, params.y, params.z, params.w);
      }
      _BakeMeshInstanceMaterial.sceneTintMaterials.forEach((mat) => {
        mat.RefreshSceneTintData();
      });
    }
    destroy() {
      _BakeMeshInstanceMaterial.sceneTintMaterials.delete(this);
      super.destroy();
    }
    RefreshSceneTintData() {
      this.setColor(_BakeMeshInstanceMaterial.sceneTintColorName, _BakeMeshInstanceMaterial.sceneTintColor);
      this.setVector4(_BakeMeshInstanceMaterial.sceneTintParamsName, _BakeMeshInstanceMaterial.sceneTintParams);
    }
    //渲染模式
    renderModeSet() {
      this.alphaTest = false;
      this.renderQueue = Material3.RENDERQUEUE_OPAQUE;
      this.depthWrite = true;
      this.blend = RenderState.BLEND_DISABLE;
      this.cull = RenderState.CULL_BACK;
      this.depthTest = RenderState.DEPTHTEST_LESS;
      this.addDefine(GlobalShaderInit.ZHFogDefine);
      RenderHelper.SetDefaultBlockMat(this);
    }
    SetBakeMainTex(tex) {
      if (tex && !tex._getSource) {
        console.error("SetBakeMainTex error url: " + tex.url);
      }
      this.setTexture(_BakeMeshInstanceMaterial.mainTexName, tex);
    }
    SetBakeLightMap(tex) {
      if (tex && !tex._getSource) {
        console.error("SetBakeLightMap error url: " + tex.url);
      }
      this.setTexture(_BakeMeshInstanceMaterial.lightMapName, tex);
    }
    SetBakeLightMapContrast(val) {
      this.setFloat(_BakeMeshInstanceMaterial.lightMapContrastName, val);
    }
    SetBakeLightMapHDRScale(val) {
      this.setFloat(_BakeMeshInstanceMaterial.lightMapHDRScale, val);
    }
  };
  __name(_BakeMeshInstanceMaterial, "BakeMeshInstanceMaterial");
  _BakeMeshInstanceMaterial.ShaderName = "BakeMeshInstance";
  _BakeMeshInstanceMaterial.mainTexName = "u_AlbedoTexture";
  _BakeMeshInstanceMaterial.lightMapName = "u_CustomLightMap";
  _BakeMeshInstanceMaterial.lightMapContrastName = "u_LightMapContrast";
  _BakeMeshInstanceMaterial.lightMapHDRScale = "u_LightMapHDRScale";
  _BakeMeshInstanceMaterial.sceneTintColorName = "u_SceneTintColor";
  _BakeMeshInstanceMaterial.sceneTintParamsName = "u_SceneTintParams";
  _BakeMeshInstanceMaterial.sceneTintColor = new Color5(0.05, 0.15, 0.45, 1);
  _BakeMeshInstanceMaterial.sceneTintParams = new Vector43();
  _BakeMeshInstanceMaterial.sceneTintMaterials = /* @__PURE__ */ new Set();
  var BakeMeshInstanceMaterial = _BakeMeshInstanceMaterial;

  // src/Game/CustomShader/InstanceShader/SpriteInstanceVS.vs
  var SpriteInstanceVS_default = '#define SHADER_NAME SpriteInstance\r\n#include "Camera.glsl";\r\n#include "Sprite3DVertex.glsl";\r\n#include "Scene.glsl";\r\n//#include "VertexCommon.glsl";\r\n#include "Color.glsl";\r\n#include "CustomShaderFunctionSupport.glsl";\r\nvarying vec4 v_Texcoord0;\r\n\r\n#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n#endif\r\n\r\n//varying vec4 albedo;\r\n\r\nvoid main() \r\n{\r\n	//Vertex vertex;\r\n	//getVertexParams(vertex);\r\n    vec3 vertex = a_Position.xyz;\r\n	mat4 worldMat = getWorldMatrix();\r\n\r\n    vec3 worldPosition = (worldMat *vec4(vertex, 1.0)).xyz; \r\n    // 生成随机偏移量\r\n    float randomSeed = dot(worldPosition.xyz, vec3(12.9898, 78.233, 459.678));\r\n    float randomOffset = fract(sin(randomSeed) * 43758.5453 + cos(randomSeed) * 487.5453);\r\n\r\n    randomOffset = fract(randomOffset + (worldPosition.x + worldPosition.z + worldPosition.y));\r\n\r\n    vec2 noise = vec2(worldPosition.x, worldPosition.z) * 0.1 + u_Time * a_WindParam.y;\r\n    float wave = smoothNoise(noise) * (a_WindParam.x + randomOffset);\r\n\r\n    float heightFactor = vertex.y;\r\n    wave *= saturate(heightFactor - a_WindParam.z);\r\n\r\n    vec3 originalPosition = vertex.xyz;\r\n    vec3 windEffect = vec3(wave * a_WindDirection.x, 0, wave * a_WindDirection.z);\r\n    vertex.xyz = mix(originalPosition, originalPosition + windEffect, a_WindDirection.w);\r\n\r\n	vec3 positionWS = (worldMat *vec4(vertex, 1.0)).xyz; \r\n//#ifdef CURVE_WORLD\r\n    LittlePlanet_Y_Curve(positionWS);\r\n//#endif\r\n\r\n	gl_Position = getPositionCS(positionWS);\r\n\r\n    vec4 spriteUVRect;\r\n    #ifdef GPU_INSTANCE\r\n        spriteUVRect = a_SpriteUVRect;\r\n    #else\r\n        spriteUVRect = vec4(0,0,1,1);\r\n    #endif\r\n	\r\n    v_Texcoord0.xy = a_Texcoord0.xy;\r\n    vec2 rect = spriteUVRect.zw - spriteUVRect.xy;\r\n    v_Texcoord0.zw = rect * a_Texcoord0.xy + spriteUVRect.xy;\r\n    //albedo = a_Color;\r\n\r\n#ifdef ZHFOG\r\n    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);\r\n#endif\r\n\r\n	gl_Position=remapPositionZ(gl_Position);\r\n}';

  // src/Game/CustomShader/InstanceShader/SpriteInstanceFS.fs
  var SpriteInstanceFS_default = '#define SHADER_NAME SpriteInstance\r\n#include "Color.glsl";\r\n#include "CustomShaderFunctionSupport.glsl"\r\n\r\nvarying vec4 v_Texcoord0;\r\n#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n#endif\r\n//uniform sampler2D u_AtlasTexture;\r\n//varying vec4 albedo;\r\n\r\nvoid main()\r\n{\r\n	vec4 color =  texture2D(u_AtlasTexture,v_Texcoord0.zw);\r\n	#ifdef Gamma_u_AtlasTexture\r\n		color = gammaToLinear(color);\r\n	#endif // Gamma_u_AtlasTexture\r\n\r\n#ifdef ALPHATEST\r\n	if(color.a < u_AlphaCutOff)\r\n	{\r\n		discard;\r\n	}\r\n#endif\r\n\r\n// #ifdef DITHER_CLIP\r\n// 	if(GetDitherClip(gl_FragCoord.xyz))\r\n// 	{\r\n// 		discard;\r\n// 	}\r\n// #endif\r\n\r\n#ifdef ZHFOG\r\n    ApplyFog(color.rgb,v_fogParam);\r\n#endif\r\n\r\n	float sceneTintStrength = saturate(u_SceneTintParams.x) * u_SceneTintColor.a;\r\n	float sceneTintDesaturate = step(0.5, u_SceneTintParams.y);\r\n	vec3 sceneTintGray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));\r\n	color.rgb = mix(color.rgb, sceneTintGray, sceneTintDesaturate);\r\n	color.rgb = mix(color.rgb, u_SceneTintColor.rgb, sceneTintStrength * 0.5);\r\n// #ifdef ALPHATEST\r\n// 	gl_FragColor = albedo;\r\n// #else\r\n// 	gl_FragColor = color;\r\n// #endif\r\n	gl_FragColor = color;\r\n    gl_FragColor = outputTransform(gl_FragColor);\r\n}';

  // src/Game/CustomShader/InstanceMaterial/SpriteInstanceMaterial.ts
  var Material4 = Laya.Material;
  var VertexMesh3 = Laya.VertexMesh;
  var ShaderDataType4 = Laya.ShaderDataType;
  var Shader3D4 = Laya.Shader3D;
  var SubShader3 = Laya.SubShader;
  var RenderState2 = Laya.RenderState;
  var Color6 = Laya.Color;
  var Vector44 = Laya.Vector4;
  var _SpriteInstanceMaterial = class _SpriteInstanceMaterial extends CustomMaterial {
    LoadShader() {
      _SpriteInstanceMaterial.InitShader();
      this.setShaderName(_SpriteInstanceMaterial.ShaderName);
    }
    static InitShader() {
      if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
        return;
      }
      let attributeMap = {
        "a_Position": [VertexMesh3.MESH_POSITION0, ShaderDataType4.Vector4],
        "a_Texcoord0": [VertexMesh3.MESH_TEXTURECOORDINATE0, ShaderDataType4.Vector2],
        "a_WorldMat": [VertexMesh3.MESH_WORLDMATRIX_ROW0, ShaderDataType4.Matrix4x4],
        "a_SpriteUVRect": [VertexMesh3.MESH_CUSTOME0, ShaderDataType4.Vector4],
        //'a_Color': [VertexMesh.MESH_CUSTOME1, ShaderDataType.Vector4],
        "a_WindDirection": [VertexMesh3.MESH_CUSTOME1, ShaderDataType4.Vector4],
        "a_WindParam": [VertexMesh3.MESH_CUSTOME2, ShaderDataType4.Vector3]
      };
      let uniformMap = {
        "u_AtlasTexture": ShaderDataType4.Texture2D,
        "u_AlphaCutOff": ShaderDataType4.Float,
        [_SpriteInstanceMaterial.SceneTintColorName]: ShaderDataType4.Color,
        [_SpriteInstanceMaterial.SceneTintParamsName]: ShaderDataType4.Vector4
      };
      let shader = Shader3D4.add("SpriteInstance", false, false);
      let subShader = new SubShader3(attributeMap, uniformMap);
      shader.addSubShader(subShader);
      subShader.addShaderPass(SpriteInstanceVS_default, SpriteInstanceFS_default);
      CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }
    constructor(transparent = false) {
      super();
      this.renderModeSet(transparent);
      _SpriteInstanceMaterial.sceneTintMaterials.add(this);
      this.RefreshSceneTintData();
    }
    static SetSceneTintData(color, params) {
      if (color) {
        _SpriteInstanceMaterial.SceneTintColor.setValue(color.r, color.g, color.b, color.a);
      }
      if (params) {
        _SpriteInstanceMaterial.SceneTintParams.setValue(params.x, params.y, params.z, params.w);
      }
      _SpriteInstanceMaterial.sceneTintMaterials.forEach((mat) => {
        mat.RefreshSceneTintData();
      });
    }
    destroy() {
      _SpriteInstanceMaterial.sceneTintMaterials.delete(this);
      super.destroy();
    }
    RefreshSceneTintData() {
      this.setColor(_SpriteInstanceMaterial.SceneTintColorName, _SpriteInstanceMaterial.SceneTintColor);
      this.setVector4(_SpriteInstanceMaterial.SceneTintParamsName, _SpriteInstanceMaterial.SceneTintParams);
    }
    //渲染模式
    renderModeSet(transparent = false) {
      if (transparent) {
        this.alphaTest = false;
        this.renderQueue = Material4.RENDERQUEUE_TRANSPARENT;
        this.depthWrite = false;
        this.blend = RenderState2.BLEND_ENABLE_ALL;
        this.blendSrc = RenderState2.BLENDPARAM_SRC_ALPHA;
        this.blendDst = RenderState2.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
      } else {
        this.alphaTest = true;
        this.renderQueue = Material4.RENDERQUEUE_ALPHATEST;
        this.depthWrite = true;
        this.blend = RenderState2.BLEND_DISABLE;
        RenderHelper.SetDefaultBlockMat(this);
      }
      this.cull = RenderState2.CULL_BACK;
      this.depthTest = RenderState2.DEPTHTEST_LESS;
      this.addDefine(GlobalShaderInit.ZHFogDefine);
    }
  };
  __name(_SpriteInstanceMaterial, "SpriteInstanceMaterial");
  _SpriteInstanceMaterial.ShaderName = "SpriteInstance";
  _SpriteInstanceMaterial.SceneTintColorName = "u_SceneTintColor";
  _SpriteInstanceMaterial.SceneTintParamsName = "u_SceneTintParams";
  _SpriteInstanceMaterial.SceneTintColor = new Color6(0.05, 0.15, 0.45, 1);
  _SpriteInstanceMaterial.SceneTintParams = new Vector44();
  _SpriteInstanceMaterial.sceneTintMaterials = /* @__PURE__ */ new Set();
  var SpriteInstanceMaterial = _SpriteInstanceMaterial;

  // src/Game/CustomShader/InstanceShader/TrailCommonMaterialVS.vs
  var TrailCommonMaterialVS_default = '#define SHADER_NAME TrailCommon\r\n\r\n#include "Camera.glsl";\r\n#include "Scene.glsl"\r\n#include "CustomShaderFunctionSupport.glsl";\r\n\r\n// Sprite uniform\r\nuniform float u_CurTime;\r\nuniform float u_LifeTime;\r\nuniform vec4 u_WidthCurve[10];\r\nuniform int u_WidthCurveKeyLength;\r\n\r\n//uniform vec2 u_UVAnim;\r\n\r\n#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n#endif\r\n\r\n#ifdef ENABLE_MASK\r\nvarying vec4 v_Texcoord0;\r\n#else\r\nvarying vec2 v_Texcoord0;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n\r\nfloat hermiteInterpolate(float t, float outTangent, float inTangent, float duration, float value1, float value2)\r\n{\r\n    float t2 = t * t;\r\n    float t3 = t2 * t;\r\n    float a = 2.0 * t3 - 3.0 * t2 + 1.0;\r\n    float b = t3 - 2.0 * t2 + t;\r\n    float c = t3 - t2;\r\n    float d = -2.0 * t3 + 3.0 * t2;\r\n    return a * value1 + b * outTangent * duration + c * inTangent * duration + d * value2;\r\n}\r\n\r\nfloat getCurWidth(in float normalizeTime)\r\n{\r\n    float width;\r\n    if (normalizeTime == 0.0)\r\n	{\r\n	    width = u_WidthCurve[0].w;\r\n	}\r\n    else if (normalizeTime >= 1.0)\r\n	{\r\n	    width = u_WidthCurve[u_WidthCurveKeyLength - 1].w;\r\n	}\r\n    else\r\n	{\r\n	    for (int i = 0; i < 10; i++)\r\n		{\r\n		    if (normalizeTime == u_WidthCurve[i].x)\r\n			{\r\n			    width = u_WidthCurve[i].w;\r\n			    break;\r\n			}\r\n\r\n		    vec4 lastFrame = u_WidthCurve[i];\r\n		    vec4 nextFrame = u_WidthCurve[i + 1];\r\n		    if (normalizeTime > lastFrame.x && normalizeTime < nextFrame.x)\r\n			{\r\n			    float duration = nextFrame.x - lastFrame.x;\r\n			    float t = (normalizeTime - lastFrame.x) / duration;\r\n			    float outTangent = lastFrame.z;\r\n			    float inTangent = nextFrame.y;\r\n			    float value1 = lastFrame.w;\r\n			    float value2 = nextFrame.w;\r\n			    width = hermiteInterpolate(t, outTangent, inTangent, duration, value1, value2);\r\n			    break;\r\n			}\r\n		}\r\n	}\r\n    return width;\r\n}\r\n\r\nvoid main()\r\n{\r\n    float normalizeTime = (u_CurTime - a_BirthTime) / u_LifeTime;\r\n\r\n    vec2 sourceUV = vec2(a_Texcoord0X, 1.0 - a_Texcoord0Y) * u_TilingOffset.xy + u_TilingOffset.zw;\r\n    v_Texcoord0.xy = sourceUV + fract(u_UVAnim.xy * u_Time);\r\n#ifdef ENABLE_MASK\r\n    v_Texcoord0.zw = sourceUV;\r\n#endif\r\n\r\n    v_Color = a_Color;\r\n\r\n    vec3 cameraPos = (u_View * a_Position).rgb;\r\n    gl_Position = u_Projection * vec4(cameraPos + a_OffsetVector * getCurWidth(normalizeTime), 1.0);\r\n\r\n    vec3 positionWS = (inverse(u_ViewProjection) *  gl_Position).xyz;\r\n\r\n//#ifdef CURVE_WORLD\r\n    //LittlePlanet_Y_Curve(positionWS);\r\n//#endif\r\n\r\n//    gl_Position = getPositionCS(positionWS);\r\n\r\n#ifdef ZHFOG\r\n    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);\r\n#endif\r\n\r\n    gl_Position = remapPositionZ(gl_Position);\r\n}';

  // src/Game/CustomShader/InstanceShader/TrailCommonMaterialFS.fs
  var TrailCommonMaterialFS_default = '#define SHADER_NAME TrailCommon\r\n\r\n#include "Color.glsl";\r\n#include "Scene.glsl";\r\n#include "CustomShaderFunctionSupport.glsl";\r\n\r\n#ifdef ENABLE_MASK\r\nvarying vec4 v_Texcoord0;\r\n#else\r\nvarying vec2 v_Texcoord0;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n\r\n#ifdef ZHFOG\r\nvarying vec2 v_fogParam;\r\n#endif\r\n\r\nvoid main()\r\n{\r\n    vec4 color = 2.0 * u_MainColor * v_Color;\r\n\r\n//#ifdef MAINTEXTURE\r\n    vec4 mainTextureColor = texture2D(u_MainTexture, v_Texcoord0.xy);\r\n    #ifdef Gamma_u_MainTexture\r\n    mainTextureColor = gammaToLinear(mainTextureColor);\r\n    #endif // Gamma_u_MainTexture\r\n\r\n    color *= mainTextureColor;\r\n//#endif\r\n#ifdef ENABLE_MASK\r\n    vec4 maskCol = texture2D(u_MaskMap, v_Texcoord0.zw);\r\n    color.a *= maskCol.r;\r\n#endif\r\n\r\n#ifdef ZHFOG\r\n        #ifdef ADDITIVEFOG\r\n        ApplyFog(color.rgb,v_fogParam,color.a);\r\n        #else\r\n        ApplyFog(color.rgb,v_fogParam);\r\n        #endif\r\n#endif\r\n\r\n    gl_FragColor = color;\r\n\r\n    gl_FragColor = outputTransform(gl_FragColor);\r\n}\r\n';

  // src/Game/CustomShader/InstanceMaterial/TrailCommonMaterial.ts
  var Material5 = Laya.Material;
  var ShaderDataType5 = Laya.ShaderDataType;
  var Shader3D5 = Laya.Shader3D;
  var SubShader4 = Laya.SubShader;
  var RenderState3 = Laya.RenderState;
  var Color7 = Laya.Color;
  var Vector45 = Laya.Vector4;
  var _TrailCommonMaterial = class _TrailCommonMaterial extends CustomMaterial {
    LoadShader() {
      _TrailCommonMaterial.InitShader();
      this.setShaderName(_TrailCommonMaterial.ShaderName);
    }
    static InitShader() {
      if (CustomMaterial.ShaderDic.get(this.ShaderName)) {
        return;
      }
      let attributeMap = {
        "a_Position": [0, ShaderDataType5.Vector4],
        "a_OffsetVector": [1, ShaderDataType5.Vector3],
        "a_Texcoord0X": [4, ShaderDataType5.Float],
        "a_Texcoord0Y": [3, ShaderDataType5.Float],
        "a_BirthTime": [2, ShaderDataType5.Float],
        "a_Color": [5, ShaderDataType5.Vector4]
      };
      let uniformMap = {
        "u_TilingOffset": ShaderDataType5.Vector4,
        "u_MainTexture": ShaderDataType5.Texture2D,
        "u_MaskMap": ShaderDataType5.Texture2D,
        "u_MainColor": ShaderDataType5.Color,
        "u_UVAnim": ShaderDataType5.Vector2
      };
      let defaultValue = {
        "u_MainColor": Color7.WHITE,
        "u_TilingOffset": new Vector45(1, 1, 0, 0)
      };
      let shader = Shader3D5.add(this.ShaderName, false, false);
      let subShader = new SubShader4(attributeMap, uniformMap, defaultValue);
      shader.addSubShader(subShader);
      subShader.addShaderPass(TrailCommonMaterialVS_default, TrailCommonMaterialFS_default);
      CustomMaterial.ShaderDic.set(this.ShaderName, true);
    }
    constructor(isAdditive) {
      super();
      this.renderModeSet(isAdditive);
    }
    //渲染模式
    renderModeSet(isAdditive) {
      this.cull = RenderState3.CULL_NONE;
      this.alphaTest = false;
      this.depthWrite = false;
      this.renderQueue = Material5.RENDERQUEUE_TRANSPARENT;
      this.blend = RenderState3.BLEND_ENABLE_ALL;
      this.blendSrc = RenderState3.BLENDPARAM_SRC_ALPHA;
      this.blendDst = isAdditive ? RenderState3.BLENDPARAM_ONE : RenderState3.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
      this.addDefine(GlobalShaderInit.ZHFogDefine);
    }
  };
  __name(_TrailCommonMaterial, "TrailCommonMaterial");
  _TrailCommonMaterial.ShaderName = "TrailCommon";
  var TrailCommonMaterial = _TrailCommonMaterial;

  // src/Game/CustomShader/ShaderLibrary/GlobalShaderCompile.ts
  function runCustomShaderCompile() {
    SpriteInstanceMaterial.InitShader();
    BakeMeshInstanceMaterial.InitShader();
    MeshEffectEntityMaterial.InitShader();
    TrailCommonMaterial.InitShader();
  }
  __name(runCustomShaderCompile, "runCustomShaderCompile");

  // src/Game/Engine/Util/TimeUtil.ts
  var _ECSTimeUtil = class _ECSTimeUtil {
    static waitAsync(ms) {
      return new Promise((resolve) => {
        Laya.timer.once(ms, null, resolve);
      });
    }
  };
  __name(_ECSTimeUtil, "ECSTimeUtil");
  var ECSTimeUtil = _ECSTimeUtil;

  // src/Game/Engine/ShaderVariantHelper.ts
  var Shader3D6 = Laya.Shader3D;
  var _ShaderVariantHelper = class _ShaderVariantHelper {
    /** 预加载特效场景依赖的 Shader 资源，避免材质解析时 shader not found */
    static ensureEffectShadersLoaded() {
      if (!this._effectShaderLoadPromise) {
        this._effectShaderLoadPromise = Laya.loader.load(this.effectShaderPaths).then(() => {
        });
      }
      return this._effectShaderLoadPromise;
    }
    static set ignorePreCompile(bool) {
      this._ignorePreCompile = bool;
      Laya.LocalStorage.setItem("ShaderVariant_ignorePreCompile", String(this._ignorePreCompile ? 1 : 0));
    }
    static get ignorePreCompile() {
      return this._ignorePreCompile;
    }
    static loadCacheData() {
      let stringIgnorePreCompile = Laya.LocalStorage.getItem("ShaderVariant_ignorePreCompile");
      if (stringIgnorePreCompile) {
        this._ignorePreCompile = parseInt(stringIgnorePreCompile) == 1 ? true : false;
      } else {
        this._ignorePreCompile = false;
      }
      let stringShaderVariant_Shader3DDebug = Laya.LocalStorage.getItem("ShaderVariant_Shader3DDebug");
      if (stringShaderVariant_Shader3DDebug) {
        Shader3D6.debugMode = parseInt(stringShaderVariant_Shader3DDebug) == 1 ? true : false;
      }
    }
    static initCustomShaders() {
      GlobalShaderInit.Init();
      runCustomShaderCompile();
    }
    static preCompileAllShaderVariant(scene3d) {
      if (!scene3d) {
        return;
      }
      if (this.ignorePreCompile) {
        this.ensureEffectShadersLoaded().then(() => this.initCustomShaders());
        return;
      }
      this.initCustomShaders();
      this.loadCacheData();
      Laya.loader.load(_ShaderVariantHelper.preCompileShaderPrefabPath).then((res) => {
        const prefab = res.create();
        const addPrefab = scene3d.addChild(prefab);
        GlobalShaderInit.InitShaderPassStates();
        Laya.loader.load(_ShaderVariantHelper.shaderCompileFolder + "/" + _ShaderVariantHelper.shaderVariantData_particle_tName).then((res2) => {
          if (res2) {
            _ShaderVariantHelper.shaderVariant = res2.data;
            _ShaderVariantHelper.beginCompile();
          }
          addPrefab == null ? void 0 : addPrefab.destroy();
        });
      });
    }
    static CompileSingleVariant() {
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
      let s;
      if (Shader3D6.debugMode) {
        s = Date.now();
      }
      Shader3D6.compileShaderByDefineNames(datum.shaderName, datum.subShaderIndex, datum.passIndex, datum.defineNames, this.preCompileShaderRenderMap.get(datum.shaderName));
      if (Shader3D6.debugMode) {
        console.log(datum.shaderName + "编译时间：" + (Date.now() - s));
      }
      this.hasCompileVariantIds.push(datum.id);
      if (this.curCompileIndex == this.totalVariantData.length) {
        this.needIdleCompile = false;
        this.isCompileAllOK = true;
        if (Shader3D6.debugMode) {
          console.log("Shader全部编译完成!" + this.curCompileIndex);
        }
      }
    }
    static beginCompile() {
    }
    static CompileShaderVariantDataAsync(variantData, frameCompileNum) {
      return __async(this, null, function* () {
        if (ToolUtil.inWeChatPC) {
          return;
        }
        let index = 0;
        let b = 0;
        for (let datum of variantData) {
          if (this.isCompileAllOK) {
            if (Shader3D6.debugMode) {
              console.log("一阶段编译变体数:" + index);
            }
            return;
          }
          if (!this.checkVariantDatum(datum))
            continue;
          let s;
          if (Shader3D6.debugMode) {
            s = Date.now();
          }
          Shader3D6.compileShaderByDefineNames(datum.shaderName, datum.subShaderIndex, datum.passIndex, datum.defineNames, this.preCompileShaderRenderMap.get(datum.shaderName));
          this.hasCompileVariantIds.push(datum.id);
          if (Shader3D6.debugMode) {
            const e = Date.now() - s;
            b += e;
            console.log("编译时间:" + e);
          }
          yield ECSTimeUtil.waitAsync(300);
          index++;
        }
        if (Shader3D6.debugMode) {
          console.log("一阶段编译变体数:" + index + " 总时间：" + b);
        }
        this.isCompileAllOK = true;
        this.StartLoadingCompile();
        _ShaderVariantHelper.shaderVariant = null;
      });
    }
    /**
     * only use for debug 
     * @param variantData 
     */
    static CompileShaderVariantData(variantData) {
      let index = 0;
      for (let datum of variantData) {
        if (!this.checkVariantDatum(datum))
          continue;
        let s;
        if (Shader3D6.debugMode) {
          s = Date.now();
        }
        Shader3D6.compileShaderByDefineNames(
          datum.shaderName,
          datum.subShaderIndex,
          datum.passIndex,
          datum.defineNames,
          this.preCompileShaderRenderMap.get(datum.shaderName)
        );
        this.hasCompileVariantIds.push(datum.id);
        index++;
        if (Shader3D6.debugMode) {
          console.log("编译时间:" + (Date.now() - s));
        }
      }
      if (Shader3D6.debugMode) {
        console.log("一阶段编译变体数:" + index);
      }
    }
    // 开启Loading编译
    static StartLoadingCompile(time = 20) {
      this.waitTime = time;
      if (ToolUtil.miniIOS) {
        this.waitTime = this.waitTime / 5;
      }
      if (ToolUtil.inWeChatPC || this.isCompileAllOK) {
        return;
      }
      if (!this.needIdleCompile) {
        if (Shader3D6.debugMode) {
          console.log("开启Loading编译");
        }
        this.needIdleCompile = true;
      }
    }
    // 暂停Loading编译
    static StopLoadingCompile() {
      if (ToolUtil.inWeChatPC || this.isCompileAllOK) {
        return;
      }
      if (this.needIdleCompile) {
        if (Shader3D6.debugMode) {
          console.log("暂停Loading编译");
        }
        this.needIdleCompile = false;
      }
    }
    static checkVariantDatum(datum) {
      let pass = true;
      if (_ShaderVariantHelper.ParticleShaderList.indexOf(datum.shaderName) == -1 && datum.defineNames.indexOf("UV") == -1) {
        if (Shader3D6.debugMode) {
          console.log(datum.shaderName + " has wrong setting!!");
        }
        pass = false;
      }
      return pass;
    }
    static onUpdate(dt) {
    }
    static getVariantId(shaderVariant) {
      let id = shaderVariant.shader.name + shaderVariant.subShaderIndex + shaderVariant.passIndex;
      for (let defineName of shaderVariant.defineNames) {
        id += defineName;
      }
      return id;
    }
  };
  __name(_ShaderVariantHelper, "ShaderVariantHelper");
  _ShaderVariantHelper.shaderCompileFolder = "resourcesLib/ShaderCompile";
  _ShaderVariantHelper.shaderVariantData_1Name = "shaderVariantData_1.json";
  //前15分钟变体
  _ShaderVariantHelper.shaderVariantData_particle_1Name = "shaderVariantData_particle_1.json";
  //前15分钟变体
  _ShaderVariantHelper.shaderVariantData_tName = "shaderVariantData_t.json";
  //收集所有的变体
  _ShaderVariantHelper.shaderVariantData_particle_tName = "shaderVariantData_particle_t.json";
  //收集所有的粒子shader变体
  _ShaderVariantHelper.shaderVariantData_sName = "shaderVariantData_s.json";
  //排序后所有的变体
  _ShaderVariantHelper.preCompileShaderPrefabName = "preCompileShaderPrefab.lh";
  _ShaderVariantHelper.shaderVariantData_1Path = _ShaderVariantHelper.shaderCompileFolder + "/" + _ShaderVariantHelper.shaderVariantData_1Name;
  //前15分钟变体路径
  _ShaderVariantHelper.shaderVariantData_tPath = _ShaderVariantHelper.shaderCompileFolder + "/" + _ShaderVariantHelper.shaderVariantData_tName;
  //收集所有的变体路径
  _ShaderVariantHelper.shaderVariantData_sPath = _ShaderVariantHelper.shaderCompileFolder + "/" + _ShaderVariantHelper.shaderVariantData_sName;
  //排序后所有的变体路径
  _ShaderVariantHelper.preCompileShaderPrefabPath = _ShaderVariantHelper.shaderCompileFolder + "/" + _ShaderVariantHelper.preCompileShaderPrefabName;
  _ShaderVariantHelper.preCompileShaderList = [
    "SceneEffectCommon",
    "CurveMap",
    "ParticleEffectCommon",
    "SimpleCharacter",
    "SimpleCharacter_Effect",
    "SimpleCharacter_Cloud",
    "MeshEffectEntity",
    "BakeMeshInstance",
    "SpriteInstance"
  ];
  _ShaderVariantHelper.ParticleShaderList = ["ParticleEffectCommon"];
  _ShaderVariantHelper.effectShaderPaths = [
    "resourcesLib/Shader/SceneEffectCommon.shader",
    "resourcesLib/Shader/ParticleEffectCommon.shader",
    "resourcesLib/Shader/CurveMap.shader"
  ];
  _ShaderVariantHelper._ignorePreCompile = null;
  _ShaderVariantHelper.hasCompileVariantIds = [];
  _ShaderVariantHelper.needIdleCompile = false;
  //是否需要进行空闲编译
  _ShaderVariantHelper.isCompileAllOK = false;
  //是否全部Shader编译完成
  _ShaderVariantHelper.waitTime = 500;
  _ShaderVariantHelper.passTime = 0;
  _ShaderVariantHelper.curCompileIndex = 0;
  /**
   * 临时处理，防止：baseRender和shader不匹配导致编译时commonmap有问题
   * 发现有存在shader对应的render组件不同，所以需要静态数据向上兼容 e.g. 11000003_1 && 91000001
   * 引擎版本变化可能导致这里配置需要变化,详见：BaseRender._getcommonUniformMap()
   */
  _ShaderVariantHelper.preCompileShaderRenderMap = /* @__PURE__ */ new Map();
  (() => {
    let SimpleSkinnedMeshRenderer = new Array("Sprite3D", "SimpleSkinnedMesh");
    let TrailRenderer = new Array("Sprite3D", "TrailRender");
    let ShurikenParticleRenderer = new Array("Sprite3D", "ShurikenSprite3D");
    let BaseRender = new Array("Sprite3D");
    _ShaderVariantHelper.preCompileShaderRenderMap.set("SimpleCharacter_Cloud", SimpleSkinnedMeshRenderer);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("SimpleCharacter", SimpleSkinnedMeshRenderer);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("SimpleCharacter_Effect", SimpleSkinnedMeshRenderer);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("SceneEffectCommon", BaseRender);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("CurveMap", BaseRender);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("ParticleEffectCommon", ShurikenParticleRenderer);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("PARTICLESHURIKEN", ShurikenParticleRenderer);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("MeshEffectEntity", BaseRender);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("BakeMeshInstance", BaseRender);
    _ShaderVariantHelper.preCompileShaderRenderMap.set("SpriteInstance", BaseRender);
  })();
  var ShaderVariantHelper = _ShaderVariantHelper;

  // src/Game/Engine/GlobalShaderSettings/BGCtrlSetting.ts
  var { regClass: regClass5, property: property5 } = Laya;
  var BGCtrlSetting = class {
    constructor() {
      this.zFactor = 0.3;
      this.yFactor = 0.3;
      this.zStart = 2;
    }
  };
  __name(BGCtrlSetting, "BGCtrlSetting");
  __decorateClass([
    property5(Number)
  ], BGCtrlSetting.prototype, "zFactor", 2);
  __decorateClass([
    property5(Number)
  ], BGCtrlSetting.prototype, "yFactor", 2);
  __decorateClass([
    property5(Number)
  ], BGCtrlSetting.prototype, "zStart", 2);
  BGCtrlSetting = __decorateClass([
    regClass5("4388f388-9adc-47af-a795-086c81cfd349", "../src/Game/Engine/GlobalShaderSettings/BGCtrlSetting.ts")
  ], BGCtrlSetting);

  // src/Game/Engine/GlobalShaderSettings/SceneTintSetting.ts
  var { regClass: regClass6, property: property6 } = Laya;
  var Color8 = Laya.Color;
  var Vector46 = Laya.Vector4;
  var SceneTintSetting = class {
    constructor() {
      this.SceneTintColor = new Color8(0.05, 0.15, 0.45, 1);
      this.SceneTintIntensity = 0;
      this.SceneTintDesaturate = 0;
      this.sceneTintParams = new Vector46();
    }
    Register() {
      if (!SceneTintSetting.register) {
        RenderHelper.RegisterGlobalColor(SceneTintSetting.u_SceneTintColor);
        RenderHelper.RegisterGlobalVector4(SceneTintSetting.u_SceneTintParams);
        SceneTintSetting.register = true;
      }
    }
    SetSceneTint(color, intensity, desaturate = 0) {
      if (color) {
        this.SceneTintColor.setValue(color.r, color.g, color.b, color.a);
      }
      this.SceneTintIntensity = intensity;
      this.SceneTintDesaturate = desaturate;
      this.RefreshData();
    }
    GetSceneTintColor() {
      return this.SceneTintColor;
    }
    RefreshData() {
      this.sceneTintParams.setValue(this.SceneTintIntensity, this.SceneTintDesaturate, 0, 0);
      RenderHelper.SetGlobalShaderColor(SceneTintSetting.u_SceneTintColor, this.SceneTintColor);
      RenderHelper.SetGlobalShaderVector4(SceneTintSetting.u_SceneTintParams, this.sceneTintParams);
      SpriteInstanceMaterial.SetSceneTintData(this.SceneTintColor, this.sceneTintParams);
      BakeMeshInstanceMaterial.SetSceneTintData(this.SceneTintColor, this.sceneTintParams);
    }
  };
  __name(SceneTintSetting, "SceneTintSetting");
  SceneTintSetting.u_SceneTintColor = "u_SceneTintColor";
  SceneTintSetting.u_SceneTintParams = "u_SceneTintParams";
  SceneTintSetting.register = false;
  __decorateClass([
    property6(Color8)
  ], SceneTintSetting.prototype, "SceneTintColor", 2);
  __decorateClass([
    property6(Number)
  ], SceneTintSetting.prototype, "SceneTintIntensity", 2);
  __decorateClass([
    property6(Number)
  ], SceneTintSetting.prototype, "SceneTintDesaturate", 2);
  SceneTintSetting = __decorateClass([
    regClass6("a70f809c-461f-4099-931c-194c09f73f30", "../src/Game/Engine/GlobalShaderSettings/SceneTintSetting.ts")
  ], SceneTintSetting);

  // src/Game/Engine/GlobalShaderData.ts
  var { regClass: regClass7, property: property7 } = Laya;
  var GlobalShaderData = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.AutoFresh = false;
      this.curveWorldSetting = new CurveWorldSetting();
      this.zhFogSetting = new ZHFogSetting();
      this.planeShadowSetting = new PlaneShadowSetting();
      this.bgCtrlSetting = new BGCtrlSetting();
      this.sceneTintSetting = new SceneTintSetting();
      this._lastPlane = 0;
      this._lastBlendSize = 0;
      this._lastBlendOffset = 0;
      this._lastDitherClipStart = 0;
      this._lastDitherClipEnd = 0;
    }
    get camera() {
      return this._camera;
    }
    setCamera(camera) {
      this._camera = camera;
      this._hasInit = GlobalShaderData.instance == this;
      this.curveWorldSetting.SetCamTransform(this._camera.transform);
    }
    /**
     * 获取单例
     */
    static getInstance() {
      return this.instance;
    }
    static setInstance(globalShaderData, NeedInit = true) {
      this.instance = globalShaderData;
      if (NeedInit)
        this.instance.Init();
    }
    Init() {
      if (GlobalShaderData.getInstance() != null && GlobalShaderData.getInstance() !== this) {
        console.log("GlobalShaderData has an Instance!");
        return;
      }
      GlobalShaderData.setInstance(this, false);
      GlobalShaderInit.Init();
      this.curveWorldSetting.Register();
      this.zhFogSetting.Register();
      this.planeShadowSetting.Register();
      this.sceneTintSetting.Register();
      if (!this.meshEffectInstanceMgr)
        this.meshEffectInstanceMgr = new MeshEffectInstanceMgr();
      ShaderVariantHelper.preCompileAllShaderVariant(this.owner.scene);
    }
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake() {
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
    RefreshByCamMove() {
      if (!this._hasInit)
        return;
      this.curveWorldSetting.GetIntersectPosByCamRay();
      this.curveWorldSetting.RefreshTarget();
    }
    RefreshShaderData() {
      if (!this._hasInit)
        return;
      this.curveWorldSetting.RefreshData();
      this.zhFogSetting.RefreshData();
      this.planeShadowSetting.RefreshData();
      this.sceneTintSetting.RefreshData();
    }
    SetCurveWorldData(plane, bS, bO, DCS, DCE) {
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
    SetZHFogData(ZS, ZE, ZCol, HS, HE) {
      this.zhFogSetting.ZFogStart = ZS;
      this.zhFogSetting.ZFogEnd = ZE;
      this.zhFogSetting.ZHFogColor = ZCol;
      this.zhFogSetting.HFogStart = HS;
      this.zhFogSetting.HFogEnd = HE;
    }
    SetPlaneShadowData(dir, plCol, plane) {
      this.planeShadowSetting.PlaneShadowLightDir = dir;
      this.planeShadowSetting.PlaneShadowColor = plCol;
      this.planeShadowSetting.PlaneShadowPlane = plane;
    }
    SetSceneTintData(color, intensity, desaturate = 0) {
      this.sceneTintSetting.SetSceneTint(color, intensity, desaturate);
    }
    GetSceneTintColor() {
      return this.sceneTintSetting.GetSceneTintColor();
    }
    SetBGCtrlData(yFactor, zFactor, zStart) {
      if (yFactor !== null && yFactor !== void 0) {
        this.bgCtrlSetting.yFactor = yFactor;
      }
      if (zFactor !== null && zFactor !== void 0) {
        this.bgCtrlSetting.zFactor = zFactor;
      }
      if (zStart !== null && zStart !== void 0) {
        this.bgCtrlSetting.zStart = zStart;
      }
    }
    clearRenderSource() {
    }
    onDestroy() {
      if (!this._hasInit)
        return;
    }
  };
  __name(GlobalShaderData, "GlobalShaderData");
  __decorateClass([
    property7({ type: Boolean, tips: "每帧刷新参数,用于美术调试,默认请关闭" })
  ], GlobalShaderData.prototype, "AutoFresh", 2);
  __decorateClass([
    property7(CurveWorldSetting)
  ], GlobalShaderData.prototype, "curveWorldSetting", 2);
  __decorateClass([
    property7(ZHFogSetting)
  ], GlobalShaderData.prototype, "zhFogSetting", 2);
  __decorateClass([
    property7(PlaneShadowSetting)
  ], GlobalShaderData.prototype, "planeShadowSetting", 2);
  __decorateClass([
    property7(BGCtrlSetting)
  ], GlobalShaderData.prototype, "bgCtrlSetting", 2);
  __decorateClass([
    property7(SceneTintSetting)
  ], GlobalShaderData.prototype, "sceneTintSetting", 2);
  GlobalShaderData = __decorateClass([
    regClass7("bba16cc9-cbfb-42da-8b10-d73509c1049d", "../src/Game/Engine/GlobalShaderData.ts")
  ], GlobalShaderData);

  // src/Game/Engine/CommandBufferDrawMgr/MeshEffectInstance.ts
  var CommandBuffer = Laya.CommandBuffer;
  var CameraEventFlags = Laya.CameraEventFlags;
  var { regClass: regClass8, property: property8 } = Laya;
  var MeshEffectInstance = class extends Laya.Script {
    // @property(AnimationClip)
    // public animationClip:AnimationClip;
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake() {
      if (Laya.LayaGL.renderEngine.getCapable(Laya.RenderCapable.DrawElement_Instance)) {
        let cmdInstance = MeshEffectInstanceMgr.renderDic.get(this.MeshEffectID);
        if (cmdInstance) {
          cmdInstance.InitCommandEntity(this.owner, null, true);
        } else {
          cmdInstance = new MeshEffectCMDInstance(this.MeshEffectID);
          if (!GlobalShaderData.getInstance()) {
            return;
          }
          cmdInstance.SetCamera(GlobalShaderData.getInstance().camera);
          cmdInstance.InitCommandEntity(this.owner, null, true);
          MeshEffectInstanceMgr.renderDic.set(this.MeshEffectID, cmdInstance);
        }
        this.cmdInstance = cmdInstance;
      }
    }
    onDestroy() {
      var _a;
      (_a = this.cmdInstance) == null ? void 0 : _a.reduceRefCount();
    }
  };
  __name(MeshEffectInstance, "MeshEffectInstance");
  __decorateClass([
    property8(String)
  ], MeshEffectInstance.prototype, "MeshEffectID", 2);
  MeshEffectInstance = __decorateClass([
    regClass8("dbb375be-7761-41a1-9cdb-f088526a0b3c", "../src/Game/Engine/CommandBufferDrawMgr/MeshEffectInstance.ts")
  ], MeshEffectInstance);
  var _MeshEffectCMDInstance = class _MeshEffectCMDInstance {
    constructor(id) {
      this._renderEmpty = false;
      this.refCount = 0;
      this._commandEntityDic = /* @__PURE__ */ new Map();
      this.onShowEffect = false;
      this.MeshEffectID = id;
      this.commandBuffer = new CommandBuffer(id);
    }
    get renderEmpty() {
      return this._renderEmpty;
    }
    reduceRefCount() {
      if (this.refCount == 0)
        return;
      this.refCount--;
      if (this.refCount < 1) {
        this._renderEmpty = true;
        this.hideEffect();
        this.commandBuffer.clear();
        this._commandEntityDic.forEach((value) => {
          value.clearRenderData();
        });
        this._commandEntityDic.clear();
        MeshEffectInstanceMgr.renderDic.delete(this.MeshEffectID);
      }
    }
    SetCamera(camera) {
      this.camera = camera;
    }
    InitCommandEntity(owner, idStr, isRootNode = false) {
      if (isRootNode)
        this.refCount++;
      if (owner.numChildren > 0) {
        for (let i = 0; i < owner.numChildren; i++) {
          let child = owner.getChildAt(i);
          let entity = child.getComponent(MeshEffectEntity);
          let curIdStr = isRootNode ? child.name : idStr + "/" + child.name;
          if (entity) {
            let commandEntity = this._commandEntityDic.get(curIdStr);
            if (!commandEntity) {
              commandEntity = entity.SetEntityFirst(curIdStr, commandEntity, this.commandBuffer);
              if (commandEntity) {
                this._commandEntityDic.set(curIdStr, commandEntity);
              }
            } else {
              entity.SetEntity(curIdStr, commandEntity);
            }
          }
          if (child.numChildren > 0) {
            this.InitCommandEntity(child, curIdStr, false);
          }
        }
      }
    }
    showEffect() {
      if (this.onShowEffect || !this.camera)
        return;
      this.camera = GlobalShaderData.getInstance().camera;
      this.camera.addCommandBuffer(CameraEventFlags.BeforeTransparent, this.commandBuffer);
      this.onShowEffect = true;
    }
    hideEffect() {
      if (!this.onShowEffect || !this.camera)
        return;
      this.camera.removeCommandBuffer(CameraEventFlags.BeforeTransparent, this.commandBuffer);
      this.onShowEffect = false;
    }
    refreshCommandEntityMatrices() {
      this._renderEmpty = true;
      this._commandEntityDic.forEach((value) => {
        if (!value.renderEmpty) {
          value.refreshCommandMatrices();
          this._renderEmpty = false;
        }
      });
      if (this._renderEmpty) {
        this.hideEffect();
      } else {
        this.showEffect();
      }
    }
  };
  __name(_MeshEffectCMDInstance, "MeshEffectCMDInstance");
  var MeshEffectCMDInstance = _MeshEffectCMDInstance;

  // src/Game/Engine/Editor/EditorSceneSet.ts
  var Camera = Laya.Camera;
  var { regClass: regClass9, property: property9 } = Laya;
  var EditorSceneSet = class extends Laya.Script {
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake() {
      return __async(this, null, function* () {
        console.error("当前引擎版本" + Laya.LayaEnv.version + "，粒子制作时建议用原版");
        ShaderVariantHelper.ignorePreCompile = true;
        yield ShaderVariantHelper.ensureEffectShadersLoaded();
        if (!this.camera) {
          Debug.LogError("请拖拽Camera组件到EditorSceneSet!  挂载点:" + Debug.getNodePath(this.owner));
          return;
        }
        if (this.camera.renderTarget != null) {
          RenderHelper.setRenderTextureParam(this.camera.renderTarget, true, false);
        }
        let globalShaderData = this.owner.getComponent(GlobalShaderData);
        if (!globalShaderData) {
          globalShaderData = this.owner.addComponent(GlobalShaderData);
        }
        globalShaderData.AutoFresh = true;
        Laya.timer.callLater(this, () => {
          var _a;
          (_a = GlobalShaderData.getInstance()) == null ? void 0 : _a.setCamera(this.camera);
        });
      });
    }
  };
  __name(EditorSceneSet, "EditorSceneSet");
  __decorateClass([
    property9(Camera)
  ], EditorSceneSet.prototype, "camera", 2);
  EditorSceneSet = __decorateClass([
    regClass9("d85aaf4e-626d-4987-b47a-1cf48232ec95", "../src/Game/Engine/Editor/EditorSceneSet.ts")
  ], EditorSceneSet);

  // src/Game/Engine/Editor/EditorShowMEEntity.ts
  var LayaEnv = Laya.LayaEnv;
  var MeshRenderer = Laya.MeshRenderer;
  var Color9 = Laya.Color;
  var Vector47 = Laya.Vector4;
  var MeshFilter = Laya.MeshFilter;
  var { regClass: regClass10, property: property10, runInEditor } = Laya;
  var EditorShowMEEntity = class extends Laya.Script {
    onEnable() {
      if (LayaEnv.isPlaying) {
      }
    }
    onLateUpdate() {
      const entity = this.owner.getComponent(MeshEffectEntity);
      if (!entity || !entity.paramMaterial || !entity.mesh)
        return;
      this.renderer = this.owner.getComponent(MeshRenderer);
      if (!this.renderer) {
        this.renderer = this.owner.addComponent(MeshRenderer);
      }
      this.renderer.sharedMaterial = entity.paramMaterial;
      this.filter = this.owner.getComponent(MeshFilter);
      if (!this.filter) {
        this.filter = this.owner.addComponent(MeshFilter);
      }
      this.filter.sharedMesh = entity.mesh;
      if (LayaEnv.isPlaying) {
        this.renderer.enabled = false;
        return;
      }
      const mat = this.renderer.sharedMaterial;
      const col = new Color9(
        Color9.linearToGammaSpace(entity.EntityColor.x),
        Color9.linearToGammaSpace(entity.EntityColor.y),
        Color9.linearToGammaSpace(entity.EntityColor.z),
        entity.EntityColor.w
      );
      mat.setColor("u_AlbedoColor", col);
      let tilingOffset = mat.getVector4("u_TilingOffset");
      const u_TilingOffset = new Vector47(
        tilingOffset ? tilingOffset.x : 1,
        tilingOffset ? tilingOffset.y : 1,
        entity.EntityTilingOffset.x,
        entity.EntityTilingOffset.y
      );
      mat.setVector4("u_TilingOffset", u_TilingOffset);
      let maskTilingOffset = mat.getVector4("_MaskTilingOffset");
      const _MaskTilingOffset = new Vector47(
        maskTilingOffset ? maskTilingOffset.x : 1,
        maskTilingOffset ? maskTilingOffset.y : 1,
        entity.EntityTilingOffset.z,
        entity.EntityTilingOffset.w
      );
      mat.setVector4("_MaskTilingOffset", _MaskTilingOffset);
      let dissolveParam = mat.getVector4("_DissolveParam");
      const _DissolveParam = new Vector47(
        dissolveParam ? dissolveParam.x : 0,
        dissolveParam ? dissolveParam.y : 0,
        entity.EntityParam1.x,
        dissolveParam ? dissolveParam.w : 0.5
      );
      mat.setVector4("_DissolveParam", _DissolveParam);
      let dissolveParam2 = mat.getVector4("_DissolveParam2");
      const _DissolveParam2 = new Vector47(
        entity.EntityParam1.y,
        dissolveParam2 ? dissolveParam2.y : 0,
        dissolveParam2 ? dissolveParam2.z : 1,
        dissolveParam2 ? dissolveParam2.w : 1
      );
      mat.setVector4("_DissolveParam2", _DissolveParam2);
      let AlbedoTextureUVAnim = mat.getVector4("_AlbedoTextureUVAnim");
      const _AlbedoTextureUVAnim = new Vector47(
        AlbedoTextureUVAnim ? AlbedoTextureUVAnim.x : 0,
        AlbedoTextureUVAnim ? AlbedoTextureUVAnim.y : 0,
        entity.EntityParam1.z,
        AlbedoTextureUVAnim ? AlbedoTextureUVAnim.w : 0
      );
      mat.setVector4("_AlbedoTextureUVAnim", _AlbedoTextureUVAnim);
      mat.setFloat("u_SheetProgress", entity.EntityParam1.w);
    }
    onDisable() {
      var _a, _b;
      if (LayaEnv.isPlaying) {
        return;
      }
      (_a = this.renderer) == null ? void 0 : _a.destroy();
      (_b = this.filter) == null ? void 0 : _b.destroy();
    }
  };
  __name(EditorShowMEEntity, "EditorShowMEEntity");
  EditorShowMEEntity = __decorateClass([
    regClass10("5c70f482-14ad-4306-9049-94b664beeb47", "../src/Game/Engine/Editor/EditorShowMEEntity.ts"),
    runInEditor
  ], EditorShowMEEntity);

  // src/Game/Engine/Editor/EditorShowMEInstance.ts
  var LayaEnv2 = Laya.LayaEnv;
  var MeshRenderer2 = Laya.MeshRenderer;
  var MeshFilter2 = Laya.MeshFilter;
  var { regClass: regClass11, property: property11, runInEditor: runInEditor2 } = Laya;
  var EditorShowMEInstance = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.autoSetInstance = false;
      this.editorShowEntitys = [];
    }
    onEnable() {
      if (LayaEnv2.isPlaying) {
        return;
      }
      if (!this.owner.getComponent(MeshEffectInstance))
        return;
      const entitys = RenderHelper.GetComponentsInChild(this.owner, MeshEffectEntity);
      this.editorShowEntitys = [];
      for (let entity of entitys) {
        let edEntity = entity.owner.getComponent(EditorShowMEEntity);
        if (!edEntity) {
          edEntity = entity.owner.addComponent(EditorShowMEEntity);
        }
        this.editorShowEntitys.push(edEntity);
      }
    }
    onUpdate() {
      if (!this.autoSetInstance)
        return;
      this.setChildInstance();
      this.autoSetInstance = false;
    }
    setChildInstance() {
      if (!this.owner.getComponent(MeshEffectInstance))
        this.owner.addComponent(MeshEffectInstance);
      const renderers = RenderHelper.GetComponentsInChild(this.owner, MeshRenderer2);
      for (const renderer of renderers) {
        const filter = renderer.owner.getComponent(MeshFilter2);
        if (!renderer.sharedMaterial || !filter || !filter.sharedMesh) {
          console.error(renderer.owner.name + " 物体组件信息有误！");
          continue;
        }
        let entity = renderer.owner.getComponent(MeshEffectEntity);
        if (!entity)
          entity = renderer.owner.addComponent(MeshEffectEntity);
        entity.mesh = filter.sharedMesh;
        entity.paramMaterial = renderer.sharedMaterial;
        MeshEffectEntityMaterial.getDefaultParam(entity.paramMaterial, entity.EntityColor, entity.EntityTilingOffset, entity.EntityParam1);
      }
      this.onEnable();
    }
    onDisable() {
      if (LayaEnv2.isPlaying) {
        return;
      }
      this.editorShowEntitys.forEach((value) => {
        value == null ? void 0 : value.destroy();
      });
    }
  };
  __name(EditorShowMEInstance, "EditorShowMEInstance");
  __decorateClass([
    property11({ type: Boolean, caption: "自动添加套件" })
  ], EditorShowMEInstance.prototype, "autoSetInstance", 2);
  EditorShowMEInstance = __decorateClass([
    regClass11("6bdf3cdf-c394-40e7-ac0f-cb485127d221", "../src/Game/Engine/Editor/EditorShowMEInstance.ts"),
    runInEditor2
  ], EditorShowMEInstance);

  // src/Game/Engine/PostProcess/PostProcessFullScreenTintMgr.ts
  var Color10 = Laya.Color;
  var _PostProcessFullScreenTintMgr = class _PostProcessFullScreenTintMgr {
    constructor() {
      this.Enable = false;
      this.TintColor = new Color10(0.05, 0.15, 0.45, 1);
      this.Intensity = 1;
      this.FadeInTime = 0.5;
      this.FadeOutTime = 0.5;
      this._currentIntensity = 0;
      this._targetIntensity = 0;
      this._desaturate = 0;
    }
    Play(color = null, fadeTime = 0.5, intensity = 1) {
      this.SetEnable(true, color, fadeTime, intensity);
    }
    SetEnable(enable, color = null, fadeTime = -1, intensity = -1) {
      var _a;
      this.Enable = enable;
      if (!color && enable) {
        color = (_a = GlobalShaderData.getInstance()) == null ? void 0 : _a.GetSceneTintColor();
      }
      if (color) {
        this.TintColor.setValue(color.r, color.g, color.b, color.a);
      }
      if (intensity >= 0) {
        this.Intensity = intensity;
      }
      this._targetIntensity = enable ? this.Intensity : 0;
      if (fadeTime >= 0) {
        if (enable) {
          this.FadeInTime = fadeTime;
        } else {
          this.FadeOutTime = fadeTime;
        }
      }
    }
    Stop(fadeTime = -1) {
      if (fadeTime >= 0) {
        this.FadeOutTime = fadeTime;
      }
      this.Enable = false;
      this._targetIntensity = 0;
      this.SetDesaturate(false);
    }
    SetDesaturate(enable) {
      this._desaturate = enable ? 1 : 0;
      this.RefreshShaderData();
    }
    Update(deltaTime) {
      this.updateTint(deltaTime * 1e-3);
      this.RefreshShaderData();
    }
    updateTint(deltaTime) {
      this._targetIntensity = this.Enable ? this.Intensity : 0;
      this.updateIntensity(deltaTime);
    }
    updateIntensity(deltaTime) {
      if (this._currentIntensity === this._targetIntensity)
        return;
      let fadeTime = this._targetIntensity > this._currentIntensity ? this.FadeInTime : this.FadeOutTime;
      if (fadeTime <= 0) {
        this._currentIntensity = this._targetIntensity;
        return;
      }
      let step = deltaTime / fadeTime;
      if (this._targetIntensity > this._currentIntensity) {
        this._currentIntensity = Math.min(this._currentIntensity + step, this._targetIntensity);
      } else {
        this._currentIntensity = Math.max(this._currentIntensity - step, this._targetIntensity);
      }
    }
    RefreshShaderData() {
      var _a;
      (_a = GlobalShaderData.getInstance()) == null ? void 0 : _a.SetSceneTintData(this.TintColor, this._currentIntensity, this._desaturate);
    }
  };
  __name(_PostProcessFullScreenTintMgr, "PostProcessFullScreenTintMgr");
  var PostProcessFullScreenTintMgr = _PostProcessFullScreenTintMgr;

  // src/Game/Engine/Editor/PhoneTestBtn.ts
  var Button = Laya.Button;
  var Handler = Laya.Handler;
  var Sprite3D = Laya.Sprite3D;
  var Vector34 = Laya.Vector3;
  var Color11 = Laya.Color;
  var Text = Laya.Text;
  var { regClass: regClass12, property: property12 } = Laya;
  var PhoneTestBtn = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.urls = [];
      this.createPos = new Vector34();
      this.renderColor = new Color11(0.05, 0.15, 0.45, 1);
      this.FadeTime = 0.5;
      this.curIndex = 0;
    }
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake() {
      return __async(this, null, function* () {
        if (this.urls.length < 1)
          return;
        yield ShaderVariantHelper.ensureEffectShadersLoaded();
        const createParent = new Sprite3D();
        createParent.name = "EffectParentNode";
        this.createParent = this.owner.scene.addChild(createParent);
        const firstUrl = this.urls[0];
        Laya.loader.load(firstUrl).then((res) => {
          if (res == null)
            return;
          this.prefab = res;
          const addPrefab = this.prefab.create();
          addPrefab.active = false;
          addPrefab.transform.position = this.createPos;
          this.addNode = this.createParent.addChild(addPrefab);
          this.urlShowText.text = firstUrl;
          if (this.createBtn) {
            this.createBtn.clickHandler = new Handler(this, this.onCreate);
          }
          if (this.showHideBtn) {
            this.showHideBtn.clickHandler = new Handler(this, this.onShowHide);
          }
          if (this.switchBtn) {
            this.switchBtn.clickHandler = new Handler(this, this.onSwitch);
          }
          if (this.loadAllBtn) {
            this.loadAllBtn.clickHandler = new Handler(this, this.onLoadAll);
          }
          if (this.btnFullScreenTint) {
            this.btnFullScreenTint.clickHandler = new Handler(this, this.PlayFullScreenTint);
          }
          if (this.btnNormalScreenTint) {
            this.btnNormalScreenTint.clickHandler = new Handler(this, this.SetFullScreenTintDesaturate);
          }
          if (this.btnTintColor) {
            this.btnTintColor.clickHandler = new Handler(this, this.PlayFullScreenTintColor);
          }
          if (this.btnDesaturate) {
            this.btnDesaturate.clickHandler = new Handler(this, this.PlayFullScreenDesaturate);
          }
          this.initFullScreenTintMgr();
        });
      });
    }
    initFullScreenTintMgr() {
      if (!this.fullScreenTintMgr) {
        this.fullScreenTintMgr = new PostProcessFullScreenTintMgr();
      }
    }
    PlayFullScreenTint() {
      GlobalShaderInit.postProcessEnable = true;
      this.fullScreenTintMgr.Play(this.fullScreenTintMgr.TintColor, this.FadeTime, 1);
      this.fullScreenTintMgr.SetDesaturate(true);
    }
    SetFullScreenTintDesaturate() {
      this.fullScreenTintMgr.Stop(this.FadeTime);
    }
    StopFullScreenTint() {
      this.fullScreenTintMgr.SetDesaturate(true);
    }
    //染色
    PlayFullScreenTintColor() {
      GlobalShaderInit.postProcessEnable = true;
      this.fullScreenTintMgr.Play(this.fullScreenTintMgr.TintColor, this.FadeTime, 1);
    }
    //去饱和
    PlayFullScreenDesaturate() {
      this.fullScreenTintMgr.SetDesaturate(true);
    }
    onCreate() {
      const addPrefab = this.prefab.create();
      addPrefab.transform.position = this.createPos;
      this.createParent.addChild(addPrefab);
    }
    onShowHide() {
      if (this.addNode.active) {
        this.addNode.active = false;
      }
      this.addNode.active = true;
    }
    onSwitch() {
      if (this.curIndex < this.urls.length - 1) {
        this.curIndex++;
      } else {
        this.curIndex = 0;
      }
      const curUrl = this.urls[this.curIndex];
      Laya.loader.load(curUrl).then((res) => {
        if (res == null)
          return;
        this.prefab = res;
        const addPrefab = this.prefab.create();
        addPrefab.active = false;
        addPrefab.transform.position = this.createPos;
        this.createParent.destroyChildren();
        this.addNode = this.createParent.addChild(addPrefab);
        this.urlShowText.text = curUrl;
      });
    }
    onLoadAll() {
      Promise.all(this.urls.map((url) => Laya.loader.load(url))).then((res) => {
        if (res == null)
          return;
        for (let prefab of res) {
          const addPrefab = prefab.create();
          addPrefab.transform.position = this.createPos;
          this.createParent.addChild(addPrefab);
        }
      });
    }
    doDelay(time, func) {
      return __async(this, null, function* () {
        yield ECSTimeUtil.waitAsync(time);
        func();
      });
    }
    onUpdate() {
      var _a;
      if (this.fullScreenTintMgr) {
        let t = Laya.timer.delta;
        this.fullScreenTintMgr.FadeInTime = this.FadeTime;
        this.fullScreenTintMgr.FadeOutTime = this.FadeTime;
        (_a = this.fullScreenTintMgr) == null ? void 0 : _a.Update(t);
        this.fullScreenTintMgr.TintColor.setValue(this.renderColor.r, this.renderColor.g, this.renderColor.b, 1);
      }
    }
  };
  __name(PhoneTestBtn, "PhoneTestBtn");
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "createBtn", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "showHideBtn", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "switchBtn", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "loadAllBtn", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "btnFullScreenTint", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "btnNormalScreenTint", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "btnTintColor", 2);
  __decorateClass([
    property12(Button)
  ], PhoneTestBtn.prototype, "btnDesaturate", 2);
  __decorateClass([
    property12([String])
  ], PhoneTestBtn.prototype, "urls", 2);
  __decorateClass([
    property12(Text)
  ], PhoneTestBtn.prototype, "urlShowText", 2);
  __decorateClass([
    property12(Vector34)
  ], PhoneTestBtn.prototype, "createPos", 2);
  __decorateClass([
    property12(Color11)
  ], PhoneTestBtn.prototype, "renderColor", 2);
  __decorateClass([
    property12(Number)
  ], PhoneTestBtn.prototype, "FadeTime", 2);
  PhoneTestBtn = __decorateClass([
    regClass12("77053a75-dfb0-4f47-8c2c-eff6a8a9472e", "../src/Game/Engine/Editor/PhoneTestBtn.ts")
  ], PhoneTestBtn);

  // src/Game/Engine/Editor/RenderParamShow.ts
  var Text2 = Laya.Text;
  var LayaGL2 = Laya.LayaGL;
  var RenderStatisticsInfo = Laya.RenderStatisticsInfo;
  var { regClass: regClass13, property: property13 } = Laya;
  var RenderParamShow = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.drawCall = 0;
      this.preDrawCall = 0;
    }
    onUpdate() {
      if (this.drawCallText != null) {
        this.drawCall = LayaGL2.renderEngine.getStatisticsInfo(RenderStatisticsInfo.DrawCall);
        if (this.preDrawCall !== this.drawCall) {
          this.preDrawCall = this.drawCall;
          this.drawCallText.text = "DrawCall: " + this.drawCall.toString();
        }
        LayaGL2.renderEngine.clearStatisticsInfo(RenderStatisticsInfo.DrawCall);
      }
    }
  };
  __name(RenderParamShow, "RenderParamShow");
  __decorateClass([
    property13(Text2)
  ], RenderParamShow.prototype, "drawCallText", 2);
  RenderParamShow = __decorateClass([
    regClass13("d6fe8d2c-0198-4310-8963-e06e273872d8", "../src/Game/Engine/Editor/RenderParamShow.ts")
  ], RenderParamShow);

  // src/Game/Engine/Tools/DelayActive.ts
  var { regClass: regClass14, property: property14 } = Laya;
  var DelayActive = class extends Laya.Script {
    constructor() {
      super(...arguments);
      this.delayTime = 1;
      this.isInDelayProc = false;
      this.delayTimer = 0;
    }
    Awake() {
      if (!this.isInDelayProc) {
        this.setChildActive(this.owner, false);
        this.delayTimer = 0;
        this.isInDelayProc = true;
      }
    }
    delayFunc() {
      this.setChildActive(this.owner, true);
      this.isInDelayProc = false;
    }
    setChildActive(owner, isActive, recursion = true) {
      if (owner.numChildren > 0) {
        for (let i = 0; i < owner.numChildren; i++) {
          const child = owner.getChildAt(i);
          child.active = isActive;
          if (recursion) {
            this.setChildActive(child, isActive, recursion);
          }
        }
      }
    }
    //组件被启用后执行，例如节点被添加到舞台后
    onEnable() {
      this.Awake();
    }
    //组件被禁用时执行，例如从节点从舞台移除后
    onDisable() {
      if (this.isInDelayProc) {
        this.isInDelayProc = false;
        this.delayTimer = 0;
      }
    }
    onUpdate() {
      if (!this.isInDelayProc)
        return;
      if (this.delayTimer < this.delayTime) {
        this.delayTimer += Laya.timer.delta * 1e-3;
      } else {
        this.delayFunc();
        this.delayTimer = 0;
        this.isInDelayProc = false;
      }
    }
  };
  __name(DelayActive, "DelayActive");
  __decorateClass([
    property14(Number)
  ], DelayActive.prototype, "delayTime", 2);
  DelayActive = __decorateClass([
    regClass14("aa8cc9e4-36ce-4db8-b116-2ef6c6b10866", "../src/Game/Engine/Tools/DelayActive.ts")
  ], DelayActive);

  // src/Main.ts
  var { regClass: regClass15, property: property15 } = Laya;
  var Main = class extends Laya.Script {
    onStart() {
      console.log("Game start");
    }
  };
  __name(Main, "Main");
  Main = __decorateClass([
    regClass15("7bad1742-6eed-4d8d-81c0-501dc5bf03d6", "../src/Main.ts")
  ], Main);
})();
//# sourceMappingURL=bundle.js.map
