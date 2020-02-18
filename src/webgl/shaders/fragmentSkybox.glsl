#version 300 es

precision mediump float;

uniform samplerCube diffuseMap;

out vec4 color;
in vec3 positionOut;

void main()
{
	color = texture(diffuseMap, normalize(positionOut));
}