#define SHADER_NAME BakeMeshInstance
#include "Color.glsl";
#include "CustomShaderFunctionSupport.glsl";

varying vec4 v_Texcoord0;

#ifdef ZHFOG
varying vec2 v_fogParam;
#endif
//uniform sampler2D u_AtlasTexture;

void main()
{
    vec2 mainUV = v_Texcoord0.xy;
	vec4 color = texture2D(u_AlbedoTexture,mainUV);
    #ifdef Gamma_u_AlbedoTexture
        color = gammaToLinear(color);
    #endif // Gamma_u_AlbedoTexture

#ifdef UV1
    vec2 lightmapUV = v_Texcoord0.zw;
    vec4 lightMapCol = texture2D(u_CustomLightMap,lightmapUV);
    #ifdef Gamma_u_CustomLightMap
        lightMapCol = gammaToLinear(lightMapCol);
    #endif // Gamma_u_CustomLightMap
    color.rgb *= pow(lightMapCol.rgb,vec3(u_LightMapContrast)) * u_LightMapHDRScale;
#endif

// #ifdef DITHER_CLIP
// 	if(GetDitherClip(gl_FragCoord.xyz))
// 	{
// 		discard;
// 	}
// #endif

#ifdef ZHFOG
    ApplyFog(color.rgb,v_fogParam);
#endif

    float sceneTintStrength = saturate(u_SceneTintParams.x) * u_SceneTintColor.a;
    float sceneTintDesaturate = step(0.5, u_SceneTintParams.y);
    vec3 sceneTintGray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
    color.rgb = mix(color.rgb, sceneTintGray, sceneTintDesaturate);
    color.rgb = mix(color.rgb, u_SceneTintColor.rgb, sceneTintStrength * 0.5);

	gl_FragColor = color;

    gl_FragColor = outputTransform(gl_FragColor);
}