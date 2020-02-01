import { Cube, Triangle } from "./simpleMesh";

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

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if(fragmentShader == null)
    {
        el.innerHTML="Erorr";
        return;
    }
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    console.log(gl.getShaderInfoLog(fragmentShader));

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if(vertexShader == null)
    {
        el.innerHTML="Erorr";
        return;
    }
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    console.log(gl.getShaderInfoLog(vertexShader));

    var program = gl.createProgram();
    if(program == null)
    {
        el.innerHTML="Erorr";
        return;
    }
    console.log(vertexSource)

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.enable(gl.DEPTH_TEST);

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.5, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);


    //Render cube
    gl.useProgram(program);
    cube.render(gl);  
}

function mainLoop(gl : WebGL2RenderingContext)
{
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);


    //Render cube
    //gl.useProgram(program);
    //cube.render(gl);    
}

window.onload = main;