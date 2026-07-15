#define SHADER_NAME BakeMeshInstance
#include "Camera.glsl";
#include "Sprite3DVertex.glsl";

//#include "VertexCommon.glsl";
#include "Color.glsl";
#include "CustomShaderFunctionSupport.glsl";
varying vec4 v_Texcoord0;

#ifdef ZHFOG
varying vec2 v_fogParam;
#endif

void main() 
{
	//Vertex vertex;
	//getVertexParams(vertex);
	mat4 worldMat = getWorldMatrix();
	vec3 positionWS = (worldMat *vec4(a_Position.xyz, 1.0)).xyz; 
//#ifdef CURVE_WORLD
    LittlePlanet_Y_Curve(positionWS);
//#endif

	gl_Position = getPositionCS(positionWS);

    vec4 customLightmapScaleOffset;
    #ifdef GPU_INSTANCE
        customLightmapScaleOffset = a_customLightmapScaleOffset;
    #else
        customLightmapScaleOffset = vec4(1,1,0,0);
    #endif
	
    v_Texcoord0.xy = a_Texcoord0.xy;
    #ifdef UV1
    v_Texcoord0.zw = a_Texcoord1.xy * customLightmapScaleOffset.xy + customLightmapScaleOffset.zw;
    #endif

#ifdef ZHFOG
    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
#endif

	gl_Position=remapPositionZ(gl_Position);
}