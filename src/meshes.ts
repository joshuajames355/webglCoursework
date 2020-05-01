import {componentFromOBJ} from "./core/staticMesh";
import RenderableComponent from "./core/renderableComponent";
import GameObject from "./core/object";
import { Material } from "./core/material";
import { vec4, vec3 } from "gl-matrix";
import Texture from "./core/texture";
import { Plane, Cube } from "./core/basicComponents";
import { Light } from "./core/light";

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
export class LightObject extends GameObject
{
    constructor()
    {
        super();

        var material = Material.fromColour(vec4.fromValues(1, 1, 0, 1.0));
        this.addComponent(new Cube(material));
        this.addComponent(new Light(vec3.fromValues(0.5, 0.5, 0)));
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

        var material = Material.fromColour(vec4.fromValues(0.165, 0.204, 0.224, 1.0));
        this.setScale(0.4)
        this.addComponent(componentFromOBJ(gunModel, material))
    }

    tick(deltatime : number)
    {
        this.rotateY(10 * deltatime);
    }
}


const buttonModel = require("./assets/Button.obj");
const buttonTexture = require("./assets/ButtonTexture.png").default;
const buttonSpecular = require("./assets/ButtonSpecular.png").default;

export class ButtonObject extends GameObject
{
    time : number = 0;
    constructor()
    {
        super();

        var diffuseMap = new Texture(buttonTexture);
        var specularMap = new Texture(buttonSpecular);

        this.addComponent(componentFromOBJ(buttonModel, Material.fromDiffuseSpecular(diffuseMap, specularMap)));
    }
    tick(deltatime : number)
    {
        this.time = (this.time + deltatime)%10;
        
        var value = 1;
        if (this.time > 9)
        {
            value = Math.cos((this.time - 9) * 2 * Math.PI)/3 + 2/3
        }


        this.setScaleVector(vec3.fromValues(0.8, value, 0.8))
    }
}

const tableModel = require("./assets/table.obj");
const tableTexture = require("./assets/tableDiffuse.jpg").default;
const tableSpecular = require("./assets/tableSpecular.jpg").default;

export class TableObject extends GameObject
{

    constructor()
    {
        super();

        var diffuseMap = new Texture(tableTexture);
        var specularMap = new Texture(tableSpecular)

        this.addComponent(componentFromOBJ(tableModel, Material.fromDiffuseSpecular(diffuseMap, specularMap)));
    }
}

const sofaModel = require("./assets/sofa.obj");
const sofaTexture = require("./assets/sofaDiffuse.jpg").default;
const cushionModel = require("./assets/cushion.obj");
const cushionTexture = require("./assets/cushionDiffuse.jpg").default;

export class SofaObject extends GameObject
{

    constructor()
    {
        super();

        var diffuseMap = new Texture(sofaTexture);
        var mat = Material.fromDiffuseMap(diffuseMap)
        mat.setSpecularConstant(0.01)


        var comp = componentFromOBJ(sofaModel, mat);
        comp.setScale(1.5);
        this.addComponent(comp);

        var cushionMat = Material.fromDiffuseMap(new Texture(cushionTexture));
        cushionMat.setSpecularConstant(0.01);

        var cushion = componentFromOBJ(cushionModel, cushionMat)
        cushion.rotateZ(90);
        cushion.move(vec3.fromValues(1, 1, -1));
        cushion.setScaleVector(vec3.fromValues(1,1,1));

        var cushion2 = componentFromOBJ(cushionModel, cushionMat)
        cushion2.move(vec3.fromValues(-0.5, 1, 0.5));
        cushion2.rotateZ(90);
        cushion2.rotateX(90);
        cushion2.setScaleVector(vec3.fromValues(1,1 ,0.5));

        this.addComponent(cushion)
        this.addComponent(cushion2)
    }
}

const doorModel = require("./assets/door.obj");
const doorTexture = require("./assets/DoorDiffuse.jpg").default;
const doorSpecular = require("./assets/DoorSpecular.jpg").default;

const handleModel = require("./assets/handle.obj");
const handleTexture = require("./assets/HandleDiffuse.jpg").default;
const handleSpecular = require("./assets/HandleSpecular.jpg").default;


export class DoorObject extends GameObject
{
    totalTime : number = 0;


    constructor()
    {
        super();

        var diffuseMap = new Texture(doorTexture);
        var specMap = new Texture(doorSpecular)
        var mat = Material.fromDiffuseSpecular(diffuseMap, specMap);
        this.addComponent(componentFromOBJ(doorModel, mat));

        var diffuseMapHandle = new Texture(handleTexture);
        var specMapHandle = new Texture(handleSpecular)
        var matHandle = Material.fromDiffuseSpecular(diffuseMapHandle, specMapHandle);
        var handle = componentFromOBJ(handleModel, matHandle);

        this.addComponent(handle);


    }

    tick(deltatime : number)
    {
        this.totalTime = (this.totalTime + deltatime) % 15;
        this.setRotationEuler(0, -45 - 45*Math.cos(Math.min(2*Math.PI, this.totalTime)), 0)
    }
}

const carpetTexture = require("./assets/carpet.jpg").default;
export class Carpet extends GameObject
{
    constructor()
    {
        super();

        var diffuseMap = new Texture(carpetTexture);
        var mat = Material.fromDiffuseMap(diffuseMap);
        mat.enableTiling(4,4);
        mat.setSpecularConstant(0);

        this.addComponent(new Plane(mat));
    }
}

const wallTexture = require("./assets/wall.jpg").default;
export class Wall extends GameObject
{
    constructor()
    {
        super();

        var diffuseMap = new Texture(wallTexture);
        var mat = Material.fromDiffuseMap(diffuseMap);
        mat.setSpecularConstant(0.01);

        this.addComponent(new Plane(mat));
    }
}

const tvTexture = require("./assets/tv.jpg").default;
export class TV extends GameObject
{
    time : number = 0;
    constructor()
    {
        super();
        var mat = Material.fromDiffuseMap(new Texture(tvTexture));
        mat.setSpecularConstant(0.8);

        var comp = new Plane(mat);
        comp.setScaleVector(vec3.fromValues(-7, 1, 3.375));
        comp.rotateX(90);
        comp.rotateY(180);
        this.addComponent(comp);
    }

    tick(deltatime : number)
    {
        this.time = (this.time + deltatime)%45;
        var startTime = 10;

        if (this.time < startTime){
            this.setRotationEuler(0,0,0);
        }
        else if (this.time < 40)
        {
            var angle = Math.min(90, Math.pow(5*(this.time-startTime), 2))
            this.setRotationEuler(0,0,angle);
        }
        else
        {
            this.setRotationEuler(0,0,90 - (this.time - 40)*18);
        }

    }
}

const lightModel = require("./assets/lightBulb.obj");
const lightTexture = require("./assets/lampDiffuse.jpg").default;

export class LightBulb extends GameObject
{
    time : number = 0;
    constructor()
    {
        super();

        var diffuseMap = new Texture(lightTexture);

        var lightBulb = componentFromOBJ(lightModel, Material.fromDiffuseMap(diffuseMap));
        lightBulb.setScaleVector(vec3.fromValues(0.25, 0.35, 0.25))
        this.addComponent(lightBulb);

        var light = new Light(vec3.fromValues(0.5, 0.5, 0.5));
        light.move(vec3.fromValues(0,-1.9,0));
        this.addComponent(light);
    }

    tick(deltatime : number)
    {
        this.time += deltatime;
        this.setRotationEuler(0,0,40*Math.sin(this.time))
    }
}