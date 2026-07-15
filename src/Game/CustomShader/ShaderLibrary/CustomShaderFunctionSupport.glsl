#ifndef CUSTOM_SHADER_FUNC_SUPPORT
#define CUSTOM_SHADER_FUNC_SUPPORT


#include "Math.glsl";

vec3 TransformObjectToWorldNormal(vec3 normalOS,mat4 worldMatrix)
{
    mat4 normalMat = transpose(inverse(worldMatrix));
    vec3 normalWS = (normalMat * vec4(normalOS,0.0)).xyz;
    return normalize(normalWS);
}

vec3 TransformWorldToObject(vec3 posWS,mat4 worldMatrix)
{
    vec3 posOS = (inverse(worldMatrix) * vec4(posWS, 1.0)).xyz;
    return posOS;
}

//#ifdef FaceToCamera

void ApplyFaceToCamera(inout vec3 positionOS,mat4 worldMatrix,vec3 camPosWS)
{
     vec3 newZ = TransformWorldToObject(camPosWS,worldMatrix);
     newZ = normalize(newZ);
     vec3 newX = abs(newZ.y)<0.999?cross(vec3(0.0,1.0,0.0),newZ):cross(newZ,vec3(0.0,0.0,1.0));
     newX = normalize(newX);
     vec3 newY = cross(newZ, newX);
     newY = normalize(newY);
     positionOS.xyz = newX * positionOS.x + newY * positionOS.y + newZ * positionOS.z;
}
//#endif


//PlaneShadow
#ifdef PLANE_SHADOW
uniform vec3 u_PlaneShadowLightDir;
uniform float u_PlaneShadowPlane;
vec3 GetPlaneShadowPos(vec3 positionWS)
{
    //_PlaneShadowLightDir = _MainLightPosition.xyz;
    vec3 PlaneShadowLightDir = u_PlaneShadowLightDir.xyz;
    //#ifdef CAN_CONTROL_DIR
    //PlaneShadowLightDir = mix(PlaneShadowLightDir.xyz,_CustomLightDir.xyz,_CustomLightDir.w);
    //#endif
    PlaneShadowLightDir = normalize(PlaneShadowLightDir);
    float cosAg = dot(PlaneShadowLightDir,normalize(vec3(0,positionWS.y - u_PlaneShadowPlane,0.0)));
    float sDl = max(0.0,positionWS.y - u_PlaneShadowPlane) / cosAg;
    sDl = max(0.0001,sDl);
    vec3 ShadowPosWS = positionWS - PlaneShadowLightDir * sDl;
    ShadowPosWS.y = u_PlaneShadowPlane;
    return ShadowPosWS;
}
#endif

//#ifdef CURVE_WORLD
uniform vec3 u_CurvePivotPoint;
uniform float u_CurveBendOffset;
uniform float u_CurveBendSize;

void LittlePlanet_Y_Curve(inout vec3 positionWS)
{
    vec3 posWS = positionWS;
    posWS -= u_CurvePivotPoint;

    vec2 offset = max(vec2(0.0, 0.0), abs(posWS.xz) - vec2(u_CurveBendOffset));
    offset *= step(vec2(0.0, 0.0), posWS.xz) * 2.0 - 1.0;
    offset *= offset;
    posWS = vec3(0.0, -(u_CurveBendSize * offset.x + u_CurveBendSize * offset.y) * 0.001, 0.0); 

    positionWS += posWS;
}

void LittleSoftParticle_Y_Curve(inout vec3 positionWS, inout float softStart, inout float softEnd)
{
    vec3 posWS = positionWS;
    posWS -= u_CurvePivotPoint;

    vec2 offset = max(vec2(0.0, 0.0), abs(posWS.xz) - vec2(u_CurveBendOffset));
    offset *= step(vec2(0.0, 0.0), posWS.xz) * 2.0 - 1.0;
    offset *= offset;
    float tmp = (u_CurveBendSize * offset.x + u_CurveBendSize * offset.y) * 0.001;
    float reducedPrecisionRes = tmp;
    posWS = vec3(0.0, -reducedPrecisionRes, 0.0);
    softStart -= reducedPrecisionRes;
    softEnd -= reducedPrecisionRes;

    positionWS += posWS;
}
//#endif

//#ifdef ZHFOG
//#include "Camera.glsl"
uniform vec4 u_ZHFogParam;
uniform vec4 u_ZHFogColor;

#define _ZFogStart u_ZHFogParam.x
#define _ZFogEnd u_ZHFogParam.y
#define _HFogStart u_ZHFogParam.z
#define _HFogEnd u_ZHFogParam.w

void GetFogParam(out vec2 fogParam,float positionWSY,vec4 positionCS,vec4 _ProjectionParams)
{
    float UNITY_Z_0_FAR = max(((positionCS.z/_ProjectionParams.y)*_ProjectionParams.z),0.0);
    fogParam.x = saturate(UNITY_Z_0_FAR * -1.0/(_ZFogEnd-_ZFogStart) + _ZFogEnd/(_ZFogEnd - _ZFogStart));
    fogParam.y = positionWSY;
}

void ApplyFog(inout vec3 color,vec2 fogParam)
{
    float per = fogParam.x;  
    float heighPer = saturate((_HFogEnd - fogParam.y) / (_HFogEnd - _HFogStart));
    //float finalPer = mix(saturate(per + heighPer),per * heighPer,u_ZHFogMix) * u_ZHFogColor.a;
    color.rgb = mix(color.rgb,u_ZHFogColor.rgb,saturate(per + heighPer) * u_ZHFogColor.a);
}

//EffectFog
void ApplyFog(inout vec3 color,vec2 fogParam,float alpha,bool receiveFog,bool additiveFog)
{
    float per = fogParam.x;  
    float heighPer = saturate((_HFogEnd - fogParam.y) / (_HFogEnd - _HFogStart));
    //float finalPer = mix(saturate(per + heighPer),per * heighPer,u_ZHFogMix) * u_ZHFogColor.a;
    vec3 fogCol = u_ZHFogColor.rgb;
    if(receiveFog)
    {
        if(additiveFog)
        {
            fogCol *= alpha;
        }
        color.rgb = mix(color.rgb,fogCol,saturate(per + heighPer) * u_ZHFogColor.a);
    }
    else
    {
        color.rgb = color.rgb;
    }
}

// Perlin噪声函数
float noise(vec2 p)
{
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    vec2 u = i + vec2(0.0, 0.0);
    vec2 v = i + vec2(1.0, 0.0);
    vec2 w = i + vec2(0.0, 1.0);
    vec2 x = i + vec2(1.0, 1.0);

    return mix(mix(noise(u), noise(v), f.x), mix(noise(w), noise(x), f.x), f.y);
}

//非线性插值，解决线性插值的明显突兀
float nonlinearSmoothStep(float edge0, float edge1, float x, float exponent)
{
    x = saturate((x - edge0) / (edge1 - edge0));
    return pow(x,exponent) / (pow(x,exponent) + pow(1.0 - x, exponent));
}

//SoftParticle
uniform float u_SoftParticleStartHeight;
uniform float u_SoftParticleEndHeight;
uniform float u_Softness;
void ApplySoftParticle(in vec3 worldPos, inout float alpha)
{   
    bool judge = (worldPos.y > u_SoftParticleStartHeight) && (worldPos.y < u_SoftParticleEndHeight);
    float flag = float(judge);
    float fade = nonlinearSmoothStep(u_SoftParticleStartHeight, u_SoftParticleEndHeight, worldPos.y, u_Softness);
    float resAlpha = saturate(alpha * fade);
    alpha = mix(alpha,resAlpha,flag);
}

void ApplySoftParticleTemp(in vec3 worldPos, inout float alpha, float start,float end, float softness)
{
    bool judge = (worldPos.y > end) && (worldPos.y < start);
    float flag = float(judge);
    float fade = nonlinearSmoothStep(end, start, worldPos.y, softness);
    float resAlpha = saturate(alpha * fade);
    alpha = mix(alpha,resAlpha,flag);
}

#endif