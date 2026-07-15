#define SHADER_NAME SpriteInstancePlaneShadow
#include "Color.glsl";

varying vec4 v_Color;
varying vec4 v_Texcoord0;
//uniform sampler2D u_AtlasTexture;
uniform vec4 u_PlaneShadowColor;

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

	gl_FragColor = u_PlaneShadowColor;

    gl_FragColor = outputTransform(gl_FragColor);
}