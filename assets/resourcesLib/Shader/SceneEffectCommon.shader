Shader3D Start
{
    type:Shader3D,
    name:SceneEffectCommon,
    enableInstancing:true,
    supportReflectionProbe:false,
    uniformMap:{

        基本信息 : {type:"Group",options:{members:["u_AlphaTestValue~isUIEffect"]},serializable:false},
        u_AlphaTestValue: { type: Float, tips:"透明度裁切值",range:[0,1],default: 0.5 },
        u_AlbedoColor: { type: Color, tips:"基本颜色",default: [1, 1, 1, 1], block: unlit },
        u_AlbedoColorStrength: { type: Float,tips:"基本颜色强度",default:1 },
        u_TilingOffset: { type: Vector4, tips:"主帖图Tiling",default: [1, 1, 0, 0], block: unlit },
        u_AlbedoTexture: { type: Texture2D, tips:"主贴图"},
        u_SubTexture: { type: Texture2D, tips:"副贴图",options: { define: "SUBTEXTURE" } },
        _AlbedoTextureUVAnim : {type: Vector4, caption:"主贴图参数",tips:"[ XY:主帖图UV动画 ]   [ Z:主帖图旋转角度(0-360度) ]   [ W:副贴图混合模式 0为Blend 1为ADD ]"
            ,default: [0, 0, 0, 0]},
        FaceToCamera: {type: Bool, caption:"始终面朝摄像机",default:false},
        CurveWorld: {type:Bool,caption:"曲面世界顶点变换",default:true},
        isUIEffect: {type:Bool,caption:"UI特效",tips:"有背板的Additive模式特效不勾选此选项",default:false},
        
        序列帧(贴图为主贴图) : {type:"Group",options:{members:["u_SheetParam~u_PosRandomScale"]},serializable:false},
        u_SheetParam: {type:Vector4,tips:"[ X:序列帧行数 ]  [ Y:序列帧列数 ] [ Z:序列帧速度(自动状态下有效) ]",default:[1,1,1,1]},
        _EnableAnimControl: { type: Bool, tips:"启用动画控制,不开启则自动播放",default: false },
        u_SheetProgress:{type:Float,tips:"序列帧动画控制进度(启用动画控制时有效)", default:0.0},
        _EnablePosRandom:{type:Float,tips:"序列帧位置随机(0/1开关)",default:0.0},
        u_PosRandomScale:{type:Float,tips:"序列帧位置随机系数",default:1.0},
        
        扰动 : {type:"Group",options:{members:["_DistortMap~_DistortParam"]},serializable:false},
        _DistortMap: {type: Texture2D, tips:"扰动贴图",default: "grey"},
        _AlbedoReceiveDistort: { type: Bool, tips:"主贴图受扰动影响",default: true },
        _DistortParam : {type: Vector4,
        tips:"[ XY:扰动UV动画 ]  [ Z:扰动强度 ]  [ W:扰动图片缩放 ]",
        default: [1, 1, 0.5, 1]}

        溶解 : {type:"Group",options:{members:["_DissolveMap~_DissolveParam2"]},serializable:false},
        _DissolveMap : {type: Texture2D, tips:"溶解贴图",default: "white"},
        _DissolveReceiveDistort: { type: Bool, tips:"溶解受扰动影响",default: true },
        _DissolveEdgeColor : {type: Color, tips:"溶解边缘颜色",default:[1, 1, 1, 1]},
        _DissolveParam : {type: Vector4, 
        tips:"[ XY:溶解UV动画 ]  [ Z:溶解强度 ]  [ W:溶解柔和 ]",
        default: [0, 0, 0.5, 0.5]}, 
        _DissolveParam2 : {type: Vector4, 
        tips:"[ X:溶解边缘范围 ]  [ Y:溶解边缘柔和 ] [ ZW:溶解贴图XY缩放 ]",
        default: [0, 0, 1, 1]}, 

        遮罩 : {type:"Group",options:{members:["_MaskMap~_MaskUVAnim"]},serializable:false},
        _MaskMap : {type: Texture2D, tips:"遮罩贴图",default: "white"},
        _MaskChannelA : {type:Bool, tips:"遮罩使用A通道，(默认R通道)",default:false},
        _MaskReceiveDistort : {type: Bool,tips:"遮罩受扰动影响",default:false},
        _MaskTilingOffset: { type: Vector4, tips:"Mask帖图Tiling",default: [1, 1, 0, 0]},
        _MaskUVAnim : {type: Vector2, tips:"遮罩UV动画",default:[0,0]},

        边缘光 : {type:"Group",options:{members:["_RimColor~_RimAdditive"]},serializable:false},
        _RimColor : {type: Color, tips:"边缘光颜色",default:[1, 1, 1, 1]},
        _RimArea : {type:Float , caption:"边缘光范围",default:0.5},
        _RimSoft : {type:Float , caption:"边缘光柔和",default:0.5},
        _RimReverse : {type:Bool , caption:"反向边缘光",default:false},
        _RimAdditive : {type:Bool , caption:"Additive模式",tips:"不勾选时为Blend模式",default:false},
        
        雾效参数 : {type:"Group",options:{members:["_ReceiveFog~_AdditiveFog"]},serializable:false},
        _ReceiveFog :  {type:Bool , caption:"接收雾效",tips:"贴图无A通道且模式为Additive时不要勾选",default:true},
        _AdditiveFog :  {type:Bool , caption:"Additive雾效",tips:"接收雾效且物体混合模式为Additive时勾选",default:false},

        软粒子参数 : {type:"Group",options:{members:["_EnableSoftParticle~_Softness"]},serializable:false},
        _EnableSoftParticle : {type : Bool, caption:"是否受软粒子效果", default:false},
        _EnableSoftMoveWithCurve : {type : Bool, caption:"软粒子的高度是否受弯曲影响", default:false},
        _SoftParticleStartHeight : {type : Float, caption:"软粒子生效的开始高度",default:0.5},
        _SoftParticleEndHeight : {type: Float, caption:"软粒子生效的终止高度",default:-1},
        _Softness : {type: Float, caption:"透明度调节因子",default:2},
    },
    defines: {
        UseAnimationSheet : { type: bool, tips:"启用序列帧",default: false },
        EnableDistort: { type: bool, tips:"开启扰动",default: false },
        EnableDissolve: { type: bool, tips:"开启溶解",default: false },
        EnableMask: { type: bool, tips:"开启遮罩",default: false },
        EnableRim: { type: bool, tips:"开启边缘光",default: false },
        //EnableSoftParticle: {type: bool, tips:"开启软粒子",default: false},
        //ZHFOG: { type:bool,tips:"接受全局雾效",default: false},
        //ADDITIVEFOG: { type:bool,tips:"开启雾效且物体混合模式为Additive",default: false},
    }
    shaderPass:[
        {
            pipeline:Forward,
            VS:unlitVS,
            FS:unlitPS
        }
    ]
}
Shader3D End

GLSL Start
#defineGLSL unlitVS

    #define SHADER_NAME SceneEffectCommon

    #include "Math.glsl";

    #include "Scene.glsl";

    #include "Camera.glsl";
    #include "Sprite3DVertex.glsl";

    #include "VertexCommon.glsl";
    #include "./ShaderLibrary/EffectCommonInput.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    // #include "ShadingVertex.glsl";
    // #include "BlinnPhongVertex.glsl";

#ifdef UV
    varying vec4 vTexcoord0;

    #ifdef EnableDissolve
    varying vec2 v_dissolveUV;
    #endif

    #ifdef EnableDistort
    varying vec2 v_distortUV;
    #endif
#endif // UV

#ifdef EnableRim
    varying vec3 vNoramlWS;
    varying vec3 v_viewDirWS;
#endif

    varying vec3 worldPosXYZ; 
    varying float softStart;
    varying float softEnd;

//    #ifdef COLOR
//    varying vec4 v_VertexColor;
//    #endif // COLOR

    //#ifdef ZHFOG 
    varying vec3 v_fogParam;
    //#endif

    void main()
    {
        Vertex vertex;
        getVertexParams(vertex);

    #ifdef UV
        #ifdef UseAnimationSheet
            vTexcoord0.xy = rotateUV(vertex.texCoord0,_AlbedoTextureUVAnim.z);
        #else
            vTexcoord0.xy = transformUV(vertex.texCoord0, u_TilingOffset);
            vTexcoord0.xy = rotateUV(vTexcoord0.xy,_AlbedoTextureUVAnim.z);
            vTexcoord0.xy += fract(_AlbedoTextureUVAnim.xy * (u_Time));
        #endif
        
        vTexcoord0.zw = transformUV(vertex.texCoord0, _MaskTilingOffset);
        vTexcoord0.zw += fract(_MaskUVAnim.xy * (u_Time));

        #ifdef EnableDistort
        v_distortUV = getDistortTexUV(vertex.texCoord0,(u_Time));
        #endif
        
        #ifdef EnableDissolve
        v_dissolveUV.xy = getDissolveTexUV(vertex.texCoord0,u_Time);
        #endif
    #endif // UV


//    #ifdef COLOR
//        v_VertexColor = vertex.vertexColor;
//    #endif // COLOR

        mat4 worldMat = getWorldMatrix();
        
    if(FaceToCamera)
    {
        ApplyFaceToCamera(vertex.positionOS.xyz,worldMat,u_CameraPos);
    }

        vec4 pos = (worldMat * vec4(vertex.positionOS, 1.0));
        vec3 positionWS = pos.xyz / pos.w;

        // PixelParams pixel;
        // initPixelParams(pixel,vertex);
        // vec3 positionWS = pixel.positionWS;
        //worldPosXYZ = positionWS;
        if(CurveWorld)
        {
            if(_EnableSoftParticle){
                softStart = _SoftParticleStartHeight;
                softEnd = _SoftParticleEndHeight;
                LittleSoftParticle_Y_Curve(positionWS, softStart,softEnd);
            }else{
                LittlePlanet_Y_Curve(positionWS);
            }
        }
        worldPosXYZ = positionWS;
    #ifdef EnableRim
        vNoramlWS = TransformObjectToWorldNormal(vertex.normalOS,worldMat);
        v_viewDirWS = getViewDirection(positionWS);
    #endif

        gl_Position = getPositionCS(positionWS);

//#ifdef ZHFOG
        GetFogParam(v_fogParam.xy,positionWS.y,gl_Position,u_ProjectionParams);
//#endif
        
        vec3 center = vec3(worldMat[3][0],worldMat[3][1],worldMat[3][2]);
        v_fogParam.z = (length(center) * u_PosRandomScale * _EnablePosRandom);

        gl_Position = remapPositionZ(gl_Position);
    }
#endGLSL

#defineGLSL unlitPS

    #define SHADER_NAME SceneEffectCommon

    #include "Color.glsl";

    #include "Scene.glsl";

    #include "./ShaderLibrary/EffectCommonInput.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

//    #ifdef COLOR
//    varying vec4 v_VertexColor;
//    #endif // COLOR

    varying vec4 vTexcoord0;

#ifdef EnableDissolve
    varying vec2 v_dissolveUV;
#endif

#ifdef EnableDistort
    varying vec2 v_distortUV;
#endif

#ifdef EnableRim
    varying vec3 vNoramlWS;
    varying vec3 v_viewDirWS;
#endif

    //#ifdef ZHFOG
    varying vec3 v_fogParam;
    //#endif
    varying vec3 worldPosXYZ;
    varying float softStart;
    varying float softEnd;

    void main()
    {
        vec2 mainUV;
        #ifdef UseAnimationSheet
            vec2 uv = vTexcoord0.xy;
            float row = max(1.0, u_SheetParam.x);
            float column = max(1.0, u_SheetParam.y);
            vec2 scale = vec2(1.0) / vec2(column, row);
            float progress;
            if(_EnableAnimControl)
            {
                progress = u_SheetProgress * row * column + v_fogParam.z;
            }
            else
            {
                progress = mod(u_Time * u_SheetParam.z + v_fogParam.z, 500.0);
            }
            uv = (uv + vec2(floor(progress - floor(progress / column) * column), row - (1.0 - floor(progress / column)))) * scale;
            mainUV = fract(uv);
        #else
            mainUV = vTexcoord0.xy;
        #endif
        
       float distort = 0.0;
#ifdef EnableDistort
        vec4 distortCol = texture2D(_DistortMap,v_distortUV);
        distort = distortCol.r * _DistortFactor;
#endif
        
        if(_AlbedoReceiveDistort)
        {
            mainUV += vec2(distort);
        }
        
        vec4 albedoColor = u_AlbedoColor * u_AlbedoColorStrength;

        vec3 color = albedoColor.rgb;
        float alpha = albedoColor.a;
    //#ifdef ALBEDOTEXTURE
        vec4 albedoSampler = texture2D(u_AlbedoTexture, mainUV);
        #ifdef Gamma_u_AlbedoTexture
        albedoSampler = gammaToLinear(albedoSampler);
        #endif // Gamma_u_AlbedoTexture
        color *= albedoSampler.rgb;
        alpha *= albedoSampler.a;
    //#endif // ALBEDOTEXTURE

    #ifdef SUBTEXTURE
        vec4 subSampler = texture2D(u_SubTexture, mainUV);
        #ifdef Gamma_u_SubTexture
        subSampler = gammaToLinear(subSampler);
        #endif
        color = mix(color * subSampler.rgb,color + subSampler.rgb,_AlbedoTextureUVAnim.w);
        alpha = mix(alpha * subSampler.a,alpha + subSampler.a,_AlbedoTextureUVAnim.w);
    #endif
            
        
    #ifdef EnableDissolve
        vec2 dissolveUV = v_dissolveUV;
        if(_DissolveReceiveDistort)
        {
            dissolveUV += vec2(distort);
        }
        vec4 ClipTexCol = texture2D(_DissolveMap,dissolveUV.xy);
        mediump float clipSource = min(ClipTexCol.r, ClipTexCol.a);
        mediump vec2 dissolveData = vec2(_DissolveFactor,_DissolveEdge);
        dissolveData = dissolveData * 2.0 - 1.0;
        mediump vec2 soft = vec2(_DissolveSoft,_DissolveEdgeSoft);
        mediump float clipArea = clipSource - dissolveData.x;
        mediump float clipEdge = saturate(clipArea - dissolveData.y);
        
        mediump vec2 ClipAreaAndEdge = smoothstep(0.5 - soft, 0.5 + soft, vec2(clipArea, clipEdge));
        ClipAreaAndEdge.y = 1.0 - ClipAreaAndEdge.y;
        //color.rgb += _DissolveEdgeColor.rgb * ClipAreaAndEdge.y;
        color.rgb = mix(color.rgb,_DissolveEdgeColor.rgb,ClipAreaAndEdge.y);
        alpha *= ClipAreaAndEdge.x;
    #endif


#ifdef EnableMask
        vec2 maskUV = vTexcoord0.zw;
        if(_MaskReceiveDistort)
        {
            maskUV += vec2(distort);
        }
        vec4 maskCol = texture2D(_MaskMap,maskUV);
        float mask = maskCol.r;
        if(_MaskChannelA)
        {
            mask = maskCol.a;
        }
        alpha *= mask;
#endif

#ifdef EnableRim
        RimParam rimParam;
        rimParam.normalWS = vNoramlWS;
        rimParam.viewDirWS = v_viewDirWS;
        rimParam.rimColor = _RimColor;
        rimParam.rimArea = _RimArea;
        rimParam.rimSoft = _RimSoft;
        rimParam.rimReverse = _RimReverse;
        rimParam.rimAdditive = _RimAdditive;
        
        ApplyRim(rimParam,color.rgb,alpha);
#endif

#ifdef ALPHATEST
        if (alpha < u_AlphaTestValue)
            discard;
#endif // ALPHATEST

//#ifdef ZHFOG
//        #ifdef ADDITIVEFOG
//        ApplyFog(color.rgb,v_fogParam,alpha);
//        #else
//        ApplyFog(color.rgb,v_fogParam);
//        #endif
//#endif
        
        ApplyFog(color.rgb,v_fogParam.xy,alpha,_ReceiveFog,_AdditiveFog);

        if(isUIEffect)
        {
            color = linearToGamma(color);
        }
        if(_EnableSoftParticle && _EnableSoftMoveWithCurve)
        {
            ApplySoftParticleTemp(worldPosXYZ, alpha,softStart,softEnd,_Softness);
        }
        else if(_EnableSoftParticle)
        {
            ApplySoftParticleTemp(worldPosXYZ, alpha,_SoftParticleStartHeight,_SoftParticleEndHeight,_Softness);
        }
        gl_FragColor = vec4(color, alpha);
        //gl_FragColor = vec4(softStart);
        gl_FragColor = outputTransform(gl_FragColor);
    }
#endGLSL
GLSL End


