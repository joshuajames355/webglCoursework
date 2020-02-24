import { GunObject, CubeObject, ButtonObject} from "./simpleMesh";
import { vec3, mat4, vec4 } from "gl-matrix";
import FlyingCamera from "./core/flyingCamera";
import { WebGLRenderer } from "./webgl/webGLRenderer";


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
    //skybox : SkyboxExample;

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
        //this.skybox = new SkyboxExample(gl);

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
        this.renderer.render();

        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

}

window.onload = main;