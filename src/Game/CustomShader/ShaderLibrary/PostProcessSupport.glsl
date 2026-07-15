#ifndef POSTPROCESS_SUPPORT
#define POSTPROCESS_SUPPORT

vec3 ApplyVignette(vec3 inputCol, vec2 uv, vec2 center, float intensity, float roundness, float smoothness, vec3 vigColor)
{
    vec2 dist = abs(uv - center) * intensity;

    dist.x *= roundness;
    float vfactor = pow(saturate(1.0 - dot(dist, dist)), smoothness);
    return inputCol * mix(vigColor, vec3(1.0), vec3(vfactor));
}

#ifdef GAUSSIAN_BLUR
	const vec4 GaussWeight[7] =
	vec4[](
		vec4(0.0205,0.0205,0.0205,0.0),
		vec4(0.0855,0.0855,0.0855,0.0),
		vec4(0.232,0.232,0.232,0.0),
		vec4(0.324,0.324,0.324,1.0),
		vec4(0.232,0.232,0.232,0.0),
		vec4(0.0855,0.0855,0.0855,0.0),
		vec4(0.0205,0.0205,0.0205,0.0)
	);
#endif

#endif