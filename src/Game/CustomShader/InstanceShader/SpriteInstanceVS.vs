#define SHADER_NAME SpriteInstance
#include "Camera.glsl";
#include "Sprite3DVertex.glsl";
#include "Scene.glsl";
//#include "VertexCommon.glsl";
#include "Color.glsl";
#include "CustomShaderFunctionSupport.glsl";
varying vec4 v_Texcoord0;

#ifdef ZHFOG
varying vec2 v_fogParam;
#endif

//varying vec4 albedo;

void main() 
{
	//Vertex vertex;
	//getVertexParams(vertex);
    vec3 vertex = a_Position.xyz;
	mat4 worldMat = getWorldMatrix();

    vec3 worldPosition = (worldMat *vec4(vertex, 1.0)).xyz; 
    // 生成随机偏移量
    float randomSeed = dot(worldPosition.xyz, vec3(12.9898, 78.233, 459.678));
    float randomOffset = fract(sin(randomSeed) * 43758.5453 + cos(randomSeed) * 487.5453);

    randomOffset = fract(randomOffset + (worldPosition.x + worldPosition.z + worldPosition.y));

    vec2 noise = vec2(worldPosition.x, worldPosition.z) * 0.1 + u_Time * a_WindParam.y;
    float wave = smoothNoise(noise) * (a_WindParam.x + randomOffset);

    float heightFactor = vertex.y;
    wave *= saturate(heightFactor - a_WindParam.z);

    vec3 originalPosition = vertex.xyz;
    vec3 windEffect = vec3(wave * a_WindDirection.x, 0, wave * a_WindDirection.z);
    vertex.xyz = mix(originalPosition, originalPosition + windEffect, a_WindDirection.w);

	vec3 positionWS = (worldMat *vec4(vertex, 1.0)).xyz; 
//#ifdef CURVE_WORLD
    LittlePlanet_Y_Curve(positionWS);
//#endif

	gl_Position = getPositionCS(positionWS);

    vec4 spriteUVRect;
    #ifdef GPU_INSTANCE
        spriteUVRect = a_SpriteUVRect;
    #else
        spriteUVRect = vec4(0,0,1,1);
    #endif
	
    v_Texcoord0.xy = a_Texcoord0.xy;
    vec2 rect = spriteUVRect.zw - spriteUVRect.xy;
    v_Texcoord0.zw = rect * a_Texcoord0.xy + spriteUVRect.xy;
    //albedo = a_Color;

#ifdef ZHFOG
    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
#endif

	gl_Position=remapPositionZ(gl_Position);
}