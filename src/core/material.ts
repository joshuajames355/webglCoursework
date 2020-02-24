import Texture from "../texture";
import { vec4 } from "gl-matrix";


export class Material
{
    bDiffuseTexture : boolean = false; //is diffuse channel a texture?
    diffuseTexture? : Texture;

    bDiffuseConstant : boolean = true; //or a constant colour;
    diffuseColour? : vec4;

    id: number; //used by the renderer
    constructor()
    {
        this.id = Math.floor(Math.random() * 2147483647);
    }

    setDiffuseColourVec4(colour : vec4)
    {
        this.bDiffuseConstant = true;
        this.bDiffuseTexture = false;
        this.diffuseColour = colour;
    }
    static fromColour(colour : vec4)
    {
        var result = new Material();
        result.setDiffuseColourVec4(colour);
        return result;
    }

    setDiffuseTexture(tex : Texture)
    {
        this.bDiffuseConstant = false;
        this.bDiffuseTexture = true;
        this.diffuseTexture = tex;
    }
    static fromDiffuseMap(tex : Texture)
    {
        var result = new Material();
        result.setDiffuseTexture(tex);
        return result;
    }
}