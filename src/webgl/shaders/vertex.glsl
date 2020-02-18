#version 300 es
  
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normals;
layout (location = 2) in vec2 uvCoordIN;

uniform mat4 modelViewProjection; //projection * view * model
uniform mat4 modelView;

out vec2 uvCoord;

void main()
{
    gl_Position = modelViewProjection * vec4(position.x, position.y, position.z, 1.0);
    uvCoord = uvCoordIN;
}