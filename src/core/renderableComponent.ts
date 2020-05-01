import { Material } from "./material";
import { mat4, vec3, quat } from "gl-matrix";
import Component from "./component";

//Has a shader and render function
//Designed to be combined via compisition with other components inside an object class
export default class RenderableComponent extends Component
{
    material: Material;

    vertices: number[] = []; //8 values for each - x, y, z , nx, ny, nz, u, v 
    indices: number[] = [];

    constructor(material : Material)
    {
        super();

        this.material = material;
    }
}