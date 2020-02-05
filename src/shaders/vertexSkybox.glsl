#version 300 es
  
layout (location = 0) in vec3 position;

uniform mat4 modelView;
uniform mat4 projection;

out vec3 positionOut;

void main()
{
    gl_Position = projection * mat4(mat3(modelView)) * vec4(position.x, position.y, position.z, 1.0);
    positionOut = position.xyz;
}