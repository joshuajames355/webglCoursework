import { GunObject, CubeObject, ButtonObject, EXAMPLE_SKYBOX} from "./simpleMesh";
import { vec3, mat4, vec4 } from "gl-matrix";
import FlyingCamera from "./core/flyingCamera";
import { WebGLRenderer } from "./webgl/webGLRenderer";
import { Material } from "./core/material";


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
    camera : FlyingCamera;
    gun : GunObject;
    cube : CubeObject;

    renderer : WebGLRenderer;
    button : ButtonObject;

    constructor(renderer : WebGLRenderer)
    {
        this.renderer = renderer;

        this.camera = new FlyingCamera();
        this.renderer.setCamera(this.camera);

        this.button = new ButtonObject();
        this.gun = new GunObject();
        this.cube = new CubeObject();

        this.renderer.setSkybox(Material.createSkybox(EXAMPLE_SKYBOX));

        this.gun.move(vec3.fromValues(0, 0, -10 ));
        this.cube.move(vec3.fromValues(4, 4, -15 ));
        this.button.move(vec3.fromValues(-4, 4, -15));
        this.button.rotateX(90);

        this.renderer.addObject(this.gun);
        this.renderer.addObject(this.cube);
        this.renderer.addObject(this.button);

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
        }

        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

}

window.onload = main;