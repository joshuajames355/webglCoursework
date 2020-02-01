import Mesh from "./mesh";

export class Cube extends Mesh
{
    Cube(gl : WebGL2RenderingContext)
    {
        this.vertices = [
            0, 0, 0,
            0, 0, 1,
            0, 1, 0,
            0, 1, 1,
            1, 0, 0,
            1, 0, 1,
            1, 1, 0,
            1, 1, 1
        ];

        this.indices = [0, 1, 2, 3, 1, 2, // x=0 
                        4, 5, 6, 7, 5, 6, // x=1 
                        0, 1, 4, 5, 1, 4, // y=0 
                        2, 3, 6, 7, 3, 6, // y=1 
                        0, 2, 4, 6, 2, 4, // z=0
                        1, 3, 5, 7, 3, 5  // z=1
        ];

        this.setupVAO(gl);
    }
}

export class Triangle extends Mesh
{
    constructor(gl : WebGL2RenderingContext)
    {
        super();
        this.vertices = [
            -0.5,  0.5, 0.0,
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0, 
        ];

        this.indices = [0, 1, 2];
        
        this.setupVAO(gl);
    }
}