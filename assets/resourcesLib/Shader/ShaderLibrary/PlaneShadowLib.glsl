#ifndef PLANE_SHADOW_PG
#define PLANE_SHADOW_PG

uniform vec4 u_PlaneShadowLightDir;
uniform mediump float u_PlaneShadowPlane;
//uniform mediump float u_PlaneShadowAlpha;

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
    ShadowPosWS.y = u_PlaneShadowPlane + 0.01;
    return ShadowPosWS;
}
#endif