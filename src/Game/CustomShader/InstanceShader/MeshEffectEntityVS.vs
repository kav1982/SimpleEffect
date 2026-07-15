#define SHADER_NAME MeshEffectEntity

//#include "Math.glsl";

#include "Scene.glsl";

#include "Camera.glsl";
#include "Sprite3DVertex.glsl";

//#include "VertexCommon.glsl";
#include "CustomShaderFunctionSupport.glsl";
#include "EffectInstanceMap.glsl";

varying vec4 v_Color;

#ifdef UV
    varying vec4 v_Texcoord0;

    #ifdef EnableDissolve
    varying vec2 v_dissolveUV;
    #endif

    #ifdef EnableDistort
    varying vec2 v_distortUV;
    #endif
#endif // UV

#ifdef EnableRim
    varying vec3 v_NormalWS;
    varying vec3 v_viewDirWS;
#endif

varying vec3 worldPosXYZ;
varying float softStart;
varying float softEnd;

//#ifdef ZHFOG
varying vec2 v_fogParam;
//#endif

void main() 
{
    vec4 tilingOffset;
    vec4 maskTilingOffset;
    #ifdef GPU_INSTANCE
        v_Color = a_EntityColor;
        tilingOffset = vec4(u_TilingOffset.xy,a_EntityTilingOffset.xy);
        maskTilingOffset = vec4(_MaskTilingOffset.xy,a_EntityTilingOffset.zw);
        v_EntityParam1 = a_EntityParam1;
    #else
        v_Color = vec4(1,1,1,1);
        tilingOffset = u_TilingOffset;
        maskTilingOffset = _MaskTilingOffset;
    #endif

#ifdef UV

    #ifdef UseAnimationSheet
        v_Texcoord0.xy = rotateUV(a_Texcoord0,_RotateAngle);
    #else
        v_Texcoord0.xy = transformUV(a_Texcoord0, tilingOffset);
        v_Texcoord0.xy = rotateUV(v_Texcoord0.xy,_RotateAngle);
        v_Texcoord0.xy += fract(_AlbedoTextureUVAnim.xy * u_Time);
    #endif

        v_Texcoord0.zw = transformUV(a_Texcoord0, maskTilingOffset);
        v_Texcoord0.zw += fract(_MaskUVAnim.xy * u_Time);

    #ifdef EnableDistort
        v_distortUV = getDistortTexUV(a_Texcoord0,u_Time);
    #endif
        
    #ifdef EnableDissolve
        v_dissolveUV.xy = getDissolveTexUV(a_Texcoord0,u_Time);
    #endif    
#endif

    vec3 positionOS = a_Position.xyz;

	mat4 worldMat = getWorldMatrix();
    if(FaceToCamera)
    {
        ApplyFaceToCamera(positionOS.xyz,worldMat,u_CameraPos);
    }
	vec3 positionWS = (worldMat *vec4(positionOS.xyz, 1.0)).xyz; 
//#ifdef CURVE_WORLD
    if(_EnableSoftParticle){
        softStart = _SoftParticleStartHeight;
        softEnd = _SoftParticleEndHeight;
        LittleSoftParticle_Y_Curve(positionWS, softStart,softEnd);
    }else{
        LittlePlanet_Y_Curve(positionWS);
    }
//#endif
    worldPosXYZ = positionWS;
    #ifdef EnableRim
        v_NormalWS = TransformObjectToWorldNormal(a_Normal,worldMat);
        v_viewDirWS = getViewDirection(positionWS);
    #endif

	gl_Position = getPositionCS(positionWS);

//#ifdef ZHFOG
    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
//#endif

	gl_Position=remapPositionZ(gl_Position);
}