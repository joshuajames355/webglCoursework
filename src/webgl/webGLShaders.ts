import { mat4, vec4, vec3, mat3 } from "gl-matrix";
import Texture from "../core/texture";

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

    lightPosLoc : WebGLUniformLocation | null = null;
    normalMatrixLoc : WebGLUniformLocation | null = null; 
    constructor(gl : WebGL2RenderingContext, vertexSource : string, fragmentSource : string)
    {
        this.program = createShaderProgramFromSource(gl, vertexSource, fragmentSource);

        this.modelViewProjectionLoc =  gl.getUniformLocation(this.program, "modelViewProjection");
        this.modelViewLoc = gl.getUniformLocation(this.program, "modelView");
        this.projectionLoc = gl.getUniformLocation(this.program, "projection");
        
        this.diffuseMapLoc = gl.getUniformLocation(this.program, "diffuseMap");
        this.diffuseConstantLoc = gl.getUniformLocation(this.program, "diffuseConstant");
        
        this.lightPosLoc = gl.getUniformLocation(this.program, "lightPos");
        this.normalMatrixLoc = gl.getUniformLocation(this.program, "normalMatrix");
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
        if(this.lightPosLoc)
        {
            var lightPos = vec4.fromValues(2, 2, -3, 1);
            vec4.transformMat4(lightPos, lightPos, viewMatrix);
            gl.uniform3fv(this.lightPosLoc, vec3.fromValues(lightPos[0], lightPos[1], lightPos[2]));
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
}