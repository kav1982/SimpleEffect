#ifndef EFFECTINSTANCE_MAP
#define EFFECTINSTANCE_MAP

#include "Math.glsl";

varying vec4 v_EntityParam1;
//varying vec4 v_EntityParam2;

#define _DissolveFactor v_EntityParam1.x
#define _DissolveEdge v_EntityParam1.y
#define _RotateAngle v_EntityParam1.z
#define _AnimationSheetProgress v_EntityParam1.w

//EffectCommonSupport
#ifdef EnableDistort
#define _DistortUVAni _DistortParam.xy
#define _DistortFactor _DistortParam.z
#define _DistortScale _DistortParam.w
#endif

#ifdef EnableDissolve
#define _DissolveUVAni _DissolveParam.xy
//#define _DissolveFactor v_EntityParam1.x
#define _DissolveSoft _DissolveParam.w

//#define _DissolveEdge v_EntityParam1.y
#define _DissolveEdgeSoft _DissolveParam2.y
#define _DissolveScale _DissolveParam2.zw
#endif

#ifdef EnableDistort
vec2 getDistortTexUV(vec2 sourceUV,float uTime)
{
     vec2 result = sourceUV * vec2(_DistortScale);
     result += fract(_DistortUVAni * uTime);
     return result;
}
#endif

#ifdef EnableDissolve
vec2 getDissolveTexUV(vec2 sourceUV,float uTime)
{
     vec2 result = sourceUV * _DissolveScale;
     result += fract(_DissolveUVAni * uTime);
     return result;
}
#endif

#ifdef EnableRim

struct RimParam 
{
    vec3 normalWS;
    vec3 viewDirWS;
    vec4 rimColor;
    float rimArea;
    float rimSoft;
    bool rimReverse;
    bool rimAdditive;
};

void ApplyRim(RimParam rimParam,inout vec3 color,inout float alpha)
{
     float rimEdge = 0.0;
     if(rimParam.rimReverse)
     {
          rimEdge = saturate(abs(dot(rimParam.normalWS,rimParam.viewDirWS)) + rimParam.rimArea);
     }
     else
     {
          rimEdge = saturate(1.0-abs(dot(rimParam.normalWS,rimParam.viewDirWS)) + rimParam.rimArea);
     }
     
     rimEdge = smoothstep(0.5 - rimParam.rimSoft,0.5 + rimParam.rimSoft,rimEdge);
     
     if(rimParam.rimAdditive)
     {
          color.rgb = color.rgb + rimEdge * rimParam.rimColor.rgb * rimParam.rimColor.a;
     }
     else
     {
          color.rgb = mix(color.rgb,rimParam.rimColor.rgb,rimEdge);
     }
     alpha = rimParam.rimAdditive ? saturate(alpha + rimParam.rimColor.a * rimEdge) : mix(alpha,rimParam.rimColor.a,rimEdge);
}
#endif

//#ifdef VertexAnim
//#define animScale _VertexAnimParam.x
//#define animSpeed _VertexAnimParam.y
//#define animStrength _VertexAnimParam.z
//#define effectDir _VertexAnimParam.w
void ApplyVertexAnim(inout vec3 positionOS,float uTime,vec4 vertexAnimParam)
{
     float offset = vertexAnimParam.x * sin(uTime * vertexAnimParam.y + positionOS.y * vertexAnimParam.z);
     if(vertexAnimParam.w == 0.0)
     {
         positionOS.z += offset;
     }
     else
     {
         positionOS.x += offset;
     }
}
//#endif

#define PI 3.14159265359
		 
vec2 rotateUV(vec2 uv,float angle)
{
     float a = (angle / 180.0) * PI;
     vec2 pivot = vec2(0.5, 0.5);
     float cosAngle = cos(a);
     float sinAngle = sin(a);
     mat2 rot = mat2(cosAngle, -sinAngle, sinAngle, cosAngle);
     uv = (rot * (uv - pivot)).xy + pivot;
     return uv;
}

#endif