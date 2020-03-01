import Texture from "./texture";
import { vec4 } from "gl-matrix";


export class Material
{
    bDiffuseTexture : boolean = false; //is diffuse channel a texture?
    diffuseTexture? : Texture;

    bDiffuseConstant : boolean = true; //or a constant colour;
    diffuseColour? : vec4;

    bDiffuseCubemap : boolean = false;
    diffuseCubemap : Texture[] = [];

    bSpecularConstant : boolean = true;
    specularConsant : number = 1;

    bSpecularMap : boolean = false;
    specularTexture? : Texture;

    bIsSkybox : boolean = false;

    id: number; //used by the renderer
    constructor()
    {
        this.id = Math.floor(Math.random() * 2147483647);
    }

    setSpecularMap(tex : Texture)
    {
        this.bSpecularConstant = false;
        this.bSpecularMap = true;
        this.specularTexture = tex;
    }
    setSpecularConstant(num : number)
    {
        this.bSpecularConstant = true;
        this.bSpecularMap = false;
        this.specularConsant = num;
    }

    setDiffuseColourVec4(colour : vec4)
    {
        this.bDiffuseConstant = true;
        this.bDiffuseTexture = false;
        this.bDiffuseCubemap = false;
        this.bIsSkybox = false;
        this.diffuseColour = colour;
    }
    static fromColour(colour : vec4)
    {
        var result = new Material();
        result.setDiffuseColourVec4(colour);
        return result;
    }

    setDiffuseMap(tex : Texture)
    {
        this.bDiffuseConstant = false;
        this.bDiffuseTexture = true;
        this.bDiffuseCubemap = false;
        this.bIsSkybox = false;
        this.diffuseTexture = tex;
    }
    static fromDiffuseMap(tex : Texture)
    {
        var result = new Material();
        result.setDiffuseMap(tex);
        return result;
    }

    setDiffuseCubemap(textures : Texture[])
    {
        this.bDiffuseConstant = false;
        this.bDiffuseTexture = false;
        this.bDiffuseCubemap = true;
        this.bIsSkybox = false;

        if(textures.length == 1)
        {
            textures = [textures[0], textures[0], textures[0], textures[0], textures[0], textures[0]];
        }
        this.diffuseCubemap = textures;
    }
    static fromDiffuseCubeMap(tex : Texture[])
    {
        var result = new Material();
        result.setDiffuseCubemap(tex);
        return result;
    }
    static fromDiffuseSpecular(diffuse : Texture, specular : Texture)
    {
        var result = new Material();
        result.setDiffuseMap(diffuse);
        result.setSpecularMap(specular);
        return result;
    }
    static createSkybox(tex : Texture[])
    {
        var result = new Material();
        result.setDiffuseCubemap(tex);
        result.bIsSkybox = true;
        return result;
    }
}