layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normals;
layout (location = 2) in vec2 uvCoordIN;

uniform mat4 modelViewProjection; //projection * view * model
uniform mat4 modelView; //view * model
uniform mat3 normalMatrix; //mat3(transpose(inverse(modelView)))

out vec2 uvCoord;
out vec3 positionOut; //model space
out vec3 positionOutViewSpace; //model space
out vec3 normalOut;

void main()
{
    gl_Position = modelViewProjection * vec4(position, 1.0);
    positionOut = position.xyz;
    positionOutViewSpace = (modelView * vec4(position, 1.0)).xyz;
    normalOut = normalMatrix * normals;
    uvCoord = uvCoordIN;
}