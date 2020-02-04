#version 300 es

precision mediump float;

in vec2 uvCoord;
uniform sampler2D diffuseMap;

out vec4 color;

void main()
{
	color = texture(diffuseMap, vec2(uvCoord.x,1.0f- uvCoord.y));
}