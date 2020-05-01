precision mediump float;

in vec2 uvCoord;
in vec3 normalOut;
in vec3 positionOutViewSpace;

struct Light
{
	vec3 pos;
	vec3 colour;
};

uniform Light lightArr[NUM_LIGHTS];

out vec4 color;

#ifdef DIFFUSE_MAP
	uniform sampler2D diffuseMap;
#endif
#ifdef DIFFUSE_CONSTANT
	uniform vec4 diffuseConstant;
#endif
#ifdef DIFFUSE_CUBEMAP
	uniform samplerCube diffuseMap;
	in vec3 positionOut; //in model space
#endif

#ifdef SPECULAR_MAP
	uniform sampler2D specularMap;
#endif
#ifdef SPECULAR_CONSTANT
	uniform float specularConstant;
#endif

#ifdef NORMAL_MAP
	uniform sampler2D normalMap;
	uniform mat3 normalMatrix; 
#endif

#ifdef TILE_TEXTURES
	uniform float tileX;
	uniform float tileY;
#endif

void lightingPass(vec4 diffuse, vec2 texCoords)
{
	vec3 ambientStrength = vec3(0.1,0.1,0.1);
	float diffuseStrength = 0.7;

	vec3 specularFactor = vec3(0,0,0);
	vec3 diffuseFactor = vec3(0,0,0);

	#ifdef NORMAL_MAP
		vec3 normal = normalMatrix * normalize(texture(normalMap, vec2(uvCoord.x,1.0f- uvCoord.y)).rgb * 2.0 - 1.0);
	#else
		vec3 normal = normalize(normalOut);
	#endif

	for (int i = 0; i < NUM_LIGHTS; i++)
	{
		vec3 lightDir = normalize(lightArr[i].pos - positionOutViewSpace);//direction from fragment to light, in view space

		diffuseFactor += diffuseStrength * max(dot(lightDir, normal), 0.0 ) * lightArr[i].colour;
		specularFactor += pow(max(dot(reflect(-lightDir, normal), -normalize(positionOutViewSpace)), 0.0 ), 256.0)  * lightArr[i].colour;
	}

	#ifdef SPECULAR_MAP
		vec3 specular = texture(specularMap, texCoords).xyz * specularFactor;
	#else
	# ifdef SPECULAR_CONSTANT
		vec3 specular = specularConstant * specularFactor;
	# else
		vec3 specular = specularFactor;
	# endif
	#endif

	color = vec4((vec4(ambientStrength + diffuseFactor, 1) * diffuse).xyz + specular, 1.0);
}

void main()
{
	#ifdef TILE_TEXTURES
		float i;
		vec2 texCoords = vec2(
			modf(uvCoord.x * tileX, i), 
			modf((1.0f - uvCoord.y) * tileY, i)
		);
	#else
		vec2 texCoords = vec2(uvCoord.x, 1.0f- uvCoord.y);
	#endif

	#ifdef DIFFUSE_MAP
		vec4 diffuse = texture(diffuseMap, texCoords);
	#else 
	# ifdef DIFFUSE_CONSTANT
		vec4 diffuse = diffuseConstant;
	# else 
	#  ifdef DIFFUSE_CUBEMAP
		vec4 diffuse = texture(diffuseMap, normalize(positionOut));
	#  else 
		vec4 diffuse = vec4(1.0, 0.0, 0.0, 1.0); //a reasonable default (solid red)
	#  endif
	# endif
	#endif

	#ifdef SKIP_LIGHTING
		color = diffuse;
	#else
		lightingPass(diffuse, texCoords);
	#endif

}