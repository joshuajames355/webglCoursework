precision mediump float;

in vec2 uvCoord;
in vec3 normalOut;
in vec3 positionOutViewSpace;

uniform vec3 lightPos; //in view space

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

void lightingPass(vec4 diffuse)
{
	float ambientStrength = 0.05;
	float diffuseStrength = 0.7;

	vec3 lightColour = vec3(1,1,1);

	#ifdef NORMAL_MAP
		vec3 normal = normalMatrix * normalize(texture(normalMap, vec2(uvCoord.x,1.0f- uvCoord.y)).rgb * 2.0 - 1.0);
	#else
		vec3 normal = normalize(normalOut);
	#endif

	vec3 lightDir = normalize(lightPos - positionOutViewSpace);//direction from fragment to light, in view space

	float diffuseFactor = diffuseStrength * max(dot(lightDir, normal), 0.0 );

	float specularTerm = pow(max(dot(reflect(-lightDir, normal), -normalize(positionOutViewSpace)), 0.0 ), 256.0);
	#ifdef SPECULAR_MAP
		vec3 specular = texture(specularMap, vec2(uvCoord.x,1.0f- uvCoord.y)).xyz * specularTerm * lightColour;
	#else
	# ifdef SPECULAR_CONSTANT
		vec3 specular = specularConstant * lightColour * specularTerm;
	# else
		vec3 specular = lightColour * specularTerm;
	# endif
	#endif

	color = vec4(((ambientStrength + diffuseFactor) * diffuse).xyz + specular, 1.0);
}

void main()
{
	#ifdef DIFFUSE_MAP
		 vec4 diffuse = texture(diffuseMap, vec2(uvCoord.x,1.0f- uvCoord.y));
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
		lightingPass(diffuse);
	#endif

}