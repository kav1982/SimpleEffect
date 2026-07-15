#define SHADER_NAME SpriteInstance
#include "Color.glsl";
#include "CustomShaderFunctionSupport.glsl"

varying vec4 v_Texcoord0;
#ifdef ZHFOG
varying vec2 v_fogParam;
#endif
//uniform sampler2D u_AtlasTexture;
//varying vec4 albedo;

void main()
{
	vec4 color =  texture2D(u_AtlasTexture,v_Texcoord0.zw);
	#ifdef Gamma_u_AtlasTexture
		color = gammaToLinear(color);
	#endif // Gamma_u_AtlasTexture

#ifdef ALPHATEST
	if(color.a < u_AlphaCutOff)
	{
		discard;
	}
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
// #ifdef ALPHATEST
// 	gl_FragColor = albedo;
// #else
// 	gl_FragColor = color;
// #endif
	gl_FragColor = color;
    gl_FragColor = outputTransform(gl_FragColor);
}