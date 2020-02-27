import {componentFromOBJ} from "./core/staticMesh";
import RenderableComponent from "./core/renderableComponent";
import GameObject from "./core/object";
import { Material } from "./core/material";
import { vec4 } from "gl-matrix";
import Texture from "./core/texture";

//Contains some example objects and components
//Objects--------------------------------------------------------------------------

export class CubeObject extends GameObject
{
    constructor()
    {
        super();

        var material = Material.fromColour(vec4.fromValues(1, 0, 0, 1.0));
        this.addComponent(new Cube(material));
    }
}

const image1 = new Texture( require("./assets/skybox/skyrender0001.png").default);
const image2 = new Texture( require("./assets/skybox/skyrender0002.png").default);
const image3 = new Texture( require("./assets/skybox/skyrender0003.png").default);
const image4 = new Texture( require("./assets/skybox/skyrender0004.png").default);
const image5 = new Texture( require("./assets/skybox/skyrender0005.png").default);
const image6 = new Texture( require("./assets/skybox/skyrender0006.png").default);

export const EXAMPLE_SKYBOX = [image4, image1, image3, image6, image2, image5];

export class CubeMapTest extends GameObject
{
    constructor()
    {
        super();

        var material = Material.fromDiffuseCubeMap(EXAMPLE_SKYBOX);
        this.addComponent(new Cube(material));
    }
}

const gunModel = require("./assets/M82.obj");
export class GunObject extends GameObject
{
    constructor()
    {
        super();

        var material = Material.fromColour(vec4.fromValues(0, 0, 0, 1.0));
        this.addComponent(componentFromOBJ(gunModel, material))
    }

    tick(deltatime : number)
    {
        this.rotateY(10 * deltatime);
    }
}


const buttonModel = require("./assets/Button.obj");
const buttonTexture = require("./assets/ButtonTexture.png").default;

export class ButtonObject extends GameObject
{
    buttonTexture : Texture;

    constructor()
    {
        super();

        this.buttonTexture = new Texture(buttonTexture);
        this.addComponent(componentFromOBJ(buttonModel, Material.fromDiffuseMap(this.buttonTexture)));
    }
}

//Components-----------------------------------------------------------------------------------

class Cube extends RenderableComponent
{
    constructor(material : Material)
    {
        super(material);

        this.vertices = [
            -0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 0.0, 0.0,
            0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 0.0, 0.0,
           -0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 0.0, 0.0,
           -0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 0.0, 0.0,
       
           -0.5, -0.5,  0.5,  0.0,  0.0, 1.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  0.0,  0.0, 1.0, 0.0, 0.0,
            0.5,  0.5,  0.5,  0.0,  0.0, 1.0, 0.0, 0.0,
            0.5,  0.5,  0.5,  0.0,  0.0, 1.0, 0.0, 0.0,
           -0.5,  0.5,  0.5,  0.0,  0.0, 1.0, 0.0, 0.0,
           -0.5, -0.5,  0.5,  0.0,  0.0, 1.0, 0.0, 0.0,
       
           -0.5,  0.5,  0.5, -1.0,  0.0,  0.0, 0.0, 0.0,
           -0.5,  0.5, -0.5, -1.0,  0.0,  0.0, 0.0, 0.0,
           -0.5, -0.5, -0.5, -1.0,  0.0,  0.0, 0.0, 0.0,
           -0.5, -0.5, -0.5, -1.0,  0.0,  0.0, 0.0, 0.0,
           -0.5, -0.5,  0.5, -1.0,  0.0,  0.0, 0.0, 0.0,
           -0.5,  0.5,  0.5, -1.0,  0.0,  0.0, 0.0, 0.0,
       
            0.5,  0.5,  0.5,  1.0,  0.0,  0.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  1.0,  0.0,  0.0, 0.0, 0.0,
            0.5, -0.5, -0.5,  1.0,  0.0,  0.0, 0.0, 0.0,
            0.5, -0.5, -0.5,  1.0,  0.0,  0.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  1.0,  0.0,  0.0, 0.0, 0.0,
            0.5,  0.5,  0.5,  1.0,  0.0,  0.0, 0.0, 0.0,
       
           -0.5, -0.5, -0.5,  0.0, -1.0,  0.0, 0.0, 0.0,
            0.5, -0.5, -0.5,  0.0, -1.0,  0.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  0.0, -1.0,  0.0, 0.0, 0.0,
            0.5, -0.5,  0.5,  0.0, -1.0,  0.0, 0.0, 0.0,
           -0.5, -0.5,  0.5,  0.0, -1.0,  0.0, 0.0, 0.0,
           -0.5, -0.5, -0.5,  0.0, -1.0,  0.0, 0.0, 0.0,
       
           -0.5,  0.5, -0.5,  0.0,  1.0,  0.0, 0.0, 0.0,
            0.5,  0.5, -0.5,  0.0,  1.0,  0.0, 0.0, 0.0,
            0.5,  0.5,  0.5,  0.0,  1.0,  0.0, 0.0, 0.0,
            0.5,  0.5,  0.5,  0.0,  1.0,  0.0, 0.0, 0.0,
           -0.5,  0.5,  0.5,  0.0,  1.0,  0.0, 0.0, 0.0,
           -0.5,  0.5, -0.5,  0.0,  1.0,  0.0, 0.0, 0.0,
        ];

        this.indices = Array.from(Array(36).keys())
    }
}
