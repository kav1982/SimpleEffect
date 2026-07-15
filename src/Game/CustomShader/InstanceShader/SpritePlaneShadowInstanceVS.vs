#define SHADER_NAME SpriteInstancePlaneShadow
#include "Camera.glsl";
#include "Sprite3DVertex.glsl";
#include "CustomShaderFunctionSupport.glsl";

//#include "VertexCommon.glsl";
#include "Color.glsl";
varying vec4 v_Color;
varying vec4 v_Texcoord0;
void main() 
{
	//Vertex vertex;
	//getVertexParams(vertex);
	mat4 worldMat = getWorldMatrix();
	vec3 positionWS = (worldMat *vec4(a_Position.xyz, 1.0)).xyz;

#ifdef PLANE_SHADOW
    vec3 shadowPosWS = GetPlaneShadowPos(positionWS);
	gl_Position = getPositionCS(shadowPosWS);
#else
    gl_Position = getPositionCS(positionWS);
#endif

    vec4 spriteUVRect;
    #ifdef GPU_INSTANCE
        spriteUVRect = a_SpriteUVRect;
        v_Color = a_SpriteUVRect;
    #else
        spriteUVRect = vec4(0,0,1,1);
        v_Color = vec4(1,1,1,1);
    #endif
	
    v_Texcoord0.xy = a_Texcoord0.xy;
    vec2 rect = spriteUVRect.zw - spriteUVRect.xy;
    v_Texcoord0.zw = rect * a_Texcoord0.xy + spriteUVRect.xy;

	gl_Position=remapPositionZ(gl_Position);
}