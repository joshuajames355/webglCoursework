#version 300 es

layout (location = 0) in vec3 position;

uniform mat4 modelViewProjection; //projection * view * model

void main()
{
    gl_Position = modelViewProjection * vec4(position, 1.0);
}