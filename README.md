WebGL Coursework by Joshua Smith

Usage Guide-----------------------------------------------------------------------

to run, first install npm, and then run
"npm install" and "npm run start"

then avaliable on 127.0.0.1:8080.

Overview----------------------------------------------------------------------

source code in the /src folder.
raw assets material in the assets folder (ie blender project files, photographs used to create textures etc).

Inside the src folder their are 3 subdirs:
1. /src/assets - exported assets (actually used by the program).
2. /src/core - Game logic layer (seperate from the renderer). This include definitions of objects/components (my interpretation of a scene graph), cameras, materials etc.
3. /src/webgl - the webgl renderer. Supports an arbritary number of objects/lights(simple phong model)/components etc.
Their are also 2 files that are responsible for the living room scene.
1. /src/meshes.ts - defines all objects used.
2. /src/main.ts - entry point, defines the scene and contains the main loop.

This uses webpack to build (embed dependencies, compile typescript to javascript etc), compiled code can be found in /dist.

Most assets created in blender and exported as an obj file. I have written a simple obj importer (/src/core/staticMesh.ts).

Texturing is done via UV coordinates exported through blender per vertex (or entered manually in 1 instance) and passed to the shader. I have used both diffuse and specular maps.

All "Animations" are defined in the tick functions of the Objects in question. see /src/meshes.ts. 
The animated objects are the dangling light, the door, the tv, the button and the gun.

I have used glMatrix for matrix calculations.

I have written a simple shader "compiler" that generates a number of possible shaders from one glsl file (/src/webgl/shaders/fragment.glsl) using preprocessor declarations based on material data. see /src/webgl/webGLMaterial.ts.

Credits-------------------------------------------------------------------------------------------

skybox from https://www.turbosquid.com/FullPreview/Index.cfm/ID/348109. 
All other assets made by me. (using blender/paint.net/gimp and samsung s8+ camera).