import {vec3 } from "gl-matrix";
import Component from "./component";

export class Light extends Component
{
    colour : vec3 = vec3.fromValues(1,1,1);

    constructor(colour? : vec3)
    {
        super();
        if (colour != null)
        {
            this.colour = colour;
        }
        
    }
}