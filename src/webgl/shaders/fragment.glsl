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

	float ambientStrength = 0.05;
	float diffuseStrength = 0.7;
	float specularStrength = 1.0;

	vec3 lightColour = vec3(1,1,1);

	vec3 normal = normalize(normalOut);
	vec3 lightDir = normalize(lightPos - positionOutViewSpace);//direction from fragment to light, in view space

	float diffuseFactor = diffuseStrength * max(dot(lightDir, normal), 0.0 );
	float specularFactor = specularStrength * pow(max(dot(reflect(-lightDir, normal), -normalize(positionOutViewSpace)), 0.0 ), 256.0);
	
	color = vec4(((ambientStrength + diffuseStrength) * diffuse).xyz + specularFactor*lightColour, 1.0);
}