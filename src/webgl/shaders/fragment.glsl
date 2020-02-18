#version 300 es

precision mediump float;

in vec2 uvCoord;

out vec4 color;

#ifdef DIFFUSE_MAP
	uniform sampler2D diffuseMap;
#endif

#ifdef DIFFUSE_CONSTANT
	uniform vec4 diffuseConstant;
#endif

void main()
{
	vec4 diffuse;

	#ifdef DIFFUSE_MAP
		diffuse = texture(diffuseMap, vec2(uvCoord.x,1.0f- uvCoord.y));
	#endif

	#ifdef DIFFUSE_CONSTANT
		diffuse = diffuseConstant;
	#endif


	color = diffuse;
}