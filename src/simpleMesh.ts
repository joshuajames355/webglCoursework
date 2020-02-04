import Mesh from "./staticMesh";
import ShaderProgram from "./shaders";
import RenderObject from "./renderObject";
import { mat4, vec3 } from "gl-matrix";
import StaticMesh from "./staticMesh";
import { Texture } from "./texture";

const fragmentSource = require("./shaders/fragment.glsl");
const fragmentTextureSource = require("./shaders/fragmentTexture.glsl");
const vertexSource = require("./shaders/vertex.glsl");
const gunModel = require("./assets/M82.obj");

const buttonModel = require("./assets/Button.obj");
const buttonTexture = require("./assets/ButtonTexture.png").default;


//Contains some example objects and components

//Objects--------------------------------------------------------------------------

export class CubeObject extends RenderObject
{
    mesh1 : Mesh;

    constructor(gl : WebGL2RenderingContext)
    {
        super();

        this.mesh1 = new Cube(new ShaderProgram(gl,vertexSource, fragmentSource));
    }

    render(gl : WebGL2RenderingContext ,viewMatrix : mat4, projectionMatrix : mat4)
    {
        this.mesh1.render(gl, this.getModelMatrix(), viewMatrix, projectionMatrix);
    }
}

export class GunObject extends RenderObject
{
    gun : StaticMesh;

    constructor(gl : WebGL2RenderingContext)
    {
        super();

        this.gun = StaticMesh.fromOBJ(gunModel, new ShaderProgram(gl,vertexSource, fragmentSource));
    }

    render(gl : WebGL2RenderingContext ,viewMatrix : mat4, projectionMatrix : mat4)
    {
        this.gun.render(gl, this.getModelMatrix(), viewMatrix, projectionMatrix);
    }

    tick(deltatime : number)
    {
        this.rotateY(10 * deltatime);
    }
}

export class ButtonObject extends RenderObject
{
    button : StaticMesh;
    buttonTexture : Texture;

    constructor(gl : WebGL2RenderingContext)
    {
        super();

        this.buttonTexture = new Texture(gl, buttonTexture);
        this.button = StaticMesh.fromOBJ(buttonModel, new ShaderProgram(gl,vertexSource, fragmentTextureSource, this.buttonTexture));

        this.move(vec3.fromValues(-4, 4, -15));
        this.rotateX(90);
    }

    render(gl : WebGL2RenderingContext ,viewMatrix : mat4, projectionMatrix : mat4)
    {
        this.button.render(gl, this.getModelMatrix(), viewMatrix, projectionMatrix);
    }
}

//Components-----------------------------------------------------------------------------------

class Cube extends Mesh
{
    constructor(shaderProgram : ShaderProgram)
    {
        super(shaderProgram);

        this.vertices = [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 1, 0, 0, 0, 0, 0,
            1, 1, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0, 0,
        ];

        this.indices = [0, 1, 2, 3, 1, 2, // x=0 
                        4, 5, 6, 7, 5, 6, // x=1 
                        0, 1, 4, 5, 1, 4, // y=0 
                        2, 3, 6, 7, 3, 6, // y=1 
                        0, 2, 4, 6, 2, 4, // z=0
                        1, 3, 5, 7, 3, 5  // z=1
        ];
    }
}
