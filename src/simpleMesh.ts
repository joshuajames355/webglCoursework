import Mesh from "./staticMesh";
import ShaderProgram from "./shaders";
import RenderObject from "./renderObject";
import { mat4, vec3 } from "gl-matrix";
import StaticMesh from "./staticMesh";
import { Texture } from "./texture";
import { Skybox } from "./skybox";

const fragmentSource = require("./shaders/fragment.glsl");
const fragmentTextureSource = require("./shaders/fragmentTexture.glsl");
const vertexSource = require("./shaders/vertex.glsl");
const gunModel = require("./assets/M82.obj");

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

const buttonModel = require("./assets/Button.obj");
const buttonTexture = require("./assets/ButtonTexture.png").default;

export class ButtonObject extends RenderObject
{
    button : StaticMesh;
    buttonTexture : Texture;

    constructor(gl : WebGL2RenderingContext)
    {
        super();

        this.buttonTexture = new Texture(gl, buttonTexture);
        this.button = StaticMesh.fromOBJ(buttonModel, new ShaderProgram(gl,vertexSource, fragmentTextureSource, this.buttonTexture));
    }

    render(gl : WebGL2RenderingContext ,viewMatrix : mat4, projectionMatrix : mat4)
    {
        this.button.render(gl, this.getModelMatrix(), viewMatrix, projectionMatrix);
    }
}

const image1 = require("./assets/skybox/skyrender0001.png").default;
const image2 = require("./assets/skybox/skyrender0002.png").default;
const image3 = require("./assets/skybox/skyrender0003.png").default;
const image4 = require("./assets/skybox/skyrender0004.png").default;
const image5 = require("./assets/skybox/skyrender0005.png").default;
const image6 = require("./assets/skybox/skyrender0006.png").default;

export class SkyboxExample extends Skybox
{
    constructor(gl : WebGL2RenderingContext)
    {
        var images = [image4, image1, image3, image6, image2, image5]
        super(gl, images);
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
