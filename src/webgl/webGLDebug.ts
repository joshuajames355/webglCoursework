import RenderableComponent from "../core/renderableComponent";
import { WebGLComponentState } from "./webGLComponent";
import ShaderProgram from "./webGLShaders";
import { vec3 } from "gl-matrix";

const fragmentSource = require("./shaders/fragmentNormal.glsl");
const vertexSource = require("./shaders/vertexNormal.glsl");

//a quick and dirty debug function, very slow
function generateNormalArrays(component : RenderableComponent, length? : number) : number[]
{
    var startTime = Date.now();

    if(!length) length = 0.2;
    var newArray : number[] = [];
    for(var x: number = 0; x < component.vertices.length; x += 8)
    {
        var position = vec3.fromValues(component.vertices[x], component.vertices[x+1], component.vertices[x+2]);
        var normals = vec3.fromValues(component.vertices[x+3], component.vertices[x+4], component.vertices[x+5]);
        vec3.scaleAndAdd(normals, position, normals, length/vec3.len(normals));
        newArray = newArray.concat([position[0], position[1], position[2],
                                    normals[0], normals[1], normals[2]]);

    }

    var timeTaken = (Date.now() - startTime)/1000;
    console.log("NORMAL MESH GENERATION TOOK: " + timeTaken.toFixed(1) + " seconds");

    return newArray;
}

export function generateNormalShader(gl : WebGL2RenderingContext)
{
    return new ShaderProgram(gl, vertexSource, fragmentSource);
}

export function drawNormals(gl : WebGL2RenderingContext,component : RenderableComponent, state : WebGLComponentState)
{
    if(!state.normal || !state.normal.hasDoneSetup)
    {
        var newState = new WebGLComponentState();
        var data = generateNormalArrays(component);

        var newVBO = gl.createBuffer();
        if(newVBO == null)
        {
            throw "Failed to Create VBO"
        }
        newState.vbo = newVBO;
    
        var newVAO = gl.createVertexArray();
        if(newVAO == null)
        {
            throw "Failed to Create VAO"
        }
        newState.vao = newVAO;
    
        //setup VAO 
        gl.bindVertexArray(newState.vao);
    
        //setup VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, newState.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
        //bind Position attributes
        //pos
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3*4, 0);
        gl.enableVertexAttribArray(0);
        
        newState.hasDoneSetup = true;
        state.normal = newState;
    }
    else
    {
        gl.bindVertexArray(state.normal.vao);
    }
    gl.drawArrays(gl.LINES, 0, Math.floor(component.vertices.length/4));
    gl.bindVertexArray(null);
}