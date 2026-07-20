Shader3D Start
{
    type:Shader3D,
    name:SimpleCharacter,
    enableInstancing:true,
    supportReflectionProbe:false,
    uniformMap:{
        u_AlphaTestValue: { type: Float, default: 0.5 },
        u_TilingOffset: { type: Vector4, default: [1, 1, 0, 0], block: unlit },

        u_AlbedoColor: { type: Color, default: [1, 1, 1, 1], block: unlit },
        u_AlbedoTexture: { type: Texture2D, default:"white" },
        
        CurveWorld: {type:Bool,caption:"曲面世界顶点变换",default:true},
        
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
},
    defines: {
        ZHFOG: {type:bool,tips:"接受雾效",default:true,private:false},
        EnableRim: {type: bool, tips:"开启边缘光",default: false},
        EnableChannelControl:{ type: bool, tips:"开启通道染色",default: false},
    }
    shaderPass:[
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
            pipeline:Forward,
            VS:PlaneShadowVS,
            FS:PlaneShadowPS,
            statefirst: true,
            renderState: {
                cull: Back,
                depthWrite: false,
                blend: All,
                srcBlend: SourceAlpha,
                dstBlend: OneMinusSourceAlpha,
                stencilWrite: true,
                stencilTest : NotEqual,
                stencilOp: [Keep,Keep,Replace],
                stencilRef: 5
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

GLSL Start
#defineGLSL unlitVS

    #define SHADER_NAME SimpleCharacter

    #include "Scene.glsl";
    #include "Camera.glsl";
    #include "Sprite3DVertex.glsl";
    #include "VertexCommon.glsl";
    //#include "./ShaderLibrary/EffectCommonInput.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    #ifdef UV
    varying vec2 vTexcoord0;
    #endif // UV

    #ifdef ZHFOG
        varying vec2 v_fogParam;
    #endif

    #ifdef EnableRim
        varying vec3 vNormalWS;
        varying vec3 v_viewDirWS;
    #endif

    void main()
    {
        Vertex vertex;
        getVertexParams(vertex);

        // PixelParams pixel;
        // initPixelParams(pixel, vertex);
        // vec3 positionWS = pixel.positionWS;

    #ifdef UV
        vTexcoord0 = transformUV(vertex.texCoord0, u_TilingOffset);
    #endif // UV

        mat4 worldMat = getWorldMatrix();
        vec4 pos = (worldMat * vec4(vertex.positionOS, 1.0));
        vec3 positionWS = pos.xyz / pos.w;
        // PixelParams pixel;
        // initPixelParams(pixel, vertex);
        // vec3 positionWS = pixel.positionWS;
        
        if(CurveWorld)
        {
            LittleCharacter_Y_Curve(positionWS);
        }

        #ifdef EnableRim
            vNormalWS = TransformObjectToWorldNormal(vertex.normalOS,worldMat);
            v_viewDirWS = getViewDirection(positionWS);
        #endif

        gl_Position = getPositionCS(positionWS);
        
#ifdef ZHFOG
        GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
#endif

        gl_Position = remapPositionZ(gl_Position);
}
#endGLSL

#defineGLSL unlitPS

    #define SHADER_NAME SimpleCharacter

    #include "Color.glsl";

    //#include "./ShaderLibrary/EffectCommonInput.glsl";

    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    varying vec2 vTexcoord0;

#ifdef ZHFOG
    varying vec2 v_fogParam;
#endif

#ifdef EnableRim
    varying vec3 vNormalWS;
    varying vec3 v_viewDirWS;

    struct RimParam 
    {
        vec3 normalWS;
        vec3 viewDirWS;
        vec4 rimColor;
        float rimArea;
        float rimSoft;
        bool rimReverse;
        bool rimAdditive;
    };

    void ApplyRim(RimParam rimParam,inout vec3 color,inout float alpha)
    {
        float rimEdge = 0.0;
        if(rimParam.rimReverse)
        {
            rimEdge = saturate(abs(dot(rimParam.normalWS,rimParam.viewDirWS)) + rimParam.rimArea);
        }
        else
        {
            rimEdge = saturate(1.0-abs(dot(rimParam.normalWS,rimParam.viewDirWS)) + rimParam.rimArea);
        }
        
        rimEdge = smoothstep(0.5 - rimParam.rimSoft,0.5 + rimParam.rimSoft,rimEdge);
        
        if(rimParam.rimAdditive)
        {
            color.rgb = color.rgb + rimEdge * rimParam.rimColor.rgb * rimParam.rimColor.a;
        }
        else
        {
            color.rgb = mix(color.rgb,rimParam.rimColor.rgb,rimEdge);
        }
        alpha = rimParam.rimAdditive ? saturate(alpha + rimParam.rimColor.a * rimEdge) : mix(alpha,rimParam.rimColor.a,rimEdge);
    }
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
        
    #ifdef ALPHATEST
        if (alpha < u_AlphaTestValue)
            discard;
    #endif // ALPHATEST
        
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
        
#ifdef ZHFOG
        ApplyFog(color.rgb,v_fogParam);
#endif

        gl_FragColor = vec4(color, alpha);

        gl_FragColor = outputTransform(gl_FragColor);
    }
#endGLSL

//PlaneShadow
#defineGLSL PlaneShadowVS

    #define SHADER_NAME SimpleCharacter

    #include "Camera.glsl";
    #include "Sprite3DVertex.glsl";

    #include "VertexCommon.glsl";
    
    #include "./ShaderLibrary/PlaneShadowLib.glsl";

    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";


#ifdef ZHFOG
    varying vec2 v_fogParam;
#endif

    //varying float v_planeShadowGradient;

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
        
        positionWS = GetPlaneShadowPos(positionWS);
        
        if(CurveWorld)
        {
            LittleCharacter_Y_Curve(positionWS);
        }

        gl_Position = getPositionCS(positionWS);
        
        
#ifdef ZHFOG
        GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
#endif

        gl_Position = remapPositionZ(gl_Position);
}
#endGLSL

#defineGLSL PlaneShadowPS

    #define SHADER_NAME SimpleCharacter

    #include "Color.glsl";

    #include "./ShaderLibrary/PlaneShadowLib.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    //varying vec2 vTexcoord0;

#ifdef ZHFOG
    varying vec2 v_fogParam;
#endif

    //varying float v_planeShadowGradient;
    uniform vec4 u_PlaneShadowColor;
    void main()
    {
        // vec3 color = vec3(0.0);
        
        // float alpha = _PlaneShadowAlpha;
        
        // if(ShadowGradient)
        // {
        //     float psGradient = 1.0-saturate(v_planeShadowGradient-u_PlaneShadowFadeOffset);
        //     psGradient = smoothstep(0.0,u_PlaneShadowFadeSmooth,psGradient);
        //     alpha *= psGradient;
        // }
        vec3 color = u_PlaneShadowColor.rgb;
        float alpha = u_PlaneShadowColor.a;
#ifdef ZHFOG
        ApplyFog(color.rgb,v_fogParam);
#endif

        gl_FragColor = vec4(color, alpha);

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
        if(CurveWorld)
        {
            LittleCharacter_Y_Curve(positionWS);
        }
        // mat4 normalMat = transpose(inverse(worldMat));
        // vec3 normalWS = normalize((normalMat * vec4(vertex.normalOS, 0.0)).xyz);
        vec3 normalWS = TransformObjectToWorldNormal(vertex.normalOS,worldMat);

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


