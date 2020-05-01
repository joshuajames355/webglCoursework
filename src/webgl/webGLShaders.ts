import { mat4, vec4, vec3, mat3 } from "gl-matrix";
import Texture from "../core/texture";
import { Light } from "../core/light";

//type is gl.VERTEX_SHADER, gl.FRAGMENT_SHADER etc
function createShader(gl : WebGL2RenderingContext, source : string, type : number) : WebGLShader
{
    var shader = gl.createShader(type);
    if(shader == null)
    {
        throw "Failed to Create shader";
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log(gl.getShaderInfoLog(shader));
        console.log("Shader Failed: ")
        console.log(source);
        throw "Failed to compile shader";
    }
    return shader;
}
const createVertexShader = (gl : WebGL2RenderingContext, source : string) => createShader(gl, source, gl.VERTEX_SHADER);
const createFragmentShader = (gl : WebGL2RenderingContext, source : string) => createShader(gl, source, gl.FRAGMENT_SHADER);

//creates a program from two shaders
function createShaderProgram(gl : WebGL2RenderingContext, vertexShader : WebGLShader, fragmentShader : WebGLShader) : WebGLProgram
{
    var program = gl.createProgram();
    if(program == null)
    {
        throw "Failed to Create shader Program";
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.log(gl.getProgramInfoLog(program));
        throw "Failed to link shader program";
    }
    return program;
}

function createShaderProgramFromSource(gl : WebGL2RenderingContext, vertexSource : string, fragmentSource: string) : WebGLProgram
{
    var vertexShader = createVertexShader(gl, vertexSource);
    var fragmentShader = createFragmentShader(gl, fragmentSource);
    return createShaderProgram(gl, vertexShader, fragmentShader);
}

export default class ShaderProgram
{
    program : WebGLProgram;

    modelViewLoc : WebGLUniformLocation | null = null;
    modelViewProjectionLoc : WebGLUniformLocation | null = null;
    projectionLoc : WebGLUniformLocation | null = null;

    diffuseMapLoc : WebGLUniformLocation | null = null;
    diffuseConstantLoc : WebGLUniformLocation | null = null;

    specularMapLoc : WebGLUniformLocation | null = null;
    specularConstantLoc : WebGLUniformLocation | null = null;

    normalMatrixLoc : WebGLUniformLocation | null = null; 

    tileXLoc : WebGLUniformLocation | null = null;
    tileYLoc : WebGLUniformLocation | null = null;

    lightColourLocs : WebGLUniformLocation[] = [];
    lightPosLocs : WebGLUniformLocation[] = [];

    constructor(gl : WebGL2RenderingContext, vertexSource : string, fragmentSource : string)
    {
        this.program = createShaderProgramFromSource(gl, vertexSource, fragmentSource);
        gl.useProgram(this.program)

        this.modelViewProjectionLoc =  gl.getUniformLocation(this.program, "modelViewProjection");
        this.modelViewLoc = gl.getUniformLocation(this.program, "modelView");
        this.projectionLoc = gl.getUniformLocation(this.program, "projection");
        
        this.diffuseMapLoc = gl.getUniformLocation(this.program, "diffuseMap");
        this.diffuseConstantLoc = gl.getUniformLocation(this.program, "diffuseConstant");
        if(this.diffuseMapLoc)
        {
            gl.uniform1i(this.diffuseMapLoc, 0);
        }

        this.specularMapLoc = gl.getUniformLocation(this.program, "specularMap");
        this.specularConstantLoc = gl.getUniformLocation(this.program, "specularConstant");
        if(this.specularMapLoc)
        {
            gl.uniform1i(this.specularMapLoc, 1);
        }
        
        this.normalMatrixLoc = gl.getUniformLocation(this.program, "normalMatrix");

        this.tileXLoc = gl.getUniformLocation(this.program, "tileX");
        this.tileYLoc = gl.getUniformLocation(this.program, "tileY");

        var i : number = 0;
        while (true)
        {
            var lightPosLoc = gl.getUniformLocation(this.program, "lightArr[" + i.toString() + "].pos")
            var lightColourLoc = gl.getUniformLocation(this.program, "lightArr[" + i.toString() + "].colour")

            if(lightColourLoc != null && lightPosLoc != null)
            {
                this.lightColourLocs.push(lightColourLoc);
                this.lightPosLocs.push(lightPosLoc);
                i++;
            }
            else
            {
                break;
            }
        }
    }

    use(gl : WebGL2RenderingContext)
    {
        gl.useProgram(this.program);
    }

    bindUniforms(gl : WebGL2RenderingContext, modelMatrix : mat4, viewMatrix : mat4, projectionMatrix : mat4)
    {
        var modelView : mat4 = mat4.create();
        mat4.mul(modelView, viewMatrix, modelMatrix);

        var modelViewProjection : mat4 = mat4.create();
        mat4.mul(modelViewProjection, projectionMatrix, modelView);

        if(this.modelViewProjectionLoc)
        {
            gl.uniformMatrix4fv(this.modelViewProjectionLoc, false, modelViewProjection);
        }
        if(this.modelViewLoc)
        {
            gl.uniformMatrix4fv(this.modelViewLoc, false, modelView);
        }
        if(this.projectionLoc)
        {
            gl.uniformMatrix4fv(this.projectionLoc, false, projectionMatrix);
        }
        if(this.normalMatrixLoc)
        {
            //mat3(transpose(inverse(modelView)))
            var output = mat4.create();
            mat4.invert(output, modelView);
            mat4.transpose(output, output);
            var outputMat3 = mat3.create();
            mat3.fromMat4(outputMat3, output);

            gl.uniformMatrix3fv(this.normalMatrixLoc, false, outputMat3);
        }
    }

    bindDiffuseColour(gl : WebGL2RenderingContext, colour : vec4)
    {
        if(this.diffuseConstantLoc)
        {
            gl.uniform4fv(this.diffuseConstantLoc, colour);
        }
    }
    bindSpecularConstant(gl : WebGL2RenderingContext, num : number)
    {
        if(this.specularConstantLoc)
        {
            gl.uniform1f(this.specularConstantLoc, num);
        }
    }
    bindTileConstants(gl : WebGL2RenderingContext, tileX : number, tileY : number)
    {
        if(this.tileXLoc)
        {
            gl.uniform1f(this.tileXLoc, tileX);
        }
        if(this.tileYLoc)
        {
            gl.uniform1f(this.tileYLoc, tileY);
        }
    }

    bindLights(gl : WebGL2RenderingContext, lights : Light[], lightPos : vec3[])
    {
        for (var i : number = 0; i < Math.min(this.lightColourLocs.length, this.lightPosLocs.length, lights.length); i++)
        {
            gl.uniform3fv(this.lightColourLocs[i], lights[i].colour);
            gl.uniform3fv(this.lightPosLocs[i], lightPos[i]);
        }
    }
}