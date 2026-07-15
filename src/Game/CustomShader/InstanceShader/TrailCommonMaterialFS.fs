#define SHADER_NAME TrailCommon

#include "Color.glsl";
#include "Scene.glsl";
#include "CustomShaderFunctionSupport.glsl";

#ifdef ENABLE_MASK
varying vec4 v_Texcoord0;
#else
varying vec2 v_Texcoord0;
#endif

varying vec4 v_Color;

#ifdef ZHFOG
varying vec2 v_fogParam;
#endif

void main()
{
    vec4 color = 2.0 * u_MainColor * v_Color;

//#ifdef MAINTEXTURE
    vec4 mainTextureColor = texture2D(u_MainTexture, v_Texcoord0.xy);
    #ifdef Gamma_u_MainTexture
    mainTextureColor = gammaToLinear(mainTextureColor);
    #endif // Gamma_u_MainTexture

    color *= mainTextureColor;
//#endif
#ifdef ENABLE_MASK
    vec4 maskCol = texture2D(u_MaskMap, v_Texcoord0.zw);
    color.a *= maskCol.r;
#endif

#ifdef ZHFOG
        #ifdef ADDITIVEFOG
        ApplyFog(color.rgb,v_fogParam,color.a);
        #else
        ApplyFog(color.rgb,v_fogParam);
        #endif
#endif

    gl_FragColor = color;

    gl_FragColor = outputTransform(gl_FragColor);
}
