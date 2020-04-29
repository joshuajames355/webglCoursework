import { Material } from "../core/material";
import ShaderProgram from "./webGLShaders";
import { Camera } from "../core/camera";
import { mat4 } from "gl-matrix";
import { bindTexture, bind2DTexture, bindCubeMap } from "./webGLTexture";
import Texture from "../core/texture";

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

    if (material.bSpecularConstant)
    {
        fragmentShader += "#define SPECULAR_CONSTANT\n";
    }
    if (material.bSpecularMap)
    {
        fragmentShader += "#define SPECULAR_MAP\n";
    }
    if (material.bTileTexures)
    {
        fragmentShader += "#define TILE_TEXTURES\n";
    }

    var vertexShader = "#version 300 es\n";

    return new ShaderProgram(gl, vertexShader + vertexSource, fragmentShader + fragmentSource);
}

export class WebGLMaterialState
{
    program: ShaderProgram;
    diffuseTexture?: WebGLTexture; 
    specularTexture?: WebGLTexture;

    bDiffuseTextureLoaded : boolean = false;
    bSpecularTextureLoaded : boolean = false;

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
            var textureId = gl.createTexture();
            if (textureId == null)
            {
                throw "Failed to create Texture";
            }
            state.diffuseTexture = textureId;
        }
        
        bindCubeMap(gl, gl.TEXTURE0, material.diffuseCubemap.map((tex : Texture) => tex.image), state.diffuseTexture, state.bDiffuseTextureLoaded);
        state.bDiffuseTextureLoaded = true;
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
        }

        bind2DTexture(gl, gl.TEXTURE0, material.diffuseTexture.image, state.diffuseTexture, state.bDiffuseTextureLoaded);
        state.bDiffuseTextureLoaded = true;
    }
    //handles specular map
    if(material.bSpecularMap && material.specularTexture)
    {
        if(state.specularTexture == null)
        {
            var textureId = gl.createTexture();
            if (textureId == null)
            {
                throw "Failed to create Texture";
            }
            state.specularTexture = textureId;
        }

        bind2DTexture(gl, gl.TEXTURE1, material.specularTexture.image, state.specularTexture, state.bSpecularTextureLoaded);
        state.bSpecularTextureLoaded = true;
    }

    //handles constant colours
    if(material.bDiffuseConstant && material.diffuseColour)
    {
        state.program.bindDiffuseColour(gl, material.diffuseColour);
    }
    //handles specular constant
    if(material.bSpecularConstant && material.specularConsant)
    {
        state.program.bindSpecularConstant(gl, material.specularConsant);
    }

    state.program.bindTileConstants(gl, material.tileTexturesX, material.tileTexturesY);    
}

//run once per object rendered with the material
export function materialPreRenderStep(gl : WebGL2RenderingContext, material : Material, state : WebGLMaterialState, camera : Camera, modelMat : mat4)
{
    state.program.bindUniforms(gl, modelMat, camera.getViewMatrix(), camera.getProjectionMatrix());
}