import { Material } from "./material";
import { mat4 } from "gl-matrix";

//Has a shader and render function
//Designed to be combined via compisition with other components inside an object class
export default class RenderableComponent
{
    id: number; //used by the renderer
    material: Material;

    vertices: number[] = []; //8 values for each - x, y, z , nx, ny, nz, u, v 
    indices: number[] = [];

    constructor(material : Material)
    {
        this.id = Math.floor(Math.random() * 2147483647);
        this.material = material;
    }

    getModelMatrix() : mat4
    {
        return mat4.create();
    }
}