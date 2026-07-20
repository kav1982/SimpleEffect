Shader3D Start
{
    type:Shader3D,
    name:SimpleCharacter_UI,
    enableInstancing:true,
    supportReflectionProbe:false,
    uniformMap:{
        u_AlphaTestValue: { type: Float, default: 0.5 },
        u_TilingOffset: { type: Vector4, default: [1, 1, 0, 0], block: unlit },

        u_AlbedoColor: { type: Color, default: [1, 1, 1, 1], block: unlit },
        u_AlbedoTexture: { type: Texture2D, default:"white" },

        u_OutLineColor : { type: Color, default: [0.95, 0.95, 0.95, 1] },
        u_OutLineWidth : { type: Float, default: 2.5, range: [0.0, 10.0] },

        //CurveWorld: {type:Bool,caption:"曲面世界顶点变换",default:true},

//        溶解 : {type:"Group",options:{members:["_DissolveMap~_DissolveParam2"]},serializable:false},
//        _DissolveMap : {type: Texture2D, tips:"溶解贴图",default: "white"},
//        _DissolveEdgeColor : {type: Color, tips:"溶解边缘颜色",default:[1, 1, 1, 1]},
//        _DissolveParam : {type: Vector4, 
//        tips:"[ XY:溶解UV动画 ]  [ Z:溶解强度 ]  [ W:溶解柔和 ]",
//        default: [0, 0, 0.5, 0.5]}, 
//        _DissolveParam2 : {type: Vector4, 
//        tips:"[ X:溶解边缘范围 ]  [ Y:溶解边缘柔和 ] [ ZW:溶解贴图XY缩放 ]",
//        default: [0, 0, 1, 1]}, 
        noNeedGamma : {type:Bool,tips:"不需要Gamma转换",default:false},
        
        通道染色 : {type:"Group",options:{members:["_ChannelMap~_BChannelCol"]},serializable:false},
        _ChannelMap : {type: Texture2D, tips:"通道控制贴图",default: "white"},
        _RChannelCol : {type: Color, tips:"R通道染色",default:[1, 1, 1, 1]},
        _GChannelCol : {type: Color, tips:"G通道染色",default:[1, 1, 1, 1]},
        _BChannelCol : {type: Color, tips:"B通道染色",default:[1, 1, 1, 1]},

        边缘光 : {type:"Group",options:{members:["_RimColor~_RimAdditive"]},serializable:false},
        _RimColor : {type: Color, tips:"边缘光颜色",default:[1, 1, 1, 1]},
        _RimArea : {type:Float , caption:"边缘光范围",default:0.5},
        _RimSoft : {type:Float , caption:"边缘光柔和",default:0.5},
        _RimReverse : {type:Bool , caption:"反向边缘光",default:false},
        _RimAdditive : {type:Bool , caption:"Additive模式",tips:"不勾选时为Blend模式",default:false},
        
        轴向渐变 : {type:"Group",options:{members:["u_AxisScale~u_GradientOffset"]},serializable:false},
        u_AxisScale: { type:Float,caption:"轴距缩放",default:1},
        u_GradientTopCol: { type:Color,tips:"渐变顶部色",default: [1, 1, 1, 1]},
        u_GradientOffset1: { type:Float,tips:"渐变插值1",range:[-1,1],default:0},
        u_GradientCenCol: { type:Color,tips:"渐变中部色",default: [1, 1, 1, 1]},
        u_GradientOffset2: { type:Float,tips:"渐变插值2",range:[-1,1],default:0},
        u_GradientButCol: { type:Color,tips:"渐变底部色",default: [1, 1, 1, 1]},
        CurveWorld: {type:Bool,caption:"曲面世界顶点变换",default:false},
    },
    defines: {
        //ZHFOG: { type:bool,tips:"接受全局雾效",default: true},
        //EnableDissolve: { type: bool, tips:"开启溶解",default: false},
        EnableChannelControl:{ type: bool, tips:"开启通道染色",default: false},
        DisableOutlinePass: {type: bool, caption:"关闭描边",default: false},
        EnableRim: {type: bool, tips:"开启边缘光",default: false},
        EnableGradient:{type: bool, tips:"开启轴向渐变",default: false}
    }
    shaderPass:[
        // {
        //     pipeline:Forward,
        //     VS:OutLineVS,
        //     FS:OutLinePS,
        //     statefirst: true,   
        //     renderState: {
        //         cull: Front,
        //     }        
        // },   
        {
            pipeline:Forward,
            VS:unlitVS,
            FS:unlitPS,
            statefirst: true, 
            renderState: {
                stencilWrite: true,
                stencilTest: Always,
                stencilOp: [Keep,Keep,Replace],
                stencilRef: 6
            }      
        },
        {
            pipeline:ShadowCaster,
            VS:DepthVS,
            FS:DepthFS,
        }
    ]
}
Shader3D End

// GLSL Start
// #defineGLSL OutLineVS

//     #define SHADER_NAME SimpleCharacter_UI

//     #include "Math.glsl";
//     #include "Scene.glsl";
//     #include "SceneFogInput.glsl";
//     #include "Camera.glsl";
//     #include "Sprite3DVertex.glsl";
//     #include "VertexCommon.glsl";
//     #include "./ShaderLibrary/EffectCommonInput.glsl";
//     #include "./ShaderLibrary/ShaderFunctionSupport.glsl";   
//     #include "ShadingVertex.glsl";
//     #include "BlinnPhongVertex.glsl"; 
    
//     varying vec2 vTexcoord0;
    
//     void main ()
//     {
//     #ifndef DisableOutlinePass
//         Vertex vertex;
//         getVertexParams(vertex);

//         PixelParams pixel;
//         initPixelParams(pixel, vertex);
//         vec3 positionWS = pixel.positionWS;

//         vTexcoord0 = transformUV(vertex.texCoord0, u_TilingOffset);      
//         vec4 position = vec4((vertex.positionOS) + (vertex.normalOS) * u_OutLineWidth * 0.001, 1.0);

//         // mat4 worldMat = getWorldMatrix();
//         // vec3 positionWS = (worldMat * vec4(position)).xyz;
//         // PixelParams pixel;
//         // initPixelParams(pixel, vertex);
//         // vec3 positionWS = pixel.positionWS;
//         gl_Position = getPositionCS(positionWS);
//         gl_Position = remapPositionZ(gl_Position);
//     #endif
//     }
// #endGLSL

// #defineGLSL OutLinePS

//     #define SHADER_NAME SimpleCharacter
    
//     #include "Color.glsl";

//     varying vec2 vTexcoord0;

//     void main() 
//     { 

//        vec2 uv = vTexcoord0;
        
//         vec4 albedoSampler = texture2D(u_AlbedoTexture, uv) * u_AlbedoColor;
          
//         float alpha = albedoSampler.a;
        
//     #ifdef ALPHATEST
//         if (alpha < u_AlphaTestValue)
//             discard;
//     #endif
    
//         vec3 finalColor = u_OutLineColor.rgb * albedoSampler.rgb * albedoSampler.rgb;
//         gl_FragColor = vec4(finalColor, 1.0);
        
//         #ifdef DisableOutlinePass 
//         gl_FragColor = vec4(finalColor, 0.0);
//         discard;
//         #endif
        
//         if(!noNeedGamma)
//         {
//             gl_FragColor = linearToGamma(gl_FragColor);
//         }        
//         gl_FragColor = outputTransform(gl_FragColor);
//     }
// #endGLSL

#defineGLSL unlitVS

    #define SHADER_NAME SimpleCharacter_UI

    #include "Scene.glsl";
    #include "Camera.glsl";
    #include "Sprite3DVertex.glsl";

    #include "VertexCommon.glsl";

    #include "./ShaderLibrary/EffectCommonInput.glsl";
    
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";
    #include "ShadingVertex.glsl";
    #include "BlinnPhongVertex.glsl";

    varying vec2 vTexcoord0;
//    #ifdef EnableDissolve
//    varying vec2 v_dissolveUV;
//    #endif


//#ifdef ZHFOG
//    varying vec2 v_fogParam;
//#endif

#ifdef EnableRim
    varying vec3 vNormalWS;
    varying vec3 v_viewDirWS;
#endif

    varying float gradientAxis;

    void main()
    {
        Vertex vertex;
        getVertexParams(vertex);

        //PixelParams pixel;
        //initPixelParams(pixel, vertex);
        //vec3 positionWS = pixel.positionWS; 

        vTexcoord0 = transformUV(vertex.texCoord0, u_TilingOffset);
//        #ifdef EnableDissolve
//        v_dissolveUV.xy = getDissolveTexUV(vertex.texCoord0,u_Time);
//        #endif

        // mat4 worldMat = getWorldMatrix();
        // vec4 pos = (worldMat * vec4(vertex.positionOS, 1.0));
        // vec3 positionWS = pos.xyz / pos.w;
        // PixelParams pixel;
        // initPixelParams(pixel, vertex);
        // vec3 positionWS = pixel.positionWS;
        
//        if(CurveWorld)
//        {
//            LittlePlanet_Y_Curve(positionWS);
//        }

        mat4 worldMat = getWorldMatrix();
        vec4 pos = (worldMat * vec4(vertex.positionOS, 1.0));
        vec3 positionWS = pos.xyz / pos.w;

        gradientAxis = vertex.positionOS.y * u_AxisScale;

    #ifdef EnableRim
        vNormalWS = TransformObjectToWorldNormal(vertex.normalOS,worldMat);
        v_viewDirWS = getViewDirection(positionWS);
    #endif

        gl_Position = getPositionCS(positionWS);
        
//#ifdef ZHFOG
//        GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
//#endif

        gl_Position = remapPositionZ(gl_Position);
}
#endGLSL

#defineGLSL unlitPS

    #define SHADER_NAME SimpleCharacter_UI

    #include "Color.glsl";

    #include "./ShaderLibrary/EffectCommonInput.glsl";

    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    varying vec2 vTexcoord0;

    varying float gradientAxis;
    
//    #ifdef EnableDissolve
//    varying vec2 v_dissolveUV;
//    #endif

//#ifdef ZHFOG
//    varying vec2 v_fogParam;
//#endif

#ifdef EnableRim
    varying vec3 vNormalWS;
    varying vec3 v_viewDirWS;
#endif

    void main()
    {
        vec2 uv = vTexcoord0;
        
        vec4 albedoSampler = texture2D(u_AlbedoTexture, uv) * u_AlbedoColor;
        
        #ifdef Gamma_u_AlbedoTexture
        albedoSampler = gammaToLinear(albedoSampler);
        #endif // Gamma_u_AlbedoTexture

        #ifdef EnableChannelControl
        vec4 channelSampler = texture2D(_ChannelMap, uv);
        albedoSampler.rgb = mix(albedoSampler.rgb,_RChannelCol.rgb,channelSampler.r);
        albedoSampler.rgb = mix(albedoSampler.rgb,_GChannelCol.rgb,channelSampler.g);
        albedoSampler.rgb = mix(albedoSampler.rgb,_BChannelCol.rgb,channelSampler.b);
        #endif
        
        vec3 color = albedoSampler.rgb;
        
        float alpha = albedoSampler.a;
        
    #ifdef ALBEDOTEXTURE
        #ifdef Gamma_u_AlbedoTexture
        albedoSampler = gammaToLinear(albedoSampler);
        #endif // Gamma_u_AlbedoTexture
        color *= albedoSampler.rgb;
        alpha *= albedoSampler.a;
    #endif // ALBEDOTEXTURE

    #ifdef ALPHATEST
        if (alpha < u_AlphaTestValue)
            discard;
    #endif // ALPHATEST
        
//#ifdef DITHER_CLIP
//	if(GetDitherClip(gl_FragCoord.xyz))
//	{
//		discard;
//	}
//#endif

//    #ifdef EnableDissolve
//        vec2 dissolveUV = v_dissolveUV;
//        vec4 ClipTexCol = texture2D(_DissolveMap,dissolveUV.xy);
//        mediump float clipSource = min(ClipTexCol.r, ClipTexCol.a);
//        mediump vec2 dissolveData = vec2(_DissolveFactor,_DissolveEdge);
//        dissolveData = dissolveData * 2.0 - 1.0;
//        mediump vec2 soft = vec2(_DissolveSoft,_DissolveEdgeSoft);
//        mediump float clipArea = clipSource - dissolveData.x;
//        mediump float clipEdge = saturate(clipArea - dissolveData.y);
//        
//        mediump vec2 ClipAreaAndEdge = smoothstep(0.5 - soft, 0.5 + soft, vec2(clipArea, clipEdge));
//        ClipAreaAndEdge.y = 1.0 - ClipAreaAndEdge.y;
//        //color.rgb += _DissolveEdgeColor.rgb * ClipAreaAndEdge.y;
//        color.rgb = mix(color.rgb,_DissolveEdgeColor.rgb,ClipAreaAndEdge.y);
//        alpha *= ClipAreaAndEdge.x;
//        if(alpha<0.001)
//        {
//            discard;
//        }
//    #endif
        
//#ifdef ZHFOG
//        ApplyFog(color.rgb,v_fogParam);
//#endif

#ifdef EnableRim
        RimParam rimParam;
        rimParam.normalWS = vNormalWS;
        rimParam.viewDirWS = v_viewDirWS;
        rimParam.rimColor = _RimColor;
        rimParam.rimArea = _RimArea;
        rimParam.rimSoft = _RimSoft;
        rimParam.rimReverse = _RimReverse;
        rimParam.rimAdditive = _RimAdditive;
        
        ApplyRim(rimParam,color.rgb,alpha);
#endif

    #ifdef EnableGradient

        float gradient1 = saturate(gradientAxis + u_GradientOffset1);
        vec4 gradientCol = mix(u_GradientCenCol,u_GradientTopCol,gradient1);
        float gradient2 = saturate(gradientAxis + u_GradientOffset1 - u_GradientOffset2);
        gradientCol = mix(u_GradientButCol,gradientCol,gradient2);
        color.rgb *= gradientCol.rgb;
        alpha *= gradientCol.a;
    #endif

        gl_FragColor = vec4(color, alpha);

        if(!noNeedGamma)
        {
            gl_FragColor = linearToGamma(gl_FragColor);
        }

        gl_FragColor = outputTransform(gl_FragColor);
    }
#endGLSL

#defineGLSL DepthVS

    #define SHADER_NAME DepthVS

    #include "DepthVertex.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";
    // #include "ShadingVertex.glsl";
    // #include "BlinnPhongVertex.glsl";
    void main()
    {
        Vertex vertex;
        getVertexParams(vertex);

        mat4 worldMat = getWorldMatrix();
        vec4 pos = (worldMat * vec4(vertex.positionOS, 1.0));
        vec3 positionWS = pos.xyz / pos.w;
        // PixelParams pixel;
        // initPixelParams(pixel, vertex);
        // vec3 positionWS = pixel.positionWS;
        mat4 normalMat = transpose(inverse(worldMat));
        vec3 normalWS = normalize((normalMat * vec4(vertex.normalOS, 0.0)).xyz);
        // vec3 normalWS = pixel.normalWS;

        vec4 positionCS = DepthPositionCS(positionWS, normalWS);
        gl_Position = remapPositionZ(positionCS);
    }
#endGLSL


#defineGLSL DepthFS

    #define SHADER_NAME DepthFS

    #include "DepthFrag.glsl";

    void main()
    {
        gl_FragColor = getDepthColor();
    }
#endGLSL

GLSL End


