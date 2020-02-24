import { Material } from "../core/material";
import ShaderProgram from "./webGLShaders";
import { Camera } from "../core/camera";
import { mat4 } from "gl-matrix";
import { isFunction } from "util";

const fragmentSource = require("./shaders/fragment.glsl");
const vertexSource = require("./shaders/vertex.glsl");

const fragmentSkyboxSource = require("./shaders/fragmentSkybox.glsl");
const vertexSkyboxSource = require("./shaders/vertexSkybox.glsl");

export function getShaderFromMaterial(gl : WebGL2RenderingContext, material : Material) : ShaderProgram
{
    if(material.bIsSkybox)
    {
        return new ShaderProgram(gl, vertexSkyboxSource, fragmentSkyboxSource); 
    }

    var fragmentShader = "#version 300 es\n";
    if (material.bDiffuseTexture)
    {
        fragmentShader += "#define DIFFUSE_MAP\n";
    }
    if (material.bDiffuseConstant)
    {
        fragmentShader += "#define DIFFUSE_CONSTANT\n";
    }
    if (material.bDiffuseCubemap)
    {
        fragmentShader += "#define DIFFUSE_CUBEMAP\n";
    }

    var vertexShader = "#version 300 es\n";

    return new ShaderProgram(gl, vertexShader + vertexSource, fragmentShader + fragmentSource);
}

export class WebGLMaterialState
{
    program: ShaderProgram;
    diffuseTexture?: WebGLTexture; 
    bDiffuseTextureLoaded : boolean = false;
    bCubeMapLoaded? : boolean[];

    constructor(shader : ShaderProgram)
    {
        this.program = shader;
    }
}

//run once , loads textures
export function materialGlobalStep(gl : WebGL2RenderingContext, material : Material, state : WebGLMaterialState)
{
    state.program.use(gl);

    //handles diffuse cubemaps
    if(material.bDiffuseCubemap && material.diffuseCubemap.length == 6)
    {
        if(state.diffuseTexture == null)
        {
            state.bCubeMapLoaded = [false, false, false, false, false, false];

            var textureId = gl.createTexture();
            if (textureId == null)
            {
                throw "Failed to create Texture";
            }
            state.diffuseTexture = textureId;

            gl.bindTexture(gl.TEXTURE_CUBE_MAP, state.diffuseTexture);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            var isComplete = true;
            for(var x : number = 0; x < 6; x++)
            {
                if(!material.diffuseCubemap[x].image.complete)
                {
                    isComplete = false;
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1,1,1,1]))
            
                }
                else
                {
                    state.bCubeMapLoaded[x] = true;
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material.diffuseCubemap[x].image);
                }
                state.bDiffuseTextureLoaded = isComplete;
            }
        }
        else if(state.bDiffuseTextureLoaded)
        {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, state.diffuseTexture);
        }    
        else
        {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, state.diffuseTexture);
            var isComplete = true;

            if(!state.bCubeMapLoaded) state.bCubeMapLoaded = [false, false, false, false, false, false];

            for(var x : number = 0; x < 6; x++)
            {
                if(!material.diffuseCubemap[x].image.complete)
                {
                    isComplete = false;
                }
                else
                {
                    state.bCubeMapLoaded[x] = true;
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material.diffuseCubemap[x].image);
                }
                state.bDiffuseTextureLoaded = isComplete;
            }
        }        

    }
    //handles diffuse map
    else if(material.bDiffuseTexture && material.diffuseTexture)
    {
        if(state.diffuseTexture == null)
        {
            var textureId = gl.createTexture();
            if (textureId == null)
            {
                throw "Failed to create Texture";
            }
            state.diffuseTexture = textureId;

            gl.bindTexture(gl.TEXTURE_2D, state.diffuseTexture);
            if(!material.diffuseTexture.image.complete)
            {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]))
            }
            else
            {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material.diffuseTexture.image);
    
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

                state.bDiffuseTextureLoaded = true;
            }
        }
        else if(!state.bDiffuseTextureLoaded && material.diffuseTexture.image.complete)
        {
            gl.bindTexture(gl.TEXTURE_2D, state.diffuseTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material.diffuseTexture.image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            state.bDiffuseTextureLoaded = true;
        }
        else
        {
            gl.bindTexture(gl.TEXTURE_2D, state.diffuseTexture);
        }
    }

    //handles constant colours
    if(material.bDiffuseConstant && material.diffuseColour)
    {
        state.program.bindDiffuseColour(gl, material.diffuseColour);
    }
}

//run once per object rendered with the material
export function materialPreRenderStep(gl : WebGL2RenderingContext, material : Material, state : WebGLMaterialState, camera : Camera, modelMat : mat4)
{
    state.program.bindUniforms(gl, modelMat, camera.getViewMatrix(), camera.getProjectionMatrix());
}