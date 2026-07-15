Shader3D Start
{
    type:Shader3D,
    name:CurveMap,
    enableInstancing:true,
    supportReflectionProbe:false,
    uniformMap:{
        u_AlphaTestValue: { type: Float, default: 0.5 },
        u_TilingOffset: { type: Vector4, default: [1, 1, 0, 0], block: unlit },

        //u_AlbedoColor: { type: Color, default: [1, 1, 1, 1], block: unlit },
        u_AlbedoTexture: { type: Texture2D, default:"white" },
        CurveWorld: {type:Bool,caption:"曲面世界顶点变换",default:true},
    },
    defines: {
        //ENABLEVERTEXCOLOR: { type: bool, default: false }
        //CURVE_WORLD: {type:bool,tips:"曲面世界顶点变换",default:true},
        ZHFOG: {type:bool,tips:"接受全局雾效",default: true},
    }
    shaderPass:[
        {
            pipeline:Forward,
            VS:unlitVS,
            FS:unlitPS
        },
    ]
}
Shader3D End

GLSL Start
#defineGLSL unlitVS

    #define SHADER_NAME CurveMap

    #include "Camera.glsl";
    #include "Sprite3DVertex.glsl";

    #include "VertexCommon.glsl";

    
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    #ifdef UV
        varying vec2 vTexcoord0;
    #endif // UV

    // #ifdef COLOR
    // varying lowp vec4 v_VertexColor;
    // #endif // COLOR

    #ifdef ZHFOG
        varying vec2 v_fogParam;
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
        
        //#ifdef CURVE_WORLD
        if(CurveWorld)
        {
            //LittlePlanet_Y_Curve(positionWS);
            LittleCharacter_Y_Curve(positionWS);
        }
        //#endif

        gl_Position = getPositionCS(positionWS);
        
        #ifdef ZHFOG
                GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
        #endif

        gl_Position = remapPositionZ(gl_Position);
}
#endGLSL

#defineGLSL unlitPS

    #define SHADER_NAME CurveMap

    #include "Color.glsl";

    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    uniform vec4 u_SceneTintColor;
    uniform vec4 u_SceneTintParams;

    varying vec2 vTexcoord0;

    #ifdef ZHFOG
        varying vec2 v_fogParam;
    #endif

    void main()
    {
        vec2 uv = vTexcoord0;
        
        vec4 albedoSampler = texture2D(u_AlbedoTexture, uv);
        #ifdef Gamma_u_AlbedoTexture
        albedoSampler = gammaToLinear(albedoSampler);
        #endif // Gamma_u_AlbedoTexture
        
        vec3 color = albedoSampler.rgb;
        
        float alpha = albedoSampler.a;
        
        #ifdef ALPHATEST
            if (alpha < u_AlphaTestValue)
                discard;
        #endif

        #ifdef ZHFOG
                ApplyFog(color.rgb,v_fogParam);
        #endif

        float sceneTintStrength = saturate(u_SceneTintParams.x) * u_SceneTintColor.a;
        float sceneTintDesaturate = step(0.5, u_SceneTintParams.y);
        vec3 sceneTintGray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
        color.rgb = mix(color.rgb, sceneTintGray, sceneTintDesaturate);
        color.rgb = mix(color.rgb, u_SceneTintColor.rgb, sceneTintStrength * 0.5);

        gl_FragColor = vec4(color, alpha);
        //gl_FragColor = vec4(uv,0,1);

        gl_FragColor = outputTransform(gl_FragColor);
    }
#endGLSL

GLSL End

