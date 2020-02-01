import { Triangle } from "./simpleMesh";
import ShaderProgram from "./shaders";

const fragmentSource : string = require("./shaders/fragment.glsl").default;
const vertexSource : string = require("./shaders/vertex.glsl").default;


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

    const gl : WebGL2RenderingContext | null = canvas.getContext("webgl2");

    // Only continue if WebGL is available and working
    if (gl === null) {
        el.innerHTML = "Unable to initialize WebGL.";
        return;
    }

    var cube = new Triangle(gl);
    var shader = new ShaderProgram(gl, vertexSource, fragmentSource);

    gl.enable(gl.DEPTH_TEST);

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.5, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);


    //Render cube
    shader.use(gl);
    cube.render(gl);  
}

window.onload = main;