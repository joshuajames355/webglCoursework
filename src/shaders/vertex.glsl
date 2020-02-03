#version 300 es
  
layout (location = 0) in vec3 position;

uniform mat4 modelViewProjection; //projection * view * model
uniform mat4 modelView;

void main()
{
    gl_Position = modelViewProjection * vec4(position.x, position.y, position.z, 1.0);
}