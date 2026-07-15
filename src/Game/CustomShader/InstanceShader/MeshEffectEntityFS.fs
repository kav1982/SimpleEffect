#define SHADER_NAME MeshEffectEntity
#include "Color.glsl";
#include "Scene.glsl";
#include "CustomShaderFunctionSupport.glsl";
#include "EffectInstanceMap.glsl";

varying vec4 v_Color;
varying vec4 v_Texcoord0;

#ifdef EnableDissolve
    varying vec2 v_dissolveUV;
#endif

#ifdef EnableDistort
    varying vec2 v_distortUV;
#endif

#ifdef EnableRim
    varying vec3 v_NormalWS;
    varying vec3 v_viewDirWS;
#endif

//#ifdef ZHFOG
varying vec2 v_fogParam;

varying vec3 worldPosXYZ;
varying float softStart;
varying float softEnd;
//#endif
//uniform sampler2D u_AtlasTexture;

void main()
{
        vec2 mainUV;
    #ifdef UseAnimationSheet
        vec2 uv = v_Texcoord0.xy;
        float row = max(1.0, u_SheetParam.x);
        float column = max(1.0, u_SheetParam.y);
        vec2 scale = vec2(1.0) / vec2(column, row);
        float progress;
        if(_EnableAnimControl)
        {
             progress = _AnimationSheetProgress * row * column;
        }
        else
        {
             progress = mod(u_Time * u_SheetParam.z, 500.0);
        }
        uv = (uv + vec2(floor(progress - floor(progress / column) * column), row - (1.0 - floor(progress / column)))) * scale;
        mainUV = fract(uv);
    #else
        mainUV = v_Texcoord0.xy;
    #endif
        
        float distort = 0.0;
    #ifdef EnableDistort
        vec4 distortCol = texture2D(_DistortMap,v_distortUV);
        distort = distortCol.r * _DistortFactor;
    #endif
        
        if(_AlbedoReceiveDistort)
        {
            mainUV += vec2(distort);
        }
        
        vec4 albedoColor = v_Color * u_AlbedoColorStrength;

        vec3 color = albedoColor.rgb;
        mediump float alpha = albedoColor.a;

    //#ifdef ALBEDOTEXTURE
        vec4 albedoSampler = texture2D(u_AlbedoTexture, mainUV);
        #ifdef Gamma_u_AlbedoTexture
        albedoSampler = gammaToLinear(albedoSampler);
        #endif // Gamma_u_AlbedoTexture
        color *= albedoSampler.rgb;
        alpha *= albedoSampler.a;
    //#endif // ALBEDOTEXTURE

    #ifdef SUBTEXTURE
        vec4 subSampler = texture2D(u_SubTexture, mainUV);
        #ifdef Gamma_u_SubTexture
        subSampler = gammaToLinear(subSampler);
        #endif
        color = mix(color * subSampler.rgb,color + subSampler.rgb,_AlbedoTextureUVAnim.w);
        alpha = mix(alpha * subSampler.a,alpha + subSampler.a,_AlbedoTextureUVAnim.w);
    #endif
        
    #ifdef EnableDissolve
        vec2 dissolveUV = v_dissolveUV;
        if(_DissolveReceiveDistort)
        {
            dissolveUV += vec2(distort);
        }
        vec4 ClipTexCol = texture2D(_DissolveMap,dissolveUV.xy);
        mediump float clipSource = min(ClipTexCol.r, ClipTexCol.a);
        mediump vec2 dissolveData = vec2(_DissolveFactor,_DissolveEdge);
        dissolveData = dissolveData * 2.0 - 1.0;
        mediump vec2 soft = vec2(_DissolveSoft,_DissolveEdgeSoft);
        mediump float clipArea = clipSource - dissolveData.x;
        mediump float clipEdge = saturate(clipArea - dissolveData.y);
        
        mediump vec2 ClipAreaAndEdge = smoothstep(0.5 - soft, 0.5 + soft, vec2(clipArea, clipEdge));
        ClipAreaAndEdge.y = 1.0 - ClipAreaAndEdge.y;
        //color.rgb += _DissolveEdgeColor.rgb * ClipAreaAndEdge.y;
        color.rgb = mix(color.rgb,_DissolveEdgeColor.rgb,ClipAreaAndEdge.y);
        alpha *= ClipAreaAndEdge.x;
    #endif
    

    #ifdef COLOR
        #ifdef ENABLEVERTEXCOLOR
        vec4 vertexColor = v_Color;
        color *= vertexColor.rgb;
        alpha *= vertexColor.a;
        #endif // ENABLEVERTEXCOLOR
    #endif // COLOR

    #ifdef FOG
        color = scenUnlitFog(color);
    #endif // FOG

#ifdef EnableMask
        vec2 maskUV = v_Texcoord0.zw;
        if(_MaskReceiveDistort)
        {
            maskUV += vec2(distort);
        }
        vec4 maskCol = texture2D(_MaskMap,maskUV);
        float mask = maskCol.r;
        if(_MaskChannelA)
        {
            mask = maskCol.a;
        }
        alpha *= mask;
#endif

#ifdef EnableRim
        RimParam rimParam;
        rimParam.normalWS = v_NormalWS;
        rimParam.viewDirWS = v_viewDirWS;
        rimParam.rimColor = _RimColor;
        rimParam.rimArea = _RimArea;
        rimParam.rimSoft = _RimSoft;
        rimParam.rimReverse = _RimReverse;
        rimParam.rimAdditive = _RimAdditive;
        
        ApplyRim(rimParam,color.rgb,alpha);
#endif

#ifdef ALPHATEST
        if (alpha < u_AlphaTestValue)
            discard;
#endif // ALPHATEST

//#ifdef ZHFOG
//        #ifdef ADDITIVEFOG
//        ApplyFog(color.rgb,v_fogParam,alpha);
//        #else
//        ApplyFog(color.rgb,v_fogParam);
//        #endif
//#endif
        if(_EnableSoftParticle && _EnableSoftMoveWithCurve)
        {
            ApplySoftParticleTemp(worldPosXYZ, alpha,softStart,softEnd,_Softness);
        }
        else if(_EnableSoftParticle)
        {
            ApplySoftParticleTemp(worldPosXYZ, alpha,_SoftParticleStartHeight,_SoftParticleEndHeight,_Softness);
        }

        ApplyFog(color.rgb,v_fogParam,alpha,_ReceiveFog,_AdditiveFog);

        gl_FragColor = vec4(color, alpha);

        gl_FragColor = outputTransform(gl_FragColor);
}