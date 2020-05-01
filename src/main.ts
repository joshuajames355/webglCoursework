import { GunObject, CubeObject, ButtonObject, EXAMPLE_SKYBOX, LightObject, DoorObject, Carpet, TableObject, SofaObject, Wall, TV, LightBulb} from "./meshes";
import { vec3, mat4, vec4 } from "gl-matrix";
import FlyingCamera from "./core/flyingCamera";
import { WebGLRenderer } from "./webgl/webGLRenderer";
import { Material } from "./core/material";
import GameObject from "./core/object";
import FPSCamera from "./core/fpsCamera";


function main()
{
    const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
    if (canvas == null)
    {
        console.log("Failed to get canvas");
        return;
    }

    var renderer = new WebGLRenderer(canvas);
    renderer.setBackgroundColour(vec4.fromValues(0,0,1,1));
    var game = new Game(renderer);
}

class Game
{
    camera : FPSCamera;
    renderer : WebGLRenderer;
    fpsCap : number = 60;

    constructor(renderer : WebGLRenderer)
    {
        this.renderer = renderer;

        this.camera = new FPSCamera();
        this.renderer.setCamera(this.camera);

        var gun = new GunObject();
        var cube = new LightObject();
        var door = new DoorObject();
        var table = new TableObject();
        var table2 = new TableObject();
        var table3 = new TableObject();
        var sofa = new SofaObject();
        var sofa2 = new SofaObject();
        var sofa3 = new SofaObject();
        var sofa4 = new SofaObject();
        var lightBulb = new LightBulb();
        var button = new ButtonObject();

        var tv = new TV();
        
        var wall1 = new Wall();
        var wall2 = new Wall();
        var wall3 = new Wall();
        var wall4 = new Wall();
        var wall5 = new Wall();

        var roof = new Wall();

        this.renderer.setSkybox(Material.createSkybox(EXAMPLE_SKYBOX));

        this.camera.moveForward(-5);

        gun.move(vec3.fromValues(6, -2, -6 ));
        cube.move(vec3.fromValues(-9, 3, 9));
        table.move(vec3.fromValues(-4, -3, 7));
        table2.move(vec3.fromValues(4,-3, 7))
        table3.move(vec3.fromValues(0,-3, -3))

        sofa.move(vec3.fromValues(8.5,-2.25,8.5));
        sofa2.move(vec3.fromValues(8.5,-2.25,2));
        sofa2.setScaleVector(vec3.fromValues(1, 1, -1));
        sofa3.move(vec3.fromValues(-8.5,-2.25,8.5));
        sofa3.setScaleVector(vec3.fromValues(-1, 1, 1));
        sofa4.move(vec3.fromValues(-8.5,-2.25,2));
        sofa4.setScaleVector(vec3.fromValues(-1, 1, -1));

        tv.move(vec3.fromValues(0, 1.5, -9.5));
        door.move(vec3.fromValues(-8.7,-0.4, -10))
        door.setScale(1.3);
        button.rotateZ(-90);
        button.move(vec3.fromValues(-9.5,0,-2))
        button.rotateY(19);

        lightBulb.move(vec3.fromValues(0,5,0));

        wall1.move(vec3.fromValues(0,0,10));
        wall1.rotateX(-90);
        wall1.setScale(20);

        wall2.move(vec3.fromValues(1.5,0,-10));
        wall2.rotateX(90);
        wall2.setScale(18);

        wall3.move(vec3.fromValues(10,0,0));
        wall3.rotateX(90);
        wall3.rotateZ(90);
        wall3.setScale(20);

        wall4.move(vec3.fromValues(-10,0,0));
        wall4.rotateX(90);
        wall4.rotateZ(-90);
        wall4.setScale(20);

        wall5.move(vec3.fromValues(-8.5,6.2,-10));
        wall5.rotateX(90);
        wall5.setScaleVector(vec3.fromValues(3,1,8));

        roof.setScale(20);
        roof.rotateZ(180)
        roof.move(vec3.fromValues(0,5,0));

        var carpet = new Carpet();
        carpet.move(vec3.fromValues(0,-3,0));
        carpet.setScale(20);

        this.renderer.addObject(gun);
        this.renderer.addObject(cube);
        this.renderer.addObject(door);
        this.renderer.addObject(carpet);
        this.renderer.addObject(table);
        this.renderer.addObject(table2);
        this.renderer.addObject(table3);
        this.renderer.addObject(sofa);
        this.renderer.addObject(tv);
        this.renderer.addObject(sofa2)
        this.renderer.addObject(sofa3)
        this.renderer.addObject(sofa4)
        this.renderer.addObject(wall1);
        this.renderer.addObject(wall2);
        this.renderer.addObject(wall3);
        this.renderer.addObject(wall4);
        this.renderer.addObject(wall5);
        this.renderer.addObject(roof);
        this.renderer.addObject(lightBulb);
        this.renderer.addObject(button);

        this.onAnimationFrame(); //Starts main loop
    }

    onAnimationFrame()
    {
        if(this.renderer.getDeltaTime() > 1/this.fpsCap)
        {
            this.renderer.render();
            var test = document.getElementById("fps");
            if( test != null)
            {
                test.textContent = this.renderer.getFPS().toPrecision(3) + " FPS";
            }

            var normalCheckbox : HTMLInputElement | null = document.getElementById("normal") as HTMLInputElement;
            if (normalCheckbox != null)
            {
                this.renderer.setDebugDrawNormals(normalCheckbox.checked);
            }
        }

        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }
}

window.onload = main;