import { GunObject, ButtonObject, CubeObject } from "./simpleMesh";
import { vec3, mat4 } from "gl-matrix";
import FlyingCamera from "./flyingCamera";


function main()
{
    var el = document.getElementById("root");
    if (el == null) return;

    const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
    if (canvas == null)
    {
        el.innerHTML="Erorr";
        return;
    }

    canvas.onclick = () => {
        canvas.requestPointerLock()};


    const gl : WebGL2RenderingContext | null = canvas.getContext("webgl2");

    // Only continue if WebGL is available and working
    if (gl === null) {
        el.innerHTML = "Unable to initialize WebGL.";
        return;
    }

    var game = new Game(gl);
}

class Game
{
    camera : FlyingCamera;
    gun : GunObject;
    cube : CubeObject;
    gl : WebGL2RenderingContext;
    button : ButtonObject;

    lastFrameTime : number;

    constructor(gl : WebGL2RenderingContext)
    {
        this.camera = new FlyingCamera();
        this.button = new ButtonObject(gl);
        this.gun = new GunObject(gl);
        this.cube = new CubeObject(gl);

        this.gun.move(vec3.fromValues(0, 0, -10 ));
        this.cube.move(vec3.fromValues(4, 4, -15 ));
        this.button.move(vec3.fromValues(-4, 4, -15));
        this.button.rotateX(90);

        this.gl = gl;
        this.lastFrameTime = (new Date()).getTime() / 1000;

        this.onAnimationFrame(); //Starts main loop
    }

    onAnimationFrame()
    {
        var time = (new Date()).getTime() / 1000;
        var deltaTime = time - this.lastFrameTime;
        this.lastFrameTime = time;

        this.render();
        this.tick(deltaTime);

        requestAnimationFrame(this.onAnimationFrame.bind(this));
    }

    render()
    {
        var view : mat4 = this.camera.getViewMatrix();
        var projection : mat4 = this.camera.getProjectionMatrix();

        this.gl.enable(this.gl.DEPTH_TEST);
        // Set clear color to black, fully opaque
        this.gl.clearColor(0, 0, 0, 1.0);
        // Clear the color buffer with specified clear color
        this.gl.clear(this.gl.COLOR_BUFFER_BIT  | this.gl.DEPTH_BUFFER_BIT);

        this.button.render(this.gl, view, projection);
        this.gun.render(this.gl, view, projection);  
        this.cube.render(this.gl, view, projection);
    }

    tick(deltaTime : number)
    {
        this.gun.tick(deltaTime);
    }
}

window.onload = main;