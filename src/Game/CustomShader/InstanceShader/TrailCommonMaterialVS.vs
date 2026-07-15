#define SHADER_NAME TrailCommon

#include "Camera.glsl";
#include "Scene.glsl"
#include "CustomShaderFunctionSupport.glsl";

// Sprite uniform
uniform float u_CurTime;
uniform float u_LifeTime;
uniform vec4 u_WidthCurve[10];
uniform int u_WidthCurveKeyLength;

//uniform vec2 u_UVAnim;

#ifdef ZHFOG
varying vec2 v_fogParam;
#endif

#ifdef ENABLE_MASK
varying vec4 v_Texcoord0;
#else
varying vec2 v_Texcoord0;
#endif

varying vec4 v_Color;

float hermiteInterpolate(float t, float outTangent, float inTangent, float duration, float value1, float value2)
{
    float t2 = t * t;
    float t3 = t2 * t;
    float a = 2.0 * t3 - 3.0 * t2 + 1.0;
    float b = t3 - 2.0 * t2 + t;
    float c = t3 - t2;
    float d = -2.0 * t3 + 3.0 * t2;
    return a * value1 + b * outTangent * duration + c * inTangent * duration + d * value2;
}

float getCurWidth(in float normalizeTime)
{
    float width;
    if (normalizeTime == 0.0)
	{
	    width = u_WidthCurve[0].w;
	}
    else if (normalizeTime >= 1.0)
	{
	    width = u_WidthCurve[u_WidthCurveKeyLength - 1].w;
	}
    else
	{
	    for (int i = 0; i < 10; i++)
		{
		    if (normalizeTime == u_WidthCurve[i].x)
			{
			    width = u_WidthCurve[i].w;
			    break;
			}

		    vec4 lastFrame = u_WidthCurve[i];
		    vec4 nextFrame = u_WidthCurve[i + 1];
		    if (normalizeTime > lastFrame.x && normalizeTime < nextFrame.x)
			{
			    float duration = nextFrame.x - lastFrame.x;
			    float t = (normalizeTime - lastFrame.x) / duration;
			    float outTangent = lastFrame.z;
			    float inTangent = nextFrame.y;
			    float value1 = lastFrame.w;
			    float value2 = nextFrame.w;
			    width = hermiteInterpolate(t, outTangent, inTangent, duration, value1, value2);
			    break;
			}
		}
	}
    return width;
}

void main()
{
    float normalizeTime = (u_CurTime - a_BirthTime) / u_LifeTime;

    vec2 sourceUV = vec2(a_Texcoord0X, 1.0 - a_Texcoord0Y) * u_TilingOffset.xy + u_TilingOffset.zw;
    v_Texcoord0.xy = sourceUV + fract(u_UVAnim.xy * u_Time);
#ifdef ENABLE_MASK
    v_Texcoord0.zw = sourceUV;
#endif

    v_Color = a_Color;

    vec3 cameraPos = (u_View * a_Position).rgb;
    gl_Position = u_Projection * vec4(cameraPos + a_OffsetVector * getCurWidth(normalizeTime), 1.0);

    vec3 positionWS = (inverse(u_ViewProjection) *  gl_Position).xyz;

//#ifdef CURVE_WORLD
    //LittlePlanet_Y_Curve(positionWS);
//#endif

//    gl_Position = getPositionCS(positionWS);

#ifdef ZHFOG
    GetFogParam(v_fogParam,positionWS.y,gl_Position,u_ProjectionParams);
#endif

    gl_Position = remapPositionZ(gl_Position);
}